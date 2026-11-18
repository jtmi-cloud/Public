# Cloudflare-only contact form pilot

This pilot is on the **feature/cloudflare-contact-form** branch of jtmi-cloud/Public. It adds /contact.html and the Cloudflare Pages Function at /api/contact. It remains a draft PR and is not approved for production.

## Email architecture

Page > Cloudflare Turnstile > Pages Function > Cloudflare Email Service REST API > Microsoft 365 recipient.

No Resend subscription or Resend credentials are required. The Cloudflare REST API is used rather than assuming a native send_email binding is configured for Pages Functions.

## Cloudflare configuration

1. Use a Cloudflare-managed DNS domain for sending. In Cloudflare dashboard, Compute > Email Service > Email Sending, onboard a suitable sending domain or subdomain; authenticate the Cloudflare-provided SPF, DKIM, DMARC and bounce DNS records. Avoid disrupting existing Microsoft 365 MX, SPF or DKIM records.
2. In Cloudflare Turnstile, create a dedicated Managed widget covering the lab preview hostname. Replace REPLACE_WITH_TURNSTILE_SITE_KEY in contact.html with its public site key.
3. Configure these Pages environment variables/secrets for the **preview** deployment:
   - TURNSTILE_SECRET_KEY (secret): widget secret
   - CLOUDFLARE_EMAIL_API_TOKEN (secret): least-privilege Cloudflare API token with Email Sending: Edit only
   - CLOUDFLARE_ACCOUNT_ID: JTMi Cloud account ID
   - CONTACT_TO_EMAIL: verified Microsoft 365 destination address
   - CONTACT_FROM_EMAIL: sender using the authenticated sending domain
4. Redeploy preview. Test invalid/missing fields and absent Turnstile, then send a genuine valid enquiry; verify Cloudflare Email Service acceptance **and** mailbox receipt, including Reply-To.
5. Before production, add rate limiting and ensure the selected destination domain and Pages project are correct.

## Availability and pricing checked 19 November 2026

- Cloudflare Workers Paid is a minimum USD $5 per month per account (if not already paid). Cloudflare Email Sending to arbitrary recipients: 3,000 included sends per month on Workers Paid, then USD $0.35 per 1,000.
- Sends to verified destination addresses: free on Workers Free and Paid, even when only Email Routing is enabled.
- See https://developers.cloudflare.com/email-service/platform/pricing/ and https://developers.cloudflare.com/email-service/get-started/send-emails/
- The Cloudflare account's Email Sending limits endpoint returned HTTP 401 Unauthorized for the existing connector, so plan eligibility and activation have NOT been confirmed.
- The account has no verified Email Routing destination addresses according to the account query.
- No spending or account billing change has been authorised.


## Reusable multi-website recipient design (19 November 2026)

For each site, configure its own server-side CONTACT_TO_EMAIL value (for example `info@customer-domain.example`) rather than accepting a destination address from the visitor's form. A recipient is a real existing mailbox or mail-enabled alias, not automatically created by this form.

- Register each recipient once in Cloudflare Email Service > Email Routing > Destination Addresses. Each recipient must confirm its verification email, after which free outbound notifications to that verified destination are supported on both Workers Free and Workers Paid.
- Destination addresses are account-wide and can be reused across domains in the same Cloudflare account. Maintain a small controlled registry mapping Pages project/site to the verified destination mailbox; avoid client-controlled recipient overrides.
- Use a **separate authorised sender address** for all notifications, distinct from the destination; set Reply-To to the form submitter. Sender authentication and availability require configuration/testing.
- Keep each customer domain's existing Microsoft 365 MX and mail flow untouched. **Do not enable Cloudflare Email Routing for a domain using Microsoft 365 inbound mail**: this would require replacing the MX records and is not necessary to send form enquiries.
- Cloudflare documentation says that on the free route, messages to verified recipients can be sent from routing domains, but the precise sending-domain onboarding path and Cloudflare Email Sending API access for the JTMi Cloud account remain unverified. Do not promise a working free service until a real delivery test passes.
- JTMi Cloud check: `jtmi.au` Email Routing reported disabled/unconfigured. Account verified destinations were empty. Email Sending limits and sending-subdomain endpoints returned HTTP 401, so enabling/permission requirements still need resolution.
- Set up and test with a known test mailbox first, then roll out to client sites only after successful receipt and explicit selection of each existing mailbox.
- Preserve the draft PR and no-production-deploy workflow until Turnstile, recipient verification, delivery, and reply handling all pass.

Relevant Cloudflare docs:
https://developers.cloudflare.com/email-service/configuration/email-routing-addresses/
https://developers.cloudflare.com/email-service/platform/limits/
https://developers.cloudflare.com/email-service/configuration/domains/

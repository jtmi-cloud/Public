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

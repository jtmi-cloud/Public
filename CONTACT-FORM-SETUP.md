# Contact form pilot

This non-production pilot lives at /contact.html on the Cloudflare Lab Pages site, with the server-side endpoint at /api/contact. It uses Pages Functions, Cloudflare Turnstile (server-side token verification), and Resend's email API. No third-party secrets should be committed to GitHub.

## Required configuration (Cloudflare Pages project: public)

1. Create a Cloudflare Turnstile widget for the hostname(s) where the form will run. Replace REPLACE_WITH_TURNSTILE_SITE_KEY in contact.html with its PUBLIC site key.
2. Add the following encrypted environment secrets to **both relevant environments** in Cloudflare Pages settings:
   - TURNSTILE_SECRET_KEY: matching Turnstile secret
   - RESEND_API_KEY: restricted Resend API key
   - CONTACT_TO_EMAIL: verified destination Microsoft 365 mailbox
   - CONTACT_FROM_EMAIL: authenticated sender on a domain configured with Resend SPF/DKIM
3. Redeploy the preview; send a real test enquiry and verify receipt and Reply-To in Microsoft 365. Test empty fields, invalid email, missing Turnstile, and email-provider failure.
4. Do not merge until tests pass and the intended website is confirmed. This pilot does not alter any JTMi production websites.

## Security notes

The endpoint refuses submissions until configured. It validates input and Turnstile server-side, uses a honeypot, bounds field lengths, does not expose API keys in the browser, and returns generic email delivery errors. For sustained production use, add rate limiting and operational monitoring. Do not collect sensitive personal data in the message form.

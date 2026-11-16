# The BTH 12Rs membership concept

Prepared for Em Charlton by JTMi Services, 16 November 2026.

## Deployment

- GitHub: jtmi-cloud/Public, branch concept/the12rs
- Cloudflare Pages: the12rs-concept
- Static output: concepts/the12rs; no build command
- Existing main branch and its Pages project are unchanged.
- Automatic Git-triggered production deployments from the concept branch.
- No paid services, environment secrets, analytics or server-side functions.

## Current direction

The public site contains only programme teasers. The original wheel, chapter-by-chapter prompts, public chapter explorer and check-in demo have been removed from the current deployment and source tree. No full chapter materials are included on any page. Previously published project material remains on the original source website and in Git history.

## Memberships

Household: free for personal and household use; proposed monthly programme journey, practical household resources, own action/progress record and community updates.

Business: paid, with price to be agreed; proposed agreed team access, workplace resources, named coordinator and team participation reporting.

Corporate: paid, with price to be agreed; proposed Business benefits plus coordination across agreed teams/sites, organisation participation reporting and rollout planning.

Local councils and state government: call for pricing; tailored programme scope, audience, licence, resources, coordination and reporting. They do not use Household sign-up.

Benefits are proposed for Em’s review. No prices, participant limits, billing periods, GST treatment, licence terms or support levels are invented. Workshops and talks are separately quoted paid services.

## Preview pages

- index.html: story, imagery, teasers and tier benefits
- signup.html?plan=household|business|corporate: membership-aware joining flow
- signin.html: illustrative sign-in; passwords disabled and no authentication
- payment.html?plan=business|corporate: order review; payment disabled pending agreed pricing
- contact.html?type=council|state|business|corporate: pricing enquiry preview
- members.html?plan=household|business|corporate: member layout sample with no actual programme content

No account, session, entitlement, payment, email or enquiry is created. No personal values are stored or transmitted. Query parameters contain plan/type only. Household signup goes directly to the member layout; paid plans go to payment review; government selection switches to a pricing enquiry. Direct free-plan payment URLs show no payment required. Sample member layouts are public and intentionally include no protected material. Real authentication and content authorisation must be implemented before publishing member resources.

The script clears only the old concept’s sample-check-in storage key. It does not read or store account, payment or enquiry data.

## Images and fonts

Original project photography and branding are retained with attribution. Asset sources are in asset-sources.json. The full framework wheel is no longer distributed in this concept. Original rights remain with the respective owners.

Coastal sunset: Casia Charlie. Sculpture: Deanne Neilson. Big Emu Bob: The BTH Project, Piney Lakes Reserve, WA. Fonts: DM Sans and Fraunces under the included SIL Open Font Licences.

## Checks

JavaScript syntax and local link/asset checks. Browser verification covers membership choices, Household-to-organisation reclassification, free signup, paid payment review, government enquiries, sign-in preview and responsive layout. No actual payment credentials or personal information are used.

Robots, HTML metadata and response headers discourage indexing; they are not access control. The concept is publicly accessible by URL.

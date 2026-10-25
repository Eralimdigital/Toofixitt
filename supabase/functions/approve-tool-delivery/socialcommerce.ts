// Customer handoff documents for the Social Commerce Setup Resource.
// These are setup resources, not a claim that a customer's accounts have already been configured.
const common = `TOOFIXITT | SOCIAL COMMERCE SETUP RESOURCE

BEFORE YOU BEGIN
Have owner-approved access to the Shopify store and the relevant social commerce business accounts. Confirm the store's selling region, shipping and returns policies, product eligibility, and required business verification. Platform features and eligibility vary by region and account.

SECURITY
Use each platform's own authorized account access. Never send passwords, recovery codes, or payment credentials by email. Keep a record of account ownership and permissions.

SHOPIFY CATALOG PREPARATION
1. Audit product titles, descriptions, images, prices, variants, stock, shipping details, and policies.
2. Organize eligible products and collections; remove drafts and restricted products from the intended feeds.
3. Agree which locations, markets, and inventories each channel should receive.
4. Record catalog sync status and resolve item-level errors before publishing.

TEST AND HANDOFF
Use a permitted test product to check listing visibility, product tags, pricing, variant availability, checkout destination, and the shopping experience on mobile. Record exceptions and obtain the store owner's approval before going live.
`;

const tiktok = `
TIKTOK COMMERCE LAUNCH
1. Confirm TikTok Shop eligibility and complete TikTok's business/merchant verification where required.
2. Install and authorize the official Shopify-to-TikTok sales channel for the correct accounts.
3. Configure the TikTok shopping settings, catalog, product selection, and product tagging readiness.
4. Inspect sync errors and reconcile price, stock, and product status between Shopify and TikTok.
5. Test a product discovery path from TikTok content to the intended product and shopping destination.
6. Document store-specific configuration, catalog status, unresolved eligibility issues, and next actions.
`;

const meta = `
META COMMERCE LAUNCH
1. Confirm Facebook Page, Instagram professional account, Commerce Manager, and shop eligibility.
2. Connect Shopify to the authorized Meta business assets using the official sales channel.
3. Set up Facebook and Instagram shopping where available, and choose the correct product catalog.
4. Check product and collection organization, commerce settings, feed sync, and item-level diagnostics.
5. Verify product tagging readiness, mobile shopping experience, prices, inventory, and checkout destination.
6. Record configuration, approval status, any policy restrictions, and follow-up actions.
`;

const premium = `
CROSS-PLATFORM READINESS CHECK
1. Compare eligible products, collections, prices, variants, and inventory across Shopify, TikTok, Facebook, and Instagram.
2. Check account and catalog ownership, sales-channel permissions, and each platform's shop review status.
3. Test a representative product journey on each available channel and log discrepancies.
4. Review basic channel performance settings and prepare a prioritized handoff of remaining issues.
5. Complete a final readiness check with the store owner before publishing or running campaigns.
`;

export function socialCommerceDocument(toolSlug: string): { name: string; content: string } | null {
  const [slug, tier] = toolSlug.split("--");
  if (slug !== "social-commerce-setup-resource") return null;
  const selected = tier === "professional" ? "professional" : tier === "premium" ? "premium" : "basic";
  const scope = selected === "basic" ? tiktok : selected === "professional" ? meta : tiktok + meta + premium;
  const title = selected === "basic" ? "TikTok Commerce Launch" : selected === "professional" ? "Meta Commerce Launch" : "Complete Social Commerce Launch";
  return {
    name: `Social_Commerce_${selected.toUpperCase()}_Setup_Guide.txt`,
    content: `${common}\nPACKAGE: ${title}\n${scope}\nDELIVERY CHECKLIST\n- Confirm account access and prerequisites with the store owner.\n- Save links or screenshots of channel status and catalog diagnostics.\n- Note any pending platform reviews or blocked products.\n- Share a store-specific completion report after the actual setup is done.\n\nThis guide is a setup resource. Receiving it does not mean that the store's accounts, catalogs, or shops have been configured. Platform approval and results are not guaranteed.\n`,
  };
}
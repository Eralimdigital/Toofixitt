import { describe, expect, it } from "vitest";
import {
  ACTIVATION_URL,
  DOCUMENT_SITE_URL,
  buildLicensePack,
} from "../../supabase/functions/approve-tool-delivery/licensepack";
import { socialCommerceDocument } from "../../supabase/functions/approve-tool-delivery/socialcommerce";

describe("tool delivery document domain", () => {
  it("uses toofixitt.com in generated delivery documents", () => {
    expect(DOCUMENT_SITE_URL).toBe("https://toofixitt.com");
    expect(ACTIVATION_URL).toBe("https://toofixitt.com/activate");

    const documents = Object.values(buildLicensePack("Example Tool", "TEST-KEY")).join("\n");
    expect(documents).toContain("https://toofixitt.com/activate");
    expect(documents).not.toContain("toofixit.lovable.app");

    const socialCommerceGuide = socialCommerceDocument("social-commerce-setup-resource");
    expect(socialCommerceGuide?.content).toContain("https://toofixitt.com");
  });
});
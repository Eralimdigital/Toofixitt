import { describe, expect, it } from "vitest";
import { tools } from "@/data/tools";

describe("SEO Optimization packages", () => {
  const seoTool = tools.find((tool) => tool.slug === "seo-optimization-tool");

  it("sets Basic at $250 for up to 250 products with its existing payment link", () => {
    const basic = seoTool?.packages?.find((pkg) => pkg.id === "basic");

    expect(basic).toMatchObject({
      price: "$250",
      priceValue: 250,
      productLimit: 250,
      paymentUrl: "https://checkout.bachs.io/pay/pl_8d5acc9e2768",
    });
  });

  it("sets Professional at $350 for up to 500 products with its provided payment link", () => {
    const professional = seoTool?.packages?.find((pkg) => pkg.id === "professional");

    expect(professional).toMatchObject({
      price: "$350",
      priceValue: 350,
      productLimit: 500,
      paymentUrl: "https://checkout.bachs.io/pay/pl_f955e53bf4db",
    });
  });

  it("sets Premium at $500 for up to 600 products with its provided payment link", () => {
    const premium = seoTool?.packages?.find((pkg) => pkg.id === "premium");

    expect(premium).toMatchObject({
      price: "$500",
      priceValue: 500,
      productLimit: 600,
      paymentUrl: "https://checkout.bachs.io/pay/pl_6089db857198",
    });
  });
});
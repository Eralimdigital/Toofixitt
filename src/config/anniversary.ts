// 🎉 5-Year Anniversary campaign config
// Toggle `enabled` to show/hide the anniversary hero + milestone stats.
// `endsAt` powers the countdown timer and auto-hides the campaign when reached.
export const anniversaryConfig = {
  enabled: true,
  endsAt: new Date("2026-07-11T23:59:59"),
  promoCode: "TOOLIFY5",
  discountLabel: "25% OFF",
};

export const isAnniversaryActive = () =>
  anniversaryConfig.enabled && new Date() <= anniversaryConfig.endsAt;
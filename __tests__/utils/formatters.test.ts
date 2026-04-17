import {
  formatPayout,
  formatTimeAgo,
  formatDeadline,
  formatPlatform,
} from "../../utils/formatters";

describe("formatPayout", () => {
  it("formats whole dollar amounts", () => {
    expect(formatPayout(180)).toBe("$180");
  });

  it("formats thousands with comma", () => {
    expect(formatPayout(1500)).toBe("$1,500");
  });

  it("formats zero", () => {
    expect(formatPayout(0)).toBe("$0");
  });

  it("formats large amounts", () => {
    expect(formatPayout(10000)).toBe("$10,000");
  });
});

describe("formatDeadline", () => {
  it("returns 'ends today' for 0 days", () => {
    expect(formatDeadline(0)).toBe("ends today");
  });

  it("returns singular for 1 day", () => {
    expect(formatDeadline(1)).toBe("1 day left");
  });

  it("returns plural for multiple days", () => {
    expect(formatDeadline(12)).toBe("12 days left");
  });

  it("returns plural for 2 days", () => {
    expect(formatDeadline(2)).toBe("2 days left");
  });
});

describe("formatPlatform", () => {
  it("formats tiktok", () => {
    expect(formatPlatform("tiktok")).toBe("TikTok");
  });

  it("formats instagram", () => {
    expect(formatPlatform("instagram")).toBe("Instagram");
  });

  it("formats both", () => {
    expect(formatPlatform("both")).toBe("TikTok / IG");
  });

  it("falls back for unknown value", () => {
    expect(formatPlatform("unknown")).toBe("TikTok / IG");
  });
});

describe("formatTimeAgo", () => {
  const freeze = (offsetMs: number) =>
    new Date(Date.now() - offsetMs).toISOString();

  it("returns 'just now' for < 1 minute", () => {
    expect(formatTimeAgo(freeze(30_000))).toBe("just now");
  });

  it("returns minutes for < 1 hour", () => {
    expect(formatTimeAgo(freeze(5 * 60_000))).toBe("5m ago");
  });

  it("returns hours for < 24 hours", () => {
    expect(formatTimeAgo(freeze(3 * 60 * 60_000))).toBe("3h ago");
  });

  it("returns days for >= 24 hours", () => {
    expect(formatTimeAgo(freeze(2 * 24 * 60 * 60_000))).toBe("2d ago");
  });
});

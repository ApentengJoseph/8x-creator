import { validateVideoUrl, detectPlatformFromUrl } from "../../utils/urlValidator";

describe("validateVideoUrl — tiktok platform", () => {
  it("accepts a valid TikTok video URL", () => {
    expect(validateVideoUrl("https://www.tiktok.com/@user/video/7312891234567890123", "tiktok")).toBe(true);
  });

  it("rejects a TikTok URL missing /video/", () => {
    expect(validateVideoUrl("https://www.tiktok.com/@user/", "tiktok")).toBe(false);
  });

  it("rejects an Instagram URL for tiktok platform", () => {
    expect(validateVideoUrl("https://www.instagram.com/reel/ABC123/", "tiktok")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(validateVideoUrl("", "tiktok")).toBe(false);
  });

  it("rejects whitespace-only input", () => {
    expect(validateVideoUrl("   ", "tiktok")).toBe(false);
  });
});

describe("validateVideoUrl — instagram platform", () => {
  it("accepts a valid Instagram reel URL", () => {
    expect(validateVideoUrl("https://www.instagram.com/reel/DWy1p6vN-7V/", "instagram")).toBe(true);
  });

  it("accepts an Instagram post URL (/p/)", () => {
    expect(validateVideoUrl("https://www.instagram.com/p/ABC123DEF/", "instagram")).toBe(true);
  });

  it("rejects an Instagram URL missing /reel/ or /p/", () => {
    expect(validateVideoUrl("https://www.instagram.com/explore/", "instagram")).toBe(false);
  });

  it("rejects a TikTok URL for instagram platform", () => {
    expect(validateVideoUrl("https://www.tiktok.com/@user/video/123456", "instagram")).toBe(false);
  });
});

describe("validateVideoUrl — both platform", () => {
  it("accepts a TikTok URL", () => {
    expect(validateVideoUrl("https://www.tiktok.com/@user/video/7312891234567890123", "both")).toBe(true);
  });

  it("accepts an Instagram reel URL", () => {
    expect(validateVideoUrl("https://www.instagram.com/reel/DWy1p6vN-7V/", "both")).toBe(true);
  });

  it("rejects an unrelated URL", () => {
    expect(validateVideoUrl("https://www.youtube.com/watch?v=abc", "both")).toBe(false);
  });
});

describe("detectPlatformFromUrl", () => {
  it("detects tiktok", () => {
    expect(detectPlatformFromUrl("https://www.tiktok.com/@user/video/123")).toBe("tiktok");
  });

  it("detects instagram", () => {
    expect(detectPlatformFromUrl("https://www.instagram.com/reel/ABC/")).toBe("instagram");
  });

  it("returns null for unknown domain", () => {
    expect(detectPlatformFromUrl("https://www.youtube.com/watch?v=abc")).toBeNull();
  });
});

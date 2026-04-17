import { parseVideoUrl } from "../../utils/urlParser";

describe("parseVideoUrl — TikTok", () => {
  it("parses a full TikTok URL with username and video ID", () => {
    const result = parseVideoUrl("https://www.tiktok.com/@fitwiththeo/video/7312891234567890123");
    expect(result).not.toBeNull();
    expect(result!.platform).toBe("tiktok");
    expect(result!.username).toBe("fitwiththeo");
    expect(result!.videoId).toBe("7312891234567890123");
    expect(result!.displayUrl).toContain("@fitwiththeo");
  });

  it("trims whitespace before parsing", () => {
    const result = parseVideoUrl("  https://www.tiktok.com/@user/video/1234567890  ");
    expect(result).not.toBeNull();
    expect(result!.platform).toBe("tiktok");
  });

  it("parses a TikTok short link", () => {
    const result = parseVideoUrl("https://vm.tiktok.com/ZMeXYZ123/");
    expect(result).not.toBeNull();
    expect(result!.platform).toBe("tiktok");
    expect(result!.videoId).toBe("ZMeXYZ123");
    expect(result!.username).toBeUndefined();
  });
});

describe("parseVideoUrl — Instagram", () => {
  it("parses an Instagram reel URL", () => {
    const result = parseVideoUrl("https://www.instagram.com/reel/DWy1p6vN-7V/");
    expect(result).not.toBeNull();
    expect(result!.platform).toBe("instagram");
    expect(result!.reelId).toBe("DWy1p6vN-7V");
    expect(result!.displayUrl).toContain("instagram.com/reel/");
  });

  it("parses an Instagram post URL", () => {
    const result = parseVideoUrl("https://www.instagram.com/p/ABC123DEF456/");
    expect(result).not.toBeNull();
    expect(result!.platform).toBe("instagram");
    expect(result!.reelId).toBe("ABC123DEF456");
  });
});

describe("parseVideoUrl — unrecognised URLs", () => {
  it("returns null for a YouTube URL", () => {
    expect(parseVideoUrl("https://www.youtube.com/watch?v=abc")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(parseVideoUrl("")).toBeNull();
  });

  it("returns null for arbitrary text", () => {
    expect(parseVideoUrl("not a url at all")).toBeNull();
  });
});

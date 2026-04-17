import { useSubmissionsStore } from "../../store/submissionsStore";

// Use fake timers so scheduleTransition's setTimeout never fires during tests
beforeAll(() => jest.useFakeTimers());
afterAll(() => jest.useRealTimers());

// Reset store to a clean state between tests
beforeEach(() => {
  useSubmissionsStore.setState({
    submissions: [],
    totalEarnings: 0,
  });
});

describe("addSubmission", () => {
  it("adds a new submission with pending status", () => {
    const { addSubmission, submissions } = useSubmissionsStore.getState();

    addSubmission({
      campaignId: "camp-001",
      campaignTitle: "Test campaign",
      brandName: "TestBrand",
      payout: 200,
      platform: "tiktok",
      url: "https://www.tiktok.com/@user/video/123",
    });

    const updated = useSubmissionsStore.getState().submissions;
    expect(updated).toHaveLength(1);
    expect(updated[0].status).toBe("pending");
    expect(updated[0].campaignId).toBe("camp-001");
    expect(updated[0].payout).toBe(200);
  });

  it("prepends new submissions to the list", () => {
    const { addSubmission } = useSubmissionsStore.getState();

    addSubmission({ campaignId: "camp-001", campaignTitle: "First", brandName: "A", payout: 100, platform: "tiktok", url: "https://tiktok.com/@u/video/1" });
    addSubmission({ campaignId: "camp-002", campaignTitle: "Second", brandName: "B", payout: 150, platform: "instagram", url: "https://instagram.com/reel/X" });

    const { submissions } = useSubmissionsStore.getState();
    expect(submissions[0].campaignTitle).toBe("Second");
    expect(submissions[1].campaignTitle).toBe("First");
  });

  it("generates unique IDs for each submission", () => {
    const { addSubmission } = useSubmissionsStore.getState();

    addSubmission({ campaignId: "c1", campaignTitle: "T1", brandName: "B", payout: 100, platform: "tiktok", url: "https://tiktok.com/@u/video/1" });
    addSubmission({ campaignId: "c2", campaignTitle: "T2", brandName: "B", payout: 100, platform: "tiktok", url: "https://tiktok.com/@u/video/2" });

    const { submissions } = useSubmissionsStore.getState();
    expect(submissions[0].id).not.toBe(submissions[1].id);
  });
});

describe("updateStatus", () => {
  it("changes submission status to approved and updates earnings", () => {
    useSubmissionsStore.setState({
      submissions: [{ id: "s1", campaignId: "c1", campaignTitle: "T", brandName: "B", payout: 200, platform: "tiktok", url: "", status: "pending", submittedAt: new Date().toISOString() }],
      totalEarnings: 0,
    });

    useSubmissionsStore.getState().updateStatus("s1", "approved");

    const { submissions, totalEarnings } = useSubmissionsStore.getState();
    expect(submissions[0].status).toBe("approved");
    expect(totalEarnings).toBe(200);
  });

  it("stores rejection feedback", () => {
    useSubmissionsStore.setState({
      submissions: [{ id: "s1", campaignId: "c1", campaignTitle: "T", brandName: "B", payout: 200, platform: "tiktok", url: "", status: "pending", submittedAt: new Date().toISOString() }],
      totalEarnings: 0,
    });

    useSubmissionsStore.getState().updateStatus("s1", "rejected", "Hook was too slow.");

    const { submissions } = useSubmissionsStore.getState();
    expect(submissions[0].status).toBe("rejected");
    expect(submissions[0].reviewFeedback).toBe("Hook was too slow.");
  });

  it("recalculates totalEarnings only from approved submissions", () => {
    useSubmissionsStore.setState({
      submissions: [
        { id: "s1", campaignId: "c1", campaignTitle: "T", brandName: "B", payout: 100, platform: "tiktok", url: "", status: "approved", submittedAt: new Date().toISOString() },
        { id: "s2", campaignId: "c2", campaignTitle: "T", brandName: "B", payout: 200, platform: "tiktok", url: "", status: "pending",  submittedAt: new Date().toISOString() },
      ],
      totalEarnings: 100,
    });

    useSubmissionsStore.getState().updateStatus("s2", "approved");

    expect(useSubmissionsStore.getState().totalEarnings).toBe(300);
  });
});

describe("getByStatus", () => {
  beforeEach(() => {
    useSubmissionsStore.setState({
      submissions: [
        { id: "s1", campaignId: "c1", campaignTitle: "T", brandName: "B", payout: 100, platform: "tiktok", url: "", status: "approved",  submittedAt: new Date().toISOString() },
        { id: "s2", campaignId: "c2", campaignTitle: "T", brandName: "B", payout: 100, platform: "tiktok", url: "", status: "pending",   submittedAt: new Date().toISOString() },
        { id: "s3", campaignId: "c3", campaignTitle: "T", brandName: "B", payout: 100, platform: "tiktok", url: "", status: "rejected",  submittedAt: new Date().toISOString() },
      ],
      totalEarnings: 100,
    });
  });

  it("returns all submissions for 'all'", () => {
    expect(useSubmissionsStore.getState().getByStatus("all")).toHaveLength(3);
  });

  it("filters by approved", () => {
    const result = useSubmissionsStore.getState().getByStatus("approved");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("s1");
  });

  it("filters by pending", () => {
    const result = useSubmissionsStore.getState().getByStatus("pending");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("s2");
  });

  it("filters by rejected", () => {
    const result = useSubmissionsStore.getState().getByStatus("rejected");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("s3");
  });
});

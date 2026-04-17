import { claimPlayback, releasePlayback } from "../../utils/videoPlayback";

describe("videoPlayback singleton", () => {
  it("calls the previous stop function when a new player claims playback", () => {
    const stop1 = jest.fn();
    const stop2 = jest.fn();

    claimPlayback(stop1);
    claimPlayback(stop2); // should stop stop1

    expect(stop1).toHaveBeenCalledTimes(1);
    expect(stop2).not.toHaveBeenCalled();

    // cleanup
    releasePlayback(stop2);
  });

  it("does not call stop if the same function reclaims", () => {
    const stop = jest.fn();

    claimPlayback(stop);
    claimPlayback(stop); // same reference — should not call itself

    expect(stop).not.toHaveBeenCalled();

    releasePlayback(stop);
  });

  it("releasePlayback clears the active player so the next claim does not stop anything", () => {
    const stop1 = jest.fn();
    const stop2 = jest.fn();

    claimPlayback(stop1);
    releasePlayback(stop1); // explicitly release

    claimPlayback(stop2); // nothing to stop now
    expect(stop1).not.toHaveBeenCalled();

    releasePlayback(stop2);
  });

  it("releasePlayback is a no-op if a different function is active", () => {
    const stop1 = jest.fn();
    const stop2 = jest.fn();

    claimPlayback(stop1);
    releasePlayback(stop2); // stop2 is not active — should do nothing

    // stop1 should still be active; a new claim stops it
    claimPlayback(stop2);
    expect(stop1).toHaveBeenCalledTimes(1);

    releasePlayback(stop2);
  });
});

import { describe, it, expect } from "vitest";
import { COOKIE_NAME, ONE_YEAR_MS } from "../../../shared/const";

describe("shared/const", () => {
  it("COOKIE_NAME is app_session_id", () => {
    expect(COOKIE_NAME).toBe("app_session_id");
  });

  it("ONE_YEAR_MS equals 365 days in milliseconds", () => {
    expect(ONE_YEAR_MS).toBe(1000 * 60 * 60 * 24 * 365);
  });
});

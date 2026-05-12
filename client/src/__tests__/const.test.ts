import { describe, it, expect, beforeEach } from "vitest";
import { getLoginUrl } from "../const";

describe("getLoginUrl", () => {
  const originalOauthUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const originalAppId = import.meta.env.VITE_APP_ID;

  beforeEach(() => {
    import.meta.env.VITE_OAUTH_PORTAL_URL = "https://auth.example.com";
    import.meta.env.VITE_APP_ID = "test-app-123";
  });

  afterAll(() => {
    import.meta.env.VITE_OAUTH_PORTAL_URL = originalOauthUrl;
    import.meta.env.VITE_APP_ID = originalAppId;
  });

  it("constructs the correct OAuth URL with all parameters", () => {
    const url = getLoginUrl();
    const parsed = new URL(url);

    expect(parsed.origin).toBe("https://auth.example.com");
    expect(parsed.pathname).toBe("/app-auth");
    expect(parsed.searchParams.get("appId")).toBe("test-app-123");
    expect(parsed.searchParams.get("redirectUri")).toBe(
      "http://localhost:3000/api/oauth/callback"
    );
    expect(parsed.searchParams.get("type")).toBe("signIn");
  });

  it("sets state as base64-encoded redirectUri", () => {
    const url = getLoginUrl();
    const parsed = new URL(url);

    const state = parsed.searchParams.get("state");
    expect(state).toBe(
      btoa("http://localhost:3000/api/oauth/callback")
    );
  });

  it("includes the current window.location.origin in redirectUri", () => {
    const url = getLoginUrl();
    const parsed = new URL(url);

    expect(parsed.searchParams.get("redirectUri")).toContain(
      window.location.origin
    );
  });
});

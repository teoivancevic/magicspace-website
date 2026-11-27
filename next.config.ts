import type { NextConfig } from "next";

// Friend invites: magicspace.app/i/<code> is served by the app's prod Convex deployment (the page a friend
// sees when someone shares their invite link). A rewrite, not a redirect, so the address stays magicspace.app.
// The page and its tests live in the app repo: convex/http.ts and convex/lib/invites.ts.
const INVITE_ORIGIN = "https://pastel-pigeon-956.convex.site";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/i/:code", destination: `${INVITE_ORIGIN}/i/:code` }];
  },
};

export default nextConfig;

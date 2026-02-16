// Detect device type from user agent
export function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  // Tablet detection (before mobile, as tablets often contain "mobile")
  if (
    ua.includes("ipad") ||
    ua.includes("tablet") ||
    ua.includes("kindle") ||
    (ua.includes("android") && !ua.includes("mobile"))
  ) {
    return "tablet";
  }

  // Mobile detection
  if (
    ua.includes("mobile") ||
    ua.includes("iphone") ||
    ua.includes("ipod") ||
    ua.includes("android") ||
    ua.includes("webos") ||
    ua.includes("blackberry") ||
    ua.includes("windows phone")
  ) {
    return "mobile";
  }

  // Desktop
  if (
    ua.includes("windows") ||
    ua.includes("macintosh") ||
    ua.includes("linux") ||
    ua.includes("x11")
  ) {
    return "desktop";
  }

  return "unknown";
}

// Extract referrer domain
export function extractReferrerDomain(referrer: string): string {
  if (!referrer || referrer === "") return "direct";

  try {
    const url = new URL(referrer);
    return url.hostname.replace("www.", "");
  } catch {
    return "direct";
  }
}

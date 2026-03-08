import { NextResponse } from "next/server";

const AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME || "saradomen";
const AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD || "saradomen";

function isAuthorized(authorizationHeader) {
  if (!authorizationHeader) return false;
  const [scheme, encoded] = authorizationHeader.split(" ");
  if (scheme !== "Basic" || !encoded) return false;

  try {
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return false;
    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);
    return username === AUTH_USERNAME && password === AUTH_PASSWORD;
  } catch {
    return false;
  }
}

export function middleware(request) {
  const authorization = request.headers.get("authorization");
  if (isAuthorized(authorization)) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="SAROMEN Private Site", charset="UTF-8"',
      "Cache-Control": "no-store"
    }
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

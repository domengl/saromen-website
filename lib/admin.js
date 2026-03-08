import { getAdminSession, getUserSession } from "@/lib/auth";

export async function isAdminRequest(request) {
  const userSession = await getUserSession(request);
  if (userSession?.role === "admin") {
    return true;
  }
  const session = await getAdminSession(request);
  return Boolean(session?.admin);
}

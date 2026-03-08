import { getAdminSession } from "@/lib/auth";

export async function isAdminRequest(request) {
  const session = await getAdminSession(request);
  return Boolean(session?.admin);
}

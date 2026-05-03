import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function RootPage() {
  const cookieStore = await cookies();
  const tenantCookie = cookieStore.get("pxos_tenant");
  const tenantId = tenantCookie?.value || process.env.NEXT_PUBLIC_TENANT_ID || "phalanx";
  
  redirect(`/${tenantId}`);
}

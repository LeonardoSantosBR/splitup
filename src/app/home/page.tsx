import { redirect } from "next/navigation";
import { listUserGroups } from "@/app/actions/groups";
import { verifyUserSession } from "@/utils/helpers";
import { Home } from "./home";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const session = await verifyUserSession();

  const result = await listUserGroups();
  if (!result.success) redirect("/login");

  return (
    <Home initialGroups={result.data} userName={session?.user?.name ?? ""} />
  );
}

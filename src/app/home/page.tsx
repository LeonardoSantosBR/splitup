import { redirect } from "next/navigation";
import { listUserGroups } from "@/app/actions/groups";
import { HomeActions } from "./home-actions";
import { verifyUserSession } from "@/utils/functions/verify-user-session-function";

export const dynamic = "force-dynamic";

export default async function HomeWorkSpacePage() {
  const session = await verifyUserSession();

  const result = await listUserGroups();
  if (!result.success) redirect("/login");

  return (
    <HomeActions
      initialGroups={result.data}
      userName={session?.user?.name ?? ""}
      userImage={session?.user?.image}
    />
  );
}

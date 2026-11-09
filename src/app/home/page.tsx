import { redirect } from "next/navigation";
import { listUserGroups } from "@/app/actions/groups";
import { auth } from "@/auth";
import { HomeActions } from "./homeActions";

export const dynamic = "force-dynamic";

export default async function HomeWorkSpacePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const result = await listUserGroups(1);
  if (!result.success) redirect("/login");

  return (
    <HomeActions
      initialGroups={result.data.items}
      initialPage={result.data.page}
      initialTotalPages={result.data.totalPages}
      userName={session?.user?.name ?? ""}
      userImage={session?.user?.image}
    />
  );
}

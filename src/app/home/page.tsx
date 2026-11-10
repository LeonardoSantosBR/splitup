import { redirect } from "next/navigation";
import { listUserGroups } from "@/app/actions/groups";
import { auth } from "@/auth";
import { HomeGroupActions } from "./homeGroupActions";

export const dynamic = "force-dynamic";
export default async function HomePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const result = await listUserGroups(1);
  if (!result.success) redirect("/login");

  return (
    <HomeGroupActions
      initialGroups={result.data.items}
      initialPage={result.data.page}
      initialTotalPages={result.data.totalPages}
      userName={session?.user?.name ?? ""}
      userImage={session?.user?.image}
    />
  );
}

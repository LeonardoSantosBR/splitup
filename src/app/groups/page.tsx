import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--primary)">
          SplitUp
        </p>
        <h1 className="mt-3 text-3xl font-bold text-foreground">Seus grupos</h1>
        <p className="mt-2 text-(--dark-teal)">
          Em breve você poderá criar ou entrar em um grupo.
        </p>
      </div>
    </main>
  );
}

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProfileFieldsEditor } from "@/components/profile";
import { prisma } from "@/db/prismaDb";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true },
  });

  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-10">
      <ProfileFieldsEditor
        profile={{
          name: user.name ?? "",
          email: user.email ?? "",
          image: user.image,
        }}
      />
    </main>
  );
}

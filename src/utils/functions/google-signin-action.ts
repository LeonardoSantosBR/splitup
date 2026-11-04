import { signIn } from "@/auth";

export async function googleSignInAction(): Promise<void> {
  "use server";
  await signIn("google", { redirectTo: "/groups" });
}

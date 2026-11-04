import { LoginBrandPanel, LoginForm } from "@/components/login";
import { googleSignInAction } from "@/utils/functions";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-(--teal)/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-(--mauve)/30 blur-3xl" />
      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(36,48,47,0.14)] md:grid-cols-[1.05fr_0.95fr]">
        <LoginBrandPanel />
        <LoginForm signInAction={googleSignInAction} />
      </section>
    </main>
  );
}

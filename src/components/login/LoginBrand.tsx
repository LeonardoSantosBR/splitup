import Image from "next/image";

export function LoginBrand() {
  return (
    <div className="mb-16 flex items-center gap-3">
      <span className="relative h-10 w-10 overflow-hidden rounded-xl">
        <Image
          src="/icon.png"
          alt="Logo do SplitUp"
          fill
          sizes="40px"
          className="scale-[0.9] object-contain"
        />
      </span>
      <span className="text-xl font-bold tracking-tight">SplitUp</span>
    </div>
  );
}

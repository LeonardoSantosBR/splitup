import Image from "next/image";

export function HeaderBrand() {
  return (
    <div className="flex items-center gap-3">
      <span className="relative h-9 w-9 overflow-hidden rounded-xl">
        <Image
          src="/icon.png"
          alt="Logo do SplitUp"
          fill
          sizes="36px"
          className="scale-[0.9] object-contain"
        />
      </span>
      <span className="font-bold text-foreground">SplitUp</span>
    </div>
  );
}

import Avatar from "@mui/material/Avatar";

export function HomeMembersImage({
  groupId,
  membersImages,
}: {
  groupId: string;
  membersImages: Array<string | null>;
}) {
  return (
    <div className="flex gap-0.5">
      {membersImages.slice(0, 3).map((url) => (
        <Avatar
          key={`${groupId}-${url ?? "member"}`}
          sx={{ width: 20, height: 20 }}
          alt="Foto de participante"
          src={url ?? undefined}
          slotProps={{ img: { referrerPolicy: "no-referrer" } }}
        />
      ))}
      {membersImages.slice(3).length !== 0 && (
        <span
          title={`${membersImages.length - 4} participantes adicionais`}
          className="flex h-5 w-5 items-center justify-center rounded-full bg-(--slate)/20 text-[10px] font-bold text-(--dark-teal)"
        >
          ...
        </span>
      )}
    </div>
  );
}

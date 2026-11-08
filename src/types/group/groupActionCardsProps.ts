export type GroupActionCardsProps = {
  groupName: string;
  inviteToken: string;
  isPending: boolean;
  onGroupNameChange: (value: string) => void;
  onInviteTokenChange: (value: string) => void;
  onCreate: (event: React.FormEvent<HTMLFormElement>) => void;
  onJoin: (event: React.FormEvent<HTMLFormElement>) => void;
};

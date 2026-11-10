export type HomeGroupCreateOrJoinProps = {
  groupName: string;
  inviteToken: string;
  isPending: boolean;
  onGroupNameChange: (value: string) => void;
  onInviteTokenChange: (value: string) => void;
  onCreate: (event: React.SubmitEvent<HTMLFormElement>) => void;
  onJoin: (event: React.SubmitEvent<HTMLFormElement>) => void;
};

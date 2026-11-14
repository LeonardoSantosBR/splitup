export type HeaderProps = {
  userName: string;
  userImage?: string | null;
  onSignOut: () => void;
  onViewProfile: () => void;
};

import type { HomeGroupProps } from "./homeGroupProps";

export type HomeProps = {
  initialGroups: HomeGroupProps[];
  initialPage: number;
  initialTotalPages: number;
  userName: string;
  userImage?: string | null;
};

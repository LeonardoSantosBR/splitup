import { HomeGroupProps } from "./homeGroupProps";

export type HomeGroupActionsProps = {
  initialGroups: HomeGroupProps[];
  initialPage: number;
  initialTotalPages: number;
  userName: string;
  userImage?: string | null;
};

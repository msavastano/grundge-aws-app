import type { User } from "~/models/user.server";

export type StoryProps = {
  id: string;
  title?: string;
  author?: string;
  words?: number;
  excerpt?: string;
  url?: string;
  tags?: string[];
  mag?: string;
  date?: string;
  issue?: string;
  img?: string;
  admin?: boolean;
};

export type MagProps = {
  id: string;
  display: string;
  img?: string;
  desc?: string;
  url?: string;
  name?: string;
  admin?: boolean;
  del?: () => void;
};

export type Tag = {
  tag: string;
  id: string;
};

export type RootData = {
  user?: User;
  admin: boolean;
};

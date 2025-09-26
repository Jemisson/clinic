import { Meta } from "./meta";
import { TagData } from "./tags";

export interface UserResponse {
  data: ProfileUserData[];
  meta: Meta;
}

export interface ProfileUserData {
  id: string;
  type: "profile_user";
  attributes: ProfileUserAttributes;
}

export interface ProfileUserAttributes {
  name: string;
  cpf: string;
  rg: string;
  birthdate: string;
  address: string;
  mobile_phone: string;
  sector: string;
  job_function: string;
  profile_children: ProfileChild[];
  role: string;
  email: string;
  tags: TagData[];
  photo_url: string | null;
  photo_thumb_url: string | null;
  status: string
}

export interface ProfileChild {
  id: number;
  profile_user_id: number;
  name: string;
  degree: string;
  birth: string;
  created_at: string;
  updated_at: string;
}

export type ProfileUserStatus = "active" | "inactive";

export interface ProfileUserStatusUpdateInput {
  profile_user: { status: ProfileUserStatus };
}

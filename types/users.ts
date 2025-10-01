import { Meta } from "./meta";
import { TagData } from "./tags";
import type {
  UserRole, UserSector, UserFunction, Gender
} from "./users.enums";


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
  gender?: Gender;
  cpf: string;
  rg: string;
  birthdate: string;
  address: string;
  mobile_phone: string;
  sector: UserSector;
  job_function: UserFunction;
  profile_children: ProfileChild[];
  role: UserRole;
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

export interface UserShowResponse {
  data: ProfileUserData
}

export type ProfileUserStatus = "active" | "inactive";

export interface ProfileUserStatusUpdateInput {
  profile_user: { status: ProfileUserStatus };
}

export interface ProfileUserFormInput {
  name: string;
  cpf: string;
  rg: string;
  birthdate: string;
  address: string;
  mobile_phone: string;
  sector: UserSector;
  job_function: UserFunction;
  user: {
    email: string;
    role: UserRole;
    password?: string;
  };
  profile_children: Array<{
    id?: number;  
    name: string;
    degree: string;
    birth: string;
    _destroy?: boolean;
  }>;
  photo?: File | null;
}

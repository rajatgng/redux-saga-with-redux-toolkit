import { UserStatus } from "../enums/user-status.enum";
import { Company } from "./Company";
import { Project } from "./Project";

export interface User {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  company?: Company;
  projects?: Project[];
  role?: string;
  password?: string;
}

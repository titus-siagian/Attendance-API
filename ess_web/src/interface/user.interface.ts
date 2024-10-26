export default interface UserInterface {
  id?: string | null;
  active?: boolean;
  identityNumber?: string | null;
  name?: string;
  email?: string;
  password?: string | null;
  avatarUrl?: string | null;
  address?: string;
  phone?: string;
  dateOfBirth?: Date | string | null;
  placeOfBirth?: string;
  position?: string;
  blood?: string;
  sex?: number;
  role?: string;
  companyId?: string;
  divisionId?: string;
  subdivisionId?: string;
  departmentId?: string;
}

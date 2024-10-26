import UserInterface from './user.interface';

export default interface FamilyInterface {
  id: string | null;
  identityNumber: number | string;
  name: string | null;
  sex: number | null;
  dateOfBirth: Date | string | null;
  placeOfBirth: string | null;
  relationship: number | null;
  userId: string;
  user: UserInterface | undefined;
}

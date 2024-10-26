import MasterLocationInterface from './masterLocation.interface';
import UserInterface from './user.interface';

export default interface AttendanceInterface {
  id: string | null;
  createdAt: string;
  latitude: number;
  longitude: number;
  userId: string;
  photoUrl: string;
  description: string | null;
  masterLocationId: string | null;
  type: string;
  value: string;
  problem: string | null;
  location: MasterLocationInterface | undefined;
  user: UserInterface | undefined;
}

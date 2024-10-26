import DefaultParams from './default-params.interface';

export default interface AttendanceParams extends DefaultParams {
  startDate?: string;
  endDate?: string;
  userId?: string;
  type?: string;
  value?: string;
  username?: string;
  identityNumber?: string;
  image?: boolean;
}

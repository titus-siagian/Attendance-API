export default interface AnnouncementInterface {
  id: number | null;
  createdAt?: string;
  expiredAt?: string;
  title: string | null;
  description: string | null;
  companyIds: string[] | null;
  divisionIds: string[] | null;
  subdivisionIds: string[] | null;
}

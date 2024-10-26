import CompanyInterface from './company.inteface';

export default interface DivisionInterface {
  id: string | null;
  companyId: string | null;
  company: CompanyInterface | undefined;
  name: string;
}

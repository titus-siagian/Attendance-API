import CompanyInterface from './company.inteface';
import DivisionInterface from './division.interface';

export default interface SubdivisionInterface {
  id: string | null;
  divisionId: string | null;
  division: DivisionInterface | undefined;
  company: CompanyInterface | undefined;
  name: string;
}

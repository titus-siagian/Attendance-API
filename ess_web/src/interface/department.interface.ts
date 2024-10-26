import CompanyInterface from './company.inteface';
import DivisionInterface from './division.interface';
import SubdivisionInterface from './subdivision.interface';

export default interface DepartmentInterface {
  id: string | null;
  subdivisionId: string | null;
  division: DivisionInterface | undefined;
  company: CompanyInterface | undefined;
  subdivision: SubdivisionInterface | undefined;
  name: string;
}

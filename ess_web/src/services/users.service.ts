import CompanyInterface from '@/interface/company.inteface';
import DepartmentInterface from '@/interface/department.interface';
import DivisionInterface from '@/interface/division.interface';
import CustomResponse from '@/interface/response.interface';
import CustomResponseArray from '@/interface/responseArray.interface';
import SubdivisionInterface from '@/interface/subdivision.interface';
import UserInterface from '@/interface/user.interface';
import { AxiosError, AxiosResponse } from 'axios';
import http from '.';
import UserParams from '@/interface/params/user-params.interface';
import { stringify } from 'qs';
import AuditInterface from '@/interface/audit.interface';
import AuditParams from '@/interface/params/audit-params.interface';

export default class UserServices {
  me(): Promise<AxiosResponse<CustomResponse<UserInterface>, AxiosError>> {
    return http.get<CustomResponse<UserInterface>>('users/me');
  }

  getUsers(
    query?: UserParams
  ): Promise<AxiosResponse<CustomResponseArray<UserInterface>, AxiosError>> {
    const params = stringify(query, { indices: false });
    return http.get<CustomResponseArray<UserInterface>>(`users/?${params}`);
  }

  createUser(
    data: UserInterface
  ): Promise<AxiosResponse<CustomResponse<UserInterface>, AxiosError>> {
    return http.post<CustomResponse<UserInterface>>('users', data);
  }

  updateUser(
    data: UserInterface
  ): Promise<AxiosResponse<CustomResponse<UserInterface>, AxiosError>> {
    return http.patch<CustomResponse<UserInterface>>('users/' + data.id, data);
  }

  deleteUser(
    id: string
  ): Promise<AxiosResponse<CustomResponse<UserInterface>, AxiosError>> {
    return http.delete<CustomResponse<UserInterface>>('users/' + id);
  }

  getCompany(): Promise<
    AxiosResponse<CustomResponseArray<CompanyInterface>, AxiosError>
  > {
    return http.get<CustomResponseArray<CompanyInterface>>('users/company');
  }

  findUser(
    id: string
  ): Promise<AxiosResponse<CustomResponse<UserInterface>, AxiosError>> {
    return http.get<CustomResponse<UserInterface>>(`users/${id}`);
  }

  createCompany(
    data: CompanyInterface
  ): Promise<AxiosResponse<CustomResponse<CompanyInterface>, AxiosError>> {
    return http.post<CustomResponse<CompanyInterface>>('users/company', data);
  }

  updateCompany(
    data: CompanyInterface
  ): Promise<AxiosResponse<CustomResponse<CompanyInterface>, AxiosError>> {
    return http.patch<CustomResponse<CompanyInterface>>(
      'users/company/' + data.id,
      data
    );
  }

  deleteCompany(
    id: string
  ): Promise<AxiosResponse<CustomResponse<CompanyInterface>, AxiosError>> {
    return http.delete<CustomResponse<CompanyInterface>>('users/company/' + id);
  }

  findCompany(
    id: string
  ): Promise<AxiosResponse<CustomResponse<CompanyInterface>, AxiosError>> {
    return http.get<CustomResponse<CompanyInterface>>('users/company/' + id);
  }

  getDivision(
    companyId?: string
  ): Promise<
    AxiosResponse<CustomResponseArray<DivisionInterface>, AxiosError>
  > {
    return http.get<CustomResponseArray<DivisionInterface>>('users/division', {
      params: {
        companyId,
      },
    });
  }

  createDivision(
    data: DivisionInterface
  ): Promise<AxiosResponse<CustomResponse<DivisionInterface>, AxiosError>> {
    return http.post<CustomResponse<DivisionInterface>>('users/division', data);
  }

  updateDivision(
    data: DivisionInterface
  ): Promise<AxiosResponse<CustomResponse<DivisionInterface>, AxiosError>> {
    return http.patch<CustomResponse<DivisionInterface>>(
      'users/division/' + data.id,
      data
    );
  }

  deleteDivision(
    id: string
  ): Promise<AxiosResponse<CustomResponse<DivisionInterface>, AxiosError>> {
    return http.delete<CustomResponse<DivisionInterface>>(
      'users/division/' + id
    );
  }

  findDivision(
    id: string
  ): Promise<AxiosResponse<CustomResponse<DivisionInterface>, AxiosError>> {
    return http.get<CustomResponse<DivisionInterface>>('users/division/' + id);
  }

  getSubdivision(
    divisionId?: string
  ): Promise<
    AxiosResponse<CustomResponseArray<SubdivisionInterface>, AxiosError>
  > {
    return http.get<CustomResponseArray<SubdivisionInterface>>(
      'users/subdivision',
      {
        params: {
          divisionId,
        },
      }
    );
  }

  createSubdivision(
    data: SubdivisionInterface
  ): Promise<AxiosResponse<CustomResponse<SubdivisionInterface>, AxiosError>> {
    return http.post<CustomResponse<SubdivisionInterface>>(
      'users/subdivision',
      data
    );
  }

  updateSubdivision(
    data: SubdivisionInterface
  ): Promise<AxiosResponse<CustomResponse<SubdivisionInterface>, AxiosError>> {
    return http.patch<CustomResponse<SubdivisionInterface>>(
      'users/subdivision/' + data.id,
      data
    );
  }

  deleteSubdivision(
    id: string
  ): Promise<AxiosResponse<CustomResponse<SubdivisionInterface>, AxiosError>> {
    return http.delete<CustomResponse<SubdivisionInterface>>(
      'users/subdivision/' + id
    );
  }

  findSubdivision(
    id: string
  ): Promise<AxiosResponse<CustomResponse<SubdivisionInterface>, AxiosError>> {
    return http.get<CustomResponse<SubdivisionInterface>>(
      'users/subdivision/' + id
    );
  }

  getDepartment(
    subdivisionId?: string
  ): Promise<
    AxiosResponse<CustomResponseArray<DepartmentInterface>, AxiosError>
  > {
    return http.get<CustomResponseArray<DepartmentInterface>>(
      'users/department',
      {
        params: {
          subdivisionId,
        },
      }
    );
  }

  createDepartment(
    data: DepartmentInterface
  ): Promise<AxiosResponse<CustomResponse<DepartmentInterface>, AxiosError>> {
    return http.post<CustomResponse<DepartmentInterface>>(
      'users/department',
      data
    );
  }

  updateDepartment(
    data: DepartmentInterface
  ): Promise<AxiosResponse<CustomResponse<DepartmentInterface>, AxiosError>> {
    return http.patch<CustomResponse<DepartmentInterface>>(
      'users/department/' + data.id,
      data
    );
  }

  deleteDepartment(
    id: string
  ): Promise<AxiosResponse<CustomResponse<DepartmentInterface>, AxiosError>> {
    return http.delete<CustomResponse<DepartmentInterface>>(
      'users/department/' + id
    );
  }

  findDepartment(
    id: string
  ): Promise<AxiosResponse<CustomResponse<DepartmentInterface>, AxiosError>> {
    return http.get<CustomResponse<DepartmentInterface>>(
      'users/department/' + id
    );
  }

  getAuditLog(
    query: AuditParams
  ): Promise<AxiosResponse<CustomResponseArray<AuditInterface>, AxiosError>> {
    const params = stringify(query, { indices: false });
    return http.get<CustomResponseArray<AuditInterface>>(`audit/?${params}`);
  }
}

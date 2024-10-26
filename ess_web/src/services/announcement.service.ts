import AnnouncementInterface from '@/interface/announcement.interface';
import AttachmentInterface from '@/interface/attachment.interface';
import AnnouncementParams from '@/interface/params/announcement-params.interface';
import CustomResponse from '@/interface/response.interface';
import CustomResponseArray from '@/interface/responseArray.interface';
import UploadInterface from '@/interface/upload.interface';
import { AxiosError, AxiosResponse } from 'axios';
import { identity, pickBy } from 'lodash';
import { stringify } from 'qs';
import http from './index';

export default class AnnouncementServices {
  create(
    data: AnnouncementInterface
  ): Promise<AxiosResponse<CustomResponse<AnnouncementInterface>, AxiosError>> {
    return http.post('announcement', data);
  }

  get(
    query?: AnnouncementParams
  ): Promise<
    AxiosResponse<CustomResponseArray<AnnouncementInterface>, AxiosError>
  > {
    const params = stringify(query, { indices: false });
    return http.get(`announcement/?${params}`);
  }

  find(
    id: string
  ): Promise<AxiosResponse<CustomResponse<AnnouncementInterface>, AxiosError>> {
    return http.get(`announcement/${id}`);
  }

  patch(
    data: AnnouncementInterface
  ): Promise<AxiosResponse<CustomResponse<AnnouncementInterface>, AxiosError>> {
    const parsingData = pickBy(data, identity);
    return http.patch('announcement/' + data.id, parsingData);
  }

  delete(
    id: number
  ): Promise<AxiosResponse<CustomResponse<AnnouncementInterface>, AxiosError>> {
    return http.delete('announcement/' + id);
  }

  getAttachment(
    id?: number
  ): Promise<
    AxiosResponse<CustomResponseArray<AttachmentInterface>, AxiosError>
  > {
    return http.get(`announcement/${id}/attachment`);
  }

  createAttachment(
    data: FormData
  ): Promise<AxiosResponse<CustomResponse<UploadInterface>, AxiosError>> {
    return http.post('files', data);
  }

  addAttachment(
    data: AttachmentInterface
  ): Promise<AxiosResponse<CustomResponse<AttachmentInterface>, AxiosError>> {
    return http.post(`announcement/${data.announcementId}/attachment`, data);
  }

  removeAttachment(
    id: string
  ): Promise<AxiosResponse<CustomResponse<AttachmentInterface>, AxiosError>> {
    return http.delete(`announcement/attachment/${id}`);
  }
}

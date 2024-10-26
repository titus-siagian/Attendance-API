<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onUpdate">
      <v-card>
        <v-card-title>Update Pengumuman</v-card-title>
        <v-card-text class="space-y-4">
          <v-text-field
            filled
            label="Judul"
            :rules="[(v) => !!v || 'Mohon masukkan nama judul']"
            v-model="data.title"
          ></v-text-field>
          <VueEditor
            class="mb-12"
            v-model="data.description"
            :editor-toolbar="customToolbar"
          />
          <div class="flex space-x-4">
            <div class="w-1/2">
              <v-select
                filled
                v-model="selectedCompanies"
                :items="companies"
                item-text="name"
                item-value="id"
                :rules="[(v) => !!v || 'Mohon pilih perusahaan']"
                :menu-props="{ maxHeight: '400' }"
                label="Perusahaan"
                multiple
                persistent-hint
              ></v-select>
            </div>
            <div class="w-1/2">
              <v-checkbox
                v-model="selectedAllCompanies"
                label="Pilih semua"
                hide-details
                @change="onChangeSelectedCompany"
              ></v-checkbox>
            </div>
          </div>
          <div class="flex space-x-4">
            <div class="w-1/2">
              <v-select
                filled
                v-model="selectedDivision"
                :items="division"
                :rules="[(v) => !!v || 'Mohon pilih divisi']"
                :menu-props="{ maxHeight: '400' }"
                item-text="name"
                item-value="id"
                label="Divisi"
                multiple
                persistent-hint
              ></v-select>
            </div>
            <div class="w-1/2">
              <v-checkbox
                v-model="selectedAllDivision"
                label="Pilih semua"
                hide-details
                @change="onChangeSelectedDivision"
              ></v-checkbox>
            </div>
          </div>

          <div class="flex space-x-4">
            <div class="w-1/2">
              <v-select
                filled
                v-model="selectedSubdivision"
                :items="subdivision"
                :rules="[
                  (v) => (v || []).length > 0 || 'Mohon pilih subdivisi',
                ]"
                :menu-props="{ maxHeight: '400' }"
                label="Sub-Divisi"
                item-text="name"
                item-value="id"
                multiple
                persistent-hint
              ></v-select>
            </div>
            <div class="w-1/2">
              <v-checkbox
                v-model="selectedAllSubdivision"
                label="Pilih semua"
                hide-details
                @change="onChangeSelectedSubdivision"
              ></v-checkbox>
            </div>
          </div>

          <div class="flex space-x-4">
            <div class="w-1/2">
              <v-dialog
                ref="dialog"
                v-model="publishModal"
                :return-value.sync="data.createdAt"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    filled
                    v-model="computedPublishDate"
                    label="Tanggal Publish"
                    :rules="[(v) => !!v || 'Mohon pilih tanggal publish']"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="data.createdAt" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="publishModal = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.dialog.save(data.createdAt)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </div>
            <div class="w-1/2">
              <v-dialog
                ref="expiredModal"
                v-model="expiredModal"
                :return-value.sync="data.expiredAt"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    filled
                    v-model="computedExpiredDate"
                    label="Tanggal Kadaluarsa"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="data.expiredAt" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="expiredModal = false">
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.expiredModal.save(data.expiredAt)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </div>
          </div>

          <div class="flex flex-col space-y-2">
            <div class="text-black dark:text-white">Attachment</div>
            <div class="flex space-x-2">
              <v-chip
                v-for="(item, i) in uploadedFile"
                :key="i"
                close
                close-icon="mdi-delete"
                @click="removeAttachment(i)"
                >{{ item.name }}</v-chip
              >
            </div>
          </div>

          <v-file-input
            v-model="uploadFile"
            chips
            multiple
            label="Add Attachment"
          ></v-file-input>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit" :loading="isLoading"
            >Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import AnnouncementInterface from '@/interface/announcement.interface';
import CompanyInterface from '@/interface/company.inteface';
import DivisionInterface from '@/interface/division.interface';
import AnnouncementServices from '@/services/announcement.service';
import UserServices from '@/services/users.service';
import { VForm } from '@/utils/types';
import axios from 'axios';
import { compact, find, get, isEmpty, map } from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import moment from 'moment';
import { VueEditor } from 'vue2-editor';
import SubdivisionInterface from '@/interface/subdivision.interface';
import AttachmentInterface from '@/interface/attachment.interface';
const MainModule = namespace('MainModule');

@Component({
  components: {
    VueEditor,
  },
})
export default class UpdateAnnouncementPage extends Vue {
  @Ref('form') readonly form!: VForm;

  service = new AnnouncementServices();
  userService = new UserServices();
  isLoading = false;

  customToolbar = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }, { align: [] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['code-block', 'link'],
  ];

  uploadedFile: AttachmentInterface[] = [];
  uploadFile = [];
  deletedFile: string[] = [];
  publishModal = false;
  expiredModal = false;

  selectedAllCompanies = false;
  selectedAllDivision = false;
  selectedAllSubdivision = false;

  companies: CompanyInterface[] = [];
  division: DivisionInterface[] = [];
  subdivision: SubdivisionInterface[] = [];

  selectedCompanies: string[] = [];
  selectedDivision: string[] = [];
  selectedSubdivision: string[] = [];

  data: AnnouncementInterface = {
    id: null,
    title: null,
    description: null,
    companyIds: null,
    divisionIds: null,
    subdivisionIds: null,
  };

  get computedPublishDate(): string {
    if (!isEmpty(this.data.createdAt)) {
      return this.formatDate(this.data.createdAt ?? '');
    }
    return '';
  }

  get computedExpiredDate(): string {
    if (!isEmpty(this.data.expiredAt)) {
      return this.formatDate(this.data.expiredAt ?? '');
    }
    return '';
  }

  @Watch('selectedCompanies')
  watchSelectedCompany(val: string[]): void {
    if (val.length === this.companies.length && !this.selectedAllCompanies) {
      this.selectedAllCompanies = true;
    }

    if (val.length !== this.companies.length && this.selectedAllCompanies) {
      this.selectedAllCompanies = false;
    }
  }

  @Watch('selectedDivision')
  watchSelectedDivision(val: string[]): void {
    if (val.length === this.division.length && !this.selectedAllDivision) {
      this.selectedAllDivision = true;
    }

    if (val.length !== this.division.length && this.selectedAllDivision) {
      this.selectedAllDivision = false;
    }
  }

  @Watch('selectedSubdivision')
  watchSelectedSubdivision(val: string[]): void {
    if (
      val.length === this.subdivision.length &&
      !this.selectedAllSubdivision
    ) {
      this.selectedAllSubdivision = true;
    }

    if (val.length !== this.subdivision.length && this.selectedAllSubdivision) {
      this.selectedAllSubdivision = false;
    }
  }

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Update Pengumuman');

    // get attachment
    this.service
      .getAttachment(get(this.$route, 'params.id', 0))
      .then((response) => {
        const {
          data: { data },
        } = response;
        this.uploadedFile = data;
      });

    // get announcement detail
    this.service.find(get(this.$route, 'params.id', 0)).then((response) => {
      const {
        data: { data },
      } = response;
      const expiredDate = !isEmpty(data.expiredAt)
        ? moment(data.expiredAt).format('YYYY-MM-DD')
        : '';
      this.data = {
        ...data,
        createdAt: moment(data.createdAt).format('YYYY-MM-DD'),
        expiredAt: expiredDate,
      };
      // add and find selected company
      const getCompanyIds: string[] = map(data.companyIds, 'id');
      this.userService.getCompany().then((res) => {
        const {
          data: { data },
        } = res;
        this.companies = data;
        const filterCompany = map(getCompanyIds, (id) =>
          find(this.companies, (x) => x.id === id)
        );
        const removeUndefined = compact(filterCompany);
        this.selectedCompanies = removeUndefined.map(
          (e) => e.id?.toString() ?? ''
        );
      });

      // add and find selected division
      const getDivision: string[] = map(data.divisionIds, 'id');
      this.userService.getDivision().then((res) => {
        const {
          data: { data },
        } = res;
        this.division = data;
        const filterDivision = map(getDivision, (id) =>
          find(this.division, (x) => x.id === id)
        );
        const removeUndefined = compact(filterDivision);
        this.selectedDivision = removeUndefined.map(
          (e) => e.id?.toString() ?? ''
        );
      });
      // add and find selected subdivision
      const getSubdivision: string[] = map(data.subdivisionIds, 'id');
      this.userService.getSubdivision().then((res) => {
        const {
          data: { data },
        } = res;
        this.subdivision = data;
        const filterDivision = map(getSubdivision, (id) =>
          find(this.subdivision, (x) => x.id === id)
        );
        const removeUndefined = compact(filterDivision);
        this.selectedSubdivision = removeUndefined.map(
          (e) => e.id?.toString() ?? ''
        );
      });
    });
  }

  formatDate(data: string): string {
    return moment(data).format('DD/MM/YYYY');
  }

  async onUpdate(): Promise<void> {
    if (this.form.validate()) {
      this.isLoading = true;
      try {
        if (this.selectedCompanies) {
          this.data.companyIds = this.selectedCompanies;
        }

        if (this.selectedDivision) {
          this.data.divisionIds = this.selectedDivision;
        }

        if (this.selectedSubdivision) {
          this.data.subdivisionIds = this.selectedSubdivision;
        }

        if (!isEmpty(this.deletedFile)) {
          try {
            await Promise.all(
              this.deletedFile.map((x) => this.service.removeAttachment(x))
            );
          } catch (error) {
            console.log(error);
          }
        }

        let uploadResult = [];

        if (!isEmpty(this.uploadFile)) {
          uploadResult = await Promise.all(
            this.uploadFile.map((x) => {
              const form = new FormData();
              form.append('file', x);
              return this.service.createAttachment(form);
            })
          ).then((res) => map(res, 'data.data'));
        }

        const {
          data: { data: response },
        } = await this.service.patch(this.data);

        if (!isEmpty(uploadResult)) {
          await Promise.all(
            uploadResult.map((x) => {
              const data: AttachmentInterface = {
                name: '',
                url: '',
                announcementId: 0,
              };
              data.name = x.name;
              data.url = x.path;
              data.announcementId = parseInt(get(this.$route, 'params.id', 0));
              return this.service.addAttachment(data);
            })
          );
        }

        this.$toast.success(`Berhasil mengubah ${response.title}`);
        this.$router.push({ name: 'Announcement' });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.$toast.error(
            get(
              error.response,
              'data.message',
              'Unable to create announcement!'
            )
          );
        }
      }
      this.isLoading = false;
    }
  }

  removeAttachment(id: number): void {
    this.deletedFile.push(this.uploadedFile[id].id ?? '');
    this.uploadedFile.splice(id, 1);
  }

  onChangeSelectedCompany(val: boolean): void {
    if (val) {
      this.selectedCompanies = this.companies.map(
        (x) => x.id?.toString() ?? ''
      );
    } else {
      this.selectedCompanies = [];
    }
  }

  onChangeSelectedDivision(val: boolean): void {
    if (val) {
      this.selectedDivision = this.division.map((x) => x.id?.toString() ?? '');
    } else {
      this.selectedDivision = [];
    }
  }

  onChangeSelectedSubdivision(val: boolean): void {
    if (val) {
      this.selectedSubdivision = this.subdivision.map(
        (x) => x.id?.toString() ?? ''
      );
    } else {
      this.selectedSubdivision = [];
    }
  }
}
</script>

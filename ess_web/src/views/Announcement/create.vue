<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onCreate">
      <v-card>
        <v-card-title>Tambah Pengumuman</v-card-title>
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
                :rules="[
                  (v) => (v || []).length > 0 || 'Mohon pilih perusahaan',
                ]"
                :menu-props="{ maxHeight: '400' }"
                label="Perusahaan"
                item-text="name"
                item-value="id"
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
                :rules="[(v) => (v || []).length > 0 || 'Mohon pilih divisi']"
                :menu-props="{ maxHeight: '400' }"
                label="Divisi"
                item-text="name"
                item-value="id"
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

          <v-file-input
            v-model="uploadedFile"
            chips
            multiple
            label="Attachment"
          ></v-file-input>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit" :loading="isLoading"
            >Tambah</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import AnnouncementInterface from '@/interface/announcement.interface';
import AttachmentInterface from '@/interface/attachment.interface';
import CompanyInterface from '@/interface/company.inteface';
import DivisionInterface from '@/interface/division.interface';
import SubdivisionInterface from '@/interface/subdivision.interface';
import AnnouncementServices from '@/services/announcement.service';
import UserServices from '@/services/users.service';
import { VForm } from '@/utils/types';
import axios from 'axios';
import { get, isEmpty, map } from 'lodash';
import moment from 'moment';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { VueEditor } from 'vue2-editor';
const MainModule = namespace('MainModule');

@Component({
  components: {
    VueEditor,
  },
})
export default class CreateAnnouncementPage extends Vue {
  @Ref('form') readonly form!: VForm;

  service = new AnnouncementServices();
  userService = new UserServices();
  isLoading = false;
  selectedAllCompanies = false;
  selectedAllDivision = false;
  selectedAllSubdivision = false;

  customToolbar = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }, { align: [] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['code-block', 'link'],
  ];

  publishModal = false;
  expiredModal = false;

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

  uploadedFile = [];

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
    this.updateTitle('Tambah Pengumuman');
    this.userService.getCompany().then((res) => {
      const {
        data: { data },
      } = res;
      this.companies = data;
    });

    this.userService.getDivision().then((res) => {
      const {
        data: { data },
      } = res;
      this.division = data;
    });

    this.userService.getSubdivision().then((res) => {
      const {
        data: { data },
      } = res;
      this.subdivision = data;
    });
  }

  formatDate(data: string): string {
    return moment(data).format('DD/MM/YYYY');
  }

  async onCreate(): Promise<void> {
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

        let uploadResult = [];

        if (!isEmpty(this.uploadedFile)) {
          uploadResult = await Promise.all(
            this.uploadedFile.map((x) => {
              const form = new FormData();
              form.append('file', x);
              return this.service.createAttachment(form);
            })
          ).then((res) => map(res, 'data.data'));
        }

        const {
          data: { data: response },
        } = await this.service.create(this.data);

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
              data.announcementId = response.id as number;
              return this.service.addAttachment(data);
            })
          );
        }

        this.$toast.success(`Berhasil menambahkan ${response.title}`);
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

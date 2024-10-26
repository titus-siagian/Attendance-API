<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onCreate">
      <v-card>
        <v-card-title>Tambah Karyawan</v-card-title>
        <v-card-text class="space-y-4">
          <div class="flex space-x-4">
            <v-text-field
              filled
              label="No. KTP"
              placeholder="123456789"
              counter="16"
              maxLength="16"
              :rules="[(v) => !!v || 'Mohon masukkan No. KTP']"
              v-model="data.identityNumber"
              class="w-1/2"
            ></v-text-field>
            <v-text-field
              filled
              label="ID Karyawan"
              placeholder="123456789"
              v-model="data.id"
              class="w-1/2"
            ></v-text-field>
          </div>
          <v-text-field
            filled
            label="Nama"
            placeholder="John Doe"
            :rules="[(v) => !!v || 'Mohon masukkan nama']"
            v-model="data.name"
          ></v-text-field>
          <v-text-field
            filled
            label="Email"
            placeholder="JohnDoe@example.com"
            :rules="[(v) => !!v || 'Mohon masukkan email']"
            v-model="data.email"
          ></v-text-field>
          <v-textarea
            filled
            label="Alamat (optional)"
            placeholder="Jl. Asia Afrika"
            v-model="data.address"
          ></v-textarea>
          <div class="grid grid-cols-2 gap-4">
            <v-text-field
              filled
              label="Tempat lahir"
              placeholder="Jakarta"
              v-model="data.placeOfBirth"
            ></v-text-field>
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="date"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  filled
                  v-model="date"
                  label="Tanggal lahir"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.dialog.save(date)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <v-text-field
              filled
              label="No HP"
              placeholder="08xxxxx"
              :rules="[(v) => !!v || 'Mohon masukkan No HP']"
              counter="14"
              maxLength="14"
              v-model="data.phone"
              @keypress="isNumber"
            ></v-text-field>
            <v-select
              v-model="data.sex"
              :items="jnsKelamin"
              item-text="state"
              item-value="value"
              label="Jenis Kelamin"
              filled
              persistent-hint
            ></v-select>
            <v-select
              v-model="data.blood"
              :items="bloodItems"
              item-text="state"
              item-value="value"
              label="Golongan Darah"
              filled
              persistent-hint
            ></v-select>
            <v-select
              v-model="data.companyId"
              :items="companies"
              item-text="name"
              item-value="id"
              label="Perusahaan"
              :rules="[(v) => !!v || 'Mohon pilih perusahaan']"
              filled
              persistent-hint
              @change="onChangeCompany"
            ></v-select>
            <v-select
              v-model="data.divisionId"
              :items="division"
              item-text="name"
              item-value="id"
              label="Divisi"
              :rules="[(v) => !!v || 'Mohon pilih divisi']"
              filled
              persistent-hint
              @change="onChangeDivision"
            ></v-select>
            <v-select
              v-model="data.subdivisionId"
              :items="subdivision"
              item-text="name"
              item-value="id"
              label="Sub Divisi"
              :rules="[(v) => !!v || 'Mohon pilih sub divisi']"
              filled
              persistent-hint
              @change="onChangeSubdivision"
            ></v-select>
            <v-select
              v-model="data.departmentId"
              :items="department"
              item-text="name"
              item-value="id"
              label="Departemen"
              :rules="[(v) => !!v || 'Mohon pilih departemen']"
              filled
              persistent-hint
            ></v-select>
          </div>
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
import CompanyInterface from '@/interface/company.inteface';
import DepartmentInterface from '@/interface/department.interface';
import DivisionInterface from '@/interface/division.interface';
import SubdivisionInterface from '@/interface/subdivision.interface';
import UserInterface from '@/interface/user.interface';
import ScheduleServices from '@/services/schedule.service';
import UserServices from '@/services/users.service';
import { VForm } from '@/utils/types';
import axios from 'axios';
import { get } from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import moment from 'moment';
const MainModule = namespace('MainModule');

@Component
export default class CreateUserPage extends Vue {
  @Ref('form') readonly form!: VForm;

  modal = false;
  isLoading = false;
  date: string | null = null;

  jnsKelamin = [
    { state: 'Laki-laki', value: 0 },
    { state: 'Perempuan', value: 1 },
  ];

  companies: CompanyInterface[] = [];
  division: DivisionInterface[] = [];
  subdivision: SubdivisionInterface[] = [];
  department: DepartmentInterface[] = [];

  status = [
    { state: 'Aktif', value: true },
    { state: 'Non Aktif', value: false },
  ];

  bloodItems = [
    { state: 'A', value: 'A' },
    { state: 'B', value: 'B' },
    { state: 'O', value: 'O' },
    { state: 'AB', value: 'AB' },
  ];

  data: UserInterface = {
    id: null,
    active: true,
    name: '',
    email: '',
    avatarUrl: null,
    address: '',
    phone: '',
    divisionId: '',
    identityNumber: null,
    dateOfBirth: null,
    placeOfBirth: '',
    blood: '',
    sex: 0,
    role: 'USER',
    companyId: '',
    subdivisionId: '',
    departmentId: '',
    password: null,
  };

  service: UserServices = new UserServices();
  scheduleService: ScheduleServices = new ScheduleServices();

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Tambah Karyawan');

    this.service.getCompany().then((res) => {
      const {
        data: { data },
      } = res;
      this.companies = data;
    });
  }

  async onCreate(): Promise<void> {
    if (this.form.validate()) {
      this.isLoading = true;
      try {
        this.data.dateOfBirth = new Date(this.date ?? '');
        this.data.password = moment(this.date).format('DDMMYYYY');
        const {
          data: { data: response },
        } = await this.service.createUser(this.data);
        this.$toast.success(`Berhasil menambahkan ${response.name}`);
        this.$router.push({ name: 'Users' });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message: string = get(error.response, 'data.message', '');
          this.$toast.error(message);
        }
      }
      this.isLoading = false;
    }
  }

  async onChangeCompany(e: string): Promise<void> {
    try {
      const {
        data: { data: response },
      } = await this.service.getDivision(e);
      this.division = response;
      this.subdivision = [];
      this.department = [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message: string = get(error.response, 'data.message', '');
        this.$toast.error(message);
      }
    }
  }

  async onChangeDivision(e: string): Promise<void> {
    try {
      const {
        data: { data: response },
      } = await this.service.getSubdivision(e);
      this.subdivision = response;
      this.department = [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message: string = get(error.response, 'data.message', '');
        this.$toast.error(message);
      }
    }
  }

  async onChangeSubdivision(e: string): Promise<void> {
    try {
      const {
        data: { data: response },
      } = await this.service.getDepartment(e);
      this.department = response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message: string = get(error.response, 'data.message', '');
        this.$toast.error(message);
      }
    }
  }

  isNumber(evt: KeyboardEvent): boolean {
    const charCode: number = evt.charCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      evt.preventDefault();
      return false;
    }
    return true;
  }
}
</script>

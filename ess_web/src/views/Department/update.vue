<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onUpdate">
      <v-card>
        <v-card-title>Update Sub Divisi</v-card-title>
        <v-card-text class="space-y-4">
          <v-select
            v-model="selectedCompanyId"
            :items="companies"
            item-text="name"
            item-value="id"
            label="Perusahaan"
            filled
            single-line
            @change="onChangeCompany"
          ></v-select>
          <v-select
            v-model="selectedDivisionId"
            :items="divisions"
            item-text="name"
            item-value="id"
            label="Divisi"
            filled
            single-line
            @change="onChangeDivision"
          ></v-select>
          <v-select
            v-model="data.subdivisionId"
            :items="subdivisions"
            item-text="name"
            item-value="id"
            label="Sub Divisi"
            :rules="[(v) => !!v || 'Mohon pilih Sub Divisi']"
            filled
            single-line
          ></v-select>
          <v-text-field
            filled
            label="ID Departemen"
            counter="3"
            maxLength="3"
            :rules="[(v) => !!v || 'Mohon masukkan id Departemen']"
            v-model="data.name"
          ></v-text-field>
          <v-text-field
            filled
            label="Nama Departemen"
            placeholder="PT. ABCDE"
            :rules="[(v) => !!v || 'Mohon masukkan nama Departemen']"
            v-model="data.name"
          ></v-text-field>
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
import CompanyInterface from '@/interface/company.inteface';
import DepartmentInterface from '@/interface/department.interface';
import DivisionInterface from '@/interface/division.interface';
import SubdivisionInterface from '@/interface/subdivision.interface';
import UserServices from '@/services/users.service';
import { VForm } from '@/utils/types';
import axios from 'axios';
import { get, isEmpty } from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const MainModule = namespace('MainModule');

@Component
export default class UpdateDepartmentPage extends Vue {
  @Ref('form') readonly form!: VForm;

  userService = new UserServices();

  isLoading = false;

  data: DepartmentInterface = {
    id: null,
    name: '',
    company: undefined,
    subdivisionId: null,
    division: undefined,
    subdivision: undefined,
  };

  selectedCompanyId: string | null = null;
  selectedDivisionId: string | null = null;

  companies: CompanyInterface[] = [];

  divisions: DivisionInterface[] = [];

  subdivisions: SubdivisionInterface[] = [];

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Update Departemen');
    if (!isEmpty(this.$route.params.id)) {
      this.getSubDivisionDetail();
    }
  }

  async getSubDivisionDetail(): Promise<void> {
    try {
      const {
        data: { data: department },
      } = await this.userService.findDepartment(
        get(this.$route, 'params.id', 0)
      );

      const {
        data: { data: subdivision },
      } = await this.userService.findSubdivision(
        department.subdivisionId ?? ''
      );

      const {
        data: { data: division },
      } = await this.userService.findDivision(subdivision?.divisionId ?? '');
      this.selectedDivisionId = division.id;

      const {
        data: { data: companies },
      } = await this.userService.getCompany();
      this.companies = companies;
      const {
        data: { data: company },
      } = await this.userService.findCompany(division?.companyId ?? '');
      this.selectedCompanyId = company.id;

      const {
        data: { data: divisions },
      } = await this.userService.getDivision(company?.id ?? '');
      this.divisions = divisions;

      const {
        data: { data: subdivisions },
      } = await this.userService.getSubdivision(division.id ?? '');
      this.subdivisions = subdivisions;

      this.data = department;
    } catch (error) {
      console.log(error);
    }
  }

  async onChangeCompany(data: string): Promise<void> {
    try {
      const {
        data: { data: response },
      } = await this.userService.getDivision(data);
      this.divisions = response;
    } catch (error) {
      console.log('find all division', error);
    }
  }

  async onChangeDivision(data: string): Promise<void> {
    try {
      this.data.subdivisionId = null;
      const {
        data: { data: response },
      } = await this.userService.getSubdivision(data);
      this.subdivisions = response;
    } catch (error) {
      console.log('find all sub division', error);
    }
  }

  async onUpdate(): Promise<void> {
    if (this.form.validate()) {
      this.isLoading = true;
      try {
        const {
          data: { data: response },
        } = await this.userService.updateDepartment(this.data);
        this.$toast.success(`Berhasil mengubah ${response.name}`);
        this.$router.push({ name: 'Department' });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.$toast.error(error.message);
        }
      }
      this.isLoading = false;
    }
  }
}
</script>

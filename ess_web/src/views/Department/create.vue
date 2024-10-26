<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onCreate">
      <v-card>
        <v-card-title>Tambah Departemen</v-card-title>
        <v-card-text class="space-y-4">
          <v-select
            :items="companies"
            item-text="name"
            item-value="id"
            label="Perusahaan"
            @change="onChangeCompany"
            filled
            single-line
          ></v-select>
          <v-select
            :items="divisions"
            item-text="name"
            item-value="id"
            label="Divisi"
            @change="onChangeDivision"
            filled
            single-line
          ></v-select>
          <v-select
            v-model="data.subdivisionId"
            :items="subdivisions"
            item-text="name"
            item-value="id"
            label="Sub Divisi"
            :rules="[(v) => !!v || 'Mohon pilih divisi']"
            filled
            single-line
          ></v-select>
          <v-text-field
            filled
            label="ID Departemen"
            counter="3"
            maxLength="3"
            :rules="[(v) => !!v || 'Mohon masukkan id Departemen']"
            v-model="data.id"
          ></v-text-field>
          <v-text-field
            filled
            label="Nama Departemen"
            placeholder="Departemen"
            :rules="[(v) => !!v || 'Mohon masukkan nama Departemen']"
            v-model="data.name"
          ></v-text-field>
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
import UserServices from '@/services/users.service';
import { VForm } from '@/utils/types';
import axios from 'axios';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import CompanyInterface from '@/interface/company.inteface';
import DivisionInterface from '@/interface/division.interface';
import DepartmentInterface from '@/interface/department.interface';
import SubdivisionInterface from '@/interface/subdivision.interface';
const MainModule = namespace('MainModule');

@Component
export default class CreateDepartmentPage extends Vue {
  @Ref('form') readonly form!: VForm;

  userService = new UserServices();

  isLoading = false;

  data: DepartmentInterface = {
    id: null,
    name: '',
    division: undefined,
    company: undefined,
    subdivisionId: null,
    subdivision: undefined,
  };

  companies: CompanyInterface[] = [];

  divisions: DivisionInterface[] = [];

  subdivisions: SubdivisionInterface[] = [];

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Tambah Departemen');
    this.getCompany();
  }

  async onChangeCompany(data: string): Promise<void> {
    try {
      const { data: { data: response } } = await this.userService.getDivision(data);
      this.divisions = response;
    } catch (error) {
      console.log('find all division', error);
    }
  }

  async onChangeDivision(data: string): Promise<void> {
    try {
      this.data.subdivisionId = null;
      const { data: { data: response } } = await this.userService.getSubdivision(data);
      this.subdivisions = response;
    } catch (error) {
      console.log('find all sub division', error);
    }
  }

  async getCompany(): Promise<void> {
    try {
      const { data: { data } } = await this.userService.getCompany();
      this.companies = data;
    } catch (error) {
      console.log('get division', error);
    }
  }

  async onCreate(): Promise<void> {
    if (this.form.validate()) {
      this.isLoading = true;
      try {
        const { data: { data: response } } = await this.userService.createDepartment(
          this.data
        );
        this.$toast.success(`Berhasil menambahkan ${response.name}`);
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

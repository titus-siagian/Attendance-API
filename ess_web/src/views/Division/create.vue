<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onCreate">
      <v-card>
        <v-card-title>Tambah Divisi</v-card-title>
        <v-card-text class="space-y-4">
          <v-select
            v-model="data.companyId"
            :items="companies"
            item-text="name"
            item-value="id"
            label="Perusahaan"
            :rules="[(v) => !!v || 'Mohon pilih perusahaan']"
            filled
            single-line
          ></v-select>
          <v-text-field
            filled
            label="ID Divisi"
            counter="3"
            maxLength="3"
            :rules="[(v) => !!v || 'Mohon masukkan id divisi']"
            v-model="data.id"
          ></v-text-field>
          <v-text-field
            filled
            label="Nama Divisi"
            placeholder="Divisi"
            :rules="[(v) => !!v || 'Mohon masukkan nama divisi']"
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
import DivisionInterface from '@/interface/division.interface';
import CompanyInterface from '@/interface/company.inteface';
const MainModule = namespace('MainModule');

@Component
export default class CreateDivisionPage extends Vue {
  @Ref('form') readonly form!: VForm;

  userService = new UserServices();

  isLoading = false;

  data: DivisionInterface = {
    id: null,
    companyId: null,
    name: '',
    company: undefined,
  };

  companies: CompanyInterface[] = [];

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Tambah Divisi');
    this.getCompany();
  }

  async getCompany(): Promise<void> {
    try {
      const { data: { data } } = await this.userService.getCompany();
      this.companies = data;
    } catch (error) {
      console.log('get company', error);
    }
  }

  async onCreate(): Promise<void> {
    if (this.form.validate()) {
      this.isLoading = true;
      try {
        const { data: { data: response } } = await this.userService.createDivision(
          this.data
        );
        this.$toast.success(`Berhasil menambahkan ${response.name}`);
        this.$router.push({ name: 'Division' });
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

<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onCreate">
      <v-card>
        <v-card-title>Tambah Perusahaan</v-card-title>
        <v-card-text class="space-y-4">
          <v-text-field
            filled
            label="ID Perusahaan"
            counter="3"
            maxLength="3"
            :rules="[(v) => !!v || 'Mohon masukkan id perusahaan']"
            v-model="data.id"
          ></v-text-field>
          <v-text-field
            filled
            label="Nama Perusahaan"
            placeholder="PT. ABCDE"
            :rules="[(v) => !!v || 'Mohon masukkan nama perusahaan']"
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
import { get } from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import CompanyInterface from '../../interface/company.inteface';
const MainModule = namespace('MainModule');

@Component
export default class CreateCompanyPage extends Vue {
  @Ref('form') readonly form!: VForm;

  userService = new UserServices();

  isLoading = false;

  data: CompanyInterface = {
    id: null,
    name: '',
  };

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Tambah Perusahaan');
  }

  async onCreate(): Promise<void> {
    if (this.form.validate()) {
      this.isLoading = true;
      try {
        const { data: { data: response } } = await this.userService.createCompany(
          this.data
        );
        this.$toast.success(`Berhasil menambahkan ${response.name}`);
        this.$router.push({ name: 'Company' });
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          this.$toast.error(get(error.response, 'data.message'));
        }
      }
      this.isLoading = false;
    }
  }
}
</script>

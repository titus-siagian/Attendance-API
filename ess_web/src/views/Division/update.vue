<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onUpdate">
      <v-card>
        <v-card-title>Update Divisi</v-card-title>
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
            :rules="[(v) => !!v || 'Mohon masukkan id Divisi']"
            v-model="data.name"
          ></v-text-field>
          <v-text-field
            filled
            label="Nama Divisi"
            placeholder="PT. ABCDE"
            :rules="[(v) => !!v || 'Mohon masukkan nama Divisi']"
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
import DivisionInterface from '@/interface/division.interface';
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
export default class UpdateDivisionPage extends Vue {
  @Ref('form') readonly form!: VForm;

  userService = new UserServices();

  isLoading = false;

  data: DivisionInterface = {
    id: null,
    name: '',
    companyId: null,
    company: undefined,
  };

  companies: CompanyInterface[] = [];

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Update Divisi');
    if (!isEmpty(this.$route.params.id)) {
      this.getCompany();
      this.userService
        .findDivision(get(this.$route, 'params.id', 0))
        .then((response) => {
          const {
            data: { data },
          } = response;
          this.data = data;
          console.log(data);
        });
    }
  }

  async getCompany(): Promise<void> {
    try {
      const {
        data: { data },
      } = await this.userService.getCompany();
      this.companies = data;
    } catch (error) {
      console.log('get company', error);
    }
  }

  async onUpdate(): Promise<void> {
    if (this.form.validate()) {
      this.isLoading = true;
      try {
        const {
          data: { data: response },
        } = await this.userService.updateDivision(this.data);
        this.$toast.success(`Berhasil mengubah ${response.name}`);
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

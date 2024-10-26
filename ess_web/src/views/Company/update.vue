<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onUpdate">
      <v-card>
        <v-card-title>Update Perusahaan</v-card-title>
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
            >Update</v-btn
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
import { get, isEmpty } from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import CompanyInterface from '../../interface/company.inteface';
const MainModule = namespace('MainModule');

@Component
export default class UpdateCompanyPage extends Vue {
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
    this.updateTitle('Update Perusahaan');
    if (!isEmpty(this.$route.params.id)) {
      this.userService
        .findCompany(get(this.$route, 'params.id', 0))
        .then((response) => {
          const { data: { data } } = response;
          this.data = data;
        });
    }
  }

  async onUpdate(): Promise<void> {
    if (this.form.validate()) {
      this.isLoading = true;
      try {
        const { data: { data: response } } = await this.userService.updateCompany(
          this.data
        );
        this.$toast.success(`Berhasil mengubah ${response.name}`);
        this.$router.push({ name: 'Company' });
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

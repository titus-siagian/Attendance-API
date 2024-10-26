<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onCreate">
      <v-card>
        <v-card-title>Pengaturan</v-card-title>
        <v-card-text class="space-y-4">
          <v-text-field
            filled
            label="Lama Session (menit)"
            :rules="[(v) => !!v || 'Mohon masukkan lama session']"
            type="number"
            v-model="session"
          ></v-text-field>
          <div class="flex space-x-2">
            <v-text-field
              filled
              label="Ganti Kata Sandi (opsional)"
              v-model="password"
            ></v-text-field>
            <v-text-field
              filled
              label="Konfirmasi Kata Sandi"
              :rules="[(v) => password === v || 'Kata sandi tidak sama']"
              v-model="passwordValidation"
            ></v-text-field>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit" :loading="isLoading"
            >Simpan</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import UserInterface from '@/interface/user.interface';
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
export default class CreateCompanyPage extends Vue {
  @Ref('form') readonly form!: VForm;

  userService = new UserServices();

  isLoading = false;

  session = '';
  password = '';
  passwordValidation = '';

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Pengaturan');

    const getSession = localStorage.getItem('session');
    this.session = (parseInt(getSession ?? '0') / 1000 / 60).toString();
  }

  async onCreate(): Promise<void> {
    this.isLoading = true;
    if (this.form.validate()) {
      const calculateSession = (parseInt(this.session) * 60 * 1000).toString();
      localStorage.setItem('session', calculateSession);

      if (!isEmpty(this.password)) {
        try {
          const {
            data: { data: user },
          } = await this.userService.me();
          const data: UserInterface = {
            id: user.id,
            password: this.password,
          };
          await this.userService.updateUser(data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            this.$toast.error(get(error.response, 'data.message'));
            this.isLoading = false;
            return;
          }
        }
      }

      this.$toast.success('Berhasil menyimpan pengaturan!');
    }
    this.isLoading = false;
  }
}
</script>

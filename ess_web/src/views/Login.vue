<template>
  <div class="h-screen w-screen flex items-center justify-center bg-blue-100">
    <div class="bg-gray-50 px-8 py-6 border border-gray-200 w-80 rounded">
      <h1 class="text-2xl mb-4">Login</h1>
      <v-form
        class="space-y-4"
        ref="form"
        @submit.prevent="onLogin"
        lazy-validation
      >
        <v-text-field
          label="Email"
          placeholder="johndoe@example.com"
          :rules="[(v) => !!v || 'Mohon masukkan email']"
          v-model="data.email"
          required
        ></v-text-field>
        <v-text-field
          v-model="data.password"
          label="Password"
          placeholder="*****"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          :rules="[(v) => !!v || 'Mohon masukkan password']"
          required
        ></v-text-field>
        <v-btn
          color="primary"
          class="w-full mt-8"
          type="submit"
          :loading="isLoading"
          >Login
        </v-btn>
      </v-form>
    </div>
    <v-alert
      class="alert-absolute"
      v-model="alert.show"
      text
      type="error"
      dismissible
      >{{ alert.message }}</v-alert
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { VForm } from '../utils/types';
import LoginInterface from '../interface/login.interface';
import AuthService from '../services/auth.service';
import { get, isEmpty } from 'lodash';
import request from 'axios';
import AlertInterface from '../interface/alert.interface';
import { namespace } from 'vuex-class';
import UserServices from '@/services/users.service';
import Helper from '@/utils/helper';
const MainModule = namespace('MainModule');

@Component
export default class LoginView extends Vue {
  @Ref('form') readonly form!: VForm;
  isLoading = false;
  alert: AlertInterface = {
    show: false,
    message: [],
  };
  data: LoginInterface = {
    email: '',
    password: '',
  };
  showPassword = false;
  private readonly repository = new AuthService();
  private readonly userService = new UserServices();

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Login');
  }

  async onLogin(): Promise<void> {
    if (this.form.validate()) {
      this.isLoading = true;
      try {
        const {
          data: { data },
        } = await this.repository.login(this.data);
        const token = get(data, 'accessToken', null);
        if (token) {
          let getSession = localStorage.getItem('session');
          if (isEmpty(getSession)) {
            localStorage.setItem('session', (60 * 5 * 1000).toString());
            getSession = (60 * 5 * 1000).toString();
          }

          Helper.setWithExpiry('token', token, parseInt(getSession ?? '5000'));
          const {
            data: { data },
          } = await this.userService.me();
          if (data.role == 'ADMIN') {
            this.$router.replace({ name: 'Users' });
          } else {
            localStorage.removeItem('token');
            this.$toast.error('Username / password anda salah');
          }
        }
      } catch (error) {
        if (request.isAxiosError(error)) {
          this.alert.show = true;
          this.alert.message = get(error.response, 'data.message');
          setTimeout(() => {
            this.alert.show = false;
          }, 2000);
        }
      }
      this.isLoading = false;
    }
  }
}
</script>

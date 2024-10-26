<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <div class="flex items-center space-x-4 max-w-xl">
          <v-text-field
            filled
            dense
            clearable
            hide-details
            single-line
            label="Search"
            placeholder="Cari nama"
            v-model="keyword"
          ></v-text-field>
          <v-select
            class="w-20"
            label="Filter"
            placeholder="filter"
            v-model="filter"
            :items="keywordFilters"
            dense
            filled
            hide-details
            single-line
          ></v-select>
          <v-btn @click="search()">Cari</v-btn>
          <v-btn color="red" class="white--text" @click="reset()">Reset</v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$router.push({ name: 'CreateUser' })"
          >Create</v-btn
        >
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="10"
        :server-items-length="total"
        :loading="loading"
        :options.sync="options"
        @update:page="pagination"
        @update:options="changeOptions"
        @update:items-per-page="updatePerPage"
        class="elevation-1"
        :footer-props="{
          itemsPerPageOptions: [10, 20, 50],
        }"
      >
        <template v-slot:[`item.active`]="{ item }">
          {{ item.active ? 'Aktif' : 'Non Aktif' }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon color="green" :to="`/users/update/${item.id}`">
            <v-icon small class="mr-2"> mdi-pencil </v-icon>
          </v-btn>
          <v-btn icon @click="showChangePasswordPrompt(item)">
            <v-icon small> mdi-lock </v-icon>
          </v-btn>
          <v-btn icon color="primary" @click="showResetDeviceId(item)">
            <v-icon small> mdi-cellphone </v-icon>
          </v-btn>
          <v-btn icon color="red" @click="showDeletePrompt(item)">
            <v-icon small> mdi-delete </v-icon>
          </v-btn>
        </template></v-data-table
      >
    </v-card>
    <v-dialog v-model="deviceIdData.show" width="300">
      <v-card>
        <v-card-title>Reset DeviceID</v-card-title>
        <v-card-text>
          Apakah anda yakin untuk reset DeviceID
          <b>{{ getLodash(deviceIdData, 'user.name', '') }}</b
          >?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deviceIdData.show = false">Tidak</v-btn>
          <v-btn
            color="red"
            text
            :loading="deviceIdData.loading"
            @click="onResetID"
            >Reset</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="changePasswordData.show" width="500">
      <v-card>
        <v-card-title>Ubah password</v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="changePassword">
            <v-text-field
              filled
              label="Password baru"
              :type="showPassword1 ? 'text' : 'password'"
              :append-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword1 = !showPassword1"
              :rules="[(v) => !!v || 'Mohon masukkan password baru']"
              v-model="fieldPassword1"
            ></v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                type="submit"
                :loading="changePasswordData.loading"
                >Simpan</v-btn
              >
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showPrompt" width="300">
      <v-card>
        <v-card-title>Konfirmasi</v-card-title>
        <v-card-text
          >Apakah anda yakin menghapus <b>{{ getLodash(prompt, 'name', '') }}</b
          >?</v-card-text
        >
        <v-card-actions>
          <v-spacer> </v-spacer>
          <v-btn text @click="showPrompt = false">Tidak</v-btn>
          <v-btn
            :loading="loadingDelete"
            color="red"
            text
            @click="deleteMasterLocation(prompt.id)"
            >Iya</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import CompanyInterface from '@/interface/company.inteface';
import ErrorInterface from '@/interface/error.interface';
import UserInterface from '@/interface/user.interface';
import AuthServices from '@/services/auth.service';
import UserService from '@/services/users.service';
import { VForm } from '@/utils/types';
import axios from 'axios';
import { get, isEmpty, map } from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { DataOptions } from 'vuetify';
import { namespace } from 'vuex-class';
import UserParams from '@/interface/params/user-params.interface';
const MainModule = namespace('MainModule');

interface UserViewInterface extends UserInterface {
  company: CompanyInterface | undefined;
}

@Component
export default class ViewUserPage extends Vue {
  @Ref('form') readonly form!: VForm;

  deviceIdData = {
    loading: false,
    show: false,
    user: '' as UserInterface,
  };

  changePasswordData = {
    loading: false,
    show: false,
    userId: '',
  };
  fieldPassword1 = '';
  showPassword1 = false;

  loading = false;
  headers = [
    { text: 'ID Karyawan', value: 'id' },
    { text: 'Nama', value: 'name' },
    { text: 'Status', value: 'active' },
    { text: 'Email', value: 'email' },
    { text: 'No HP', value: 'phone' },
    { text: 'Perusahaan', value: 'company.name', sortable: false },
    { text: 'Actions', value: 'actions', sortable: false },
  ];
  total = 0;
  page = 1;
  filter = 'name';
  keywordFilters = ['name', 'id', 'email'];
  options: DataOptions = {
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    groupDesc: [],
    multiSort: false,
    mustSort: false,
  };
  items: UserViewInterface[] = [];
  params: UserParams = {};
  keyword = '';

  showPrompt = false;
  loadingDelete = false;
  prompt: UserInterface | null = null;
  userService = new UserService();
  authService = new AuthServices();

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Karyawan');
    this.params.take = 10;
    this.getUsers();
  }

  async onResetID(): Promise<void> {
    this.deviceIdData.loading = true;
    try {
      await this.authService.deleteDeviceId(get(this.deviceIdData, 'user.id'));
      this.$toast.success(
        `Berhasil mereset deviceID ${this.deviceIdData.user.name}`
      );
      this.deviceIdData.show = false;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as ErrorInterface;
        this.$toast.error(data.message);
      }
    }
    this.deviceIdData.loading = false;
  }

  async changePassword(): Promise<void> {
    this.changePasswordData.loading = true;
    try {
      if (this.form.validate()) {
        const request: UserInterface = {
          id: this.changePasswordData.userId,
          password: this.fieldPassword1,
        };
        const {
          data: { data },
        } = await this.userService.updateUser(request);
        this.$toast.success(`Berhasil mengubah password ${data.name}`);
        this.changePasswordData.show = false;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as ErrorInterface;
        this.$toast.error(data.message);
      }
    }
    this.changePasswordData.loading = false;
  }

  async getUsers(): Promise<void> {
    this.loading = true;
    try {
      const { data } = await this.userService.getUsers(this.params);
      this.total = data.total;

      const { data: user } = data;

      const mapCompany = user.map((e) =>
        this.userService.findCompany(e.companyId ?? '').catch((e) => e)
      );
      const getCompany = await Promise.all(mapCompany).then((e) =>
        map(e, 'data.data')
      );
      this.items = user.map((e) => {
        const company = getCompany.find((x) => get(x, 'id') === e.companyId);
        return {
          ...e,
          company,
        };
      });
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
  }

  async deleteMasterLocation(id: string): Promise<void> {
    this.loadingDelete = true;
    try {
      const {
        data: { data },
      } = await this.userService.deleteUser(id);
      this.showPrompt = false;
      this.$toast.success(`Berhasil menghapus ${data.name}`);
      this.getUsers();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as ErrorInterface;
        this.$toast.error(data.message);
      }
    }
    this.loadingDelete = false;
  }

  showResetDeviceId(data: UserInterface): void {
    this.deviceIdData.user = data;
    this.deviceIdData.show = true;
  }

  showChangePasswordPrompt(data: UserInterface): void {
    this.changePasswordData.userId = data.id || '';
    this.changePasswordData.show = true;
  }

  showDeletePrompt(data: UserInterface): void {
    this.prompt = data;
    this.showPrompt = true;
  }

  getLodash(val: unknown, type: string, defaultValue: string): unknown {
    return get(val, type, defaultValue);
  }

  pagination(val: number): void {
    this.params.skip = (val - 1) * (this.params.take ?? 10);
    this.getUsers();
    this.page = val;
  }

  changeOptions(): void {
    if (!isEmpty(this.options.sortBy)) {
      const desc = this.options.sortDesc[0] ? 'asc' : 'desc';
      this.params.sortBy = [`${this.options.sortBy[0]} ${desc}`];
    } else {
      this.params.sortBy = [];
    }
    this.getUsers();
  }

  updatePerPage(val: number): void {
    this.params.take = val;
    this.getUsers();
  }

  search(): void {
    if (this.filter === 'email') {
      this.params.email = this.keyword;
    } else if (this.filter === 'id') {
      this.params.id = this.keyword;
    } else {
      this.params.name = this.keyword;
    }

    this.params.skip = 0;
    this.getUsers();
  }

  reset(): void {
    this.params = {
      take: 10,
    };
    this.filter = 'name';
    this.keyword = '';
    this.getUsers();
  }
}
</script>

<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <div class="flex items-center space-x-4 max-w-lg">
          <v-text-field
            filled
            dense
            clearable
            hide-details
            single-line
            label="Search"
            placeholder="Nama Perusahaan"
            v-model="keyword"
          ></v-text-field>
          <v-btn @click="search()">Cari</v-btn>
          <v-btn color="red" class="white--text" @click="reset()">Reset</v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$router.push({ name: 'CreateCompany' })"
          >Create</v-btn
        >
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="10"
        :server-items-length="items.length"
        :loading="loading"
        class="elevation-1"
        :footer-props="{
          itemsPerPageOptions: [10, 20, 50],
        }"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon :to="`/company/update/${item.id}`">
            <v-icon small class="mr-2"> mdi-pencil </v-icon>
          </v-btn>
          <v-btn icon color="red" @click="showDeletePrompt(item)">
            <v-icon small> mdi-delete </v-icon>
          </v-btn>
        </template></v-data-table
      >
    </v-card>
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
            @click="deleteCompany(prompt.id)"
            >Iya</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import CompanyInterface from '@/interface/company.inteface';
import UserService from '@/services/users.service';
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { get, isEmpty } from 'lodash';
import axios from 'axios';
const MainModule = namespace('MainModule');

@Component
export default class ViewCompanyPage extends Vue {
  loading = false;
  headers = [
    { text: 'Nama', value: 'name' },
    { text: 'Actions', value: 'actions', sortable: false },
  ];
  items: CompanyInterface[] = [];
  showPrompt = false;
  loadingDelete = false;
  tempItems: CompanyInterface[] = [];
  keyword = '';
  prompt: CompanyInterface | null = null;
  userService = new UserService();

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Perusahaan');
    this.getCompany();
  }

  async getCompany(): Promise<void> {
    this.loading = true;
    try {
      const {
        data: { data },
      } = await this.userService.getCompany();
      this.items = data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.$toast.error(error.message);
      }
    }
    this.loading = false;
  }

  async deleteCompany(id: string): Promise<void> {
    this.loadingDelete = true;
    try {
      const {
        data: { data },
      } = await this.userService.deleteCompany(id);
      this.showPrompt = false;
      this.$toast.success(`Berhasil menghapus ${data.name}`);
      this.getCompany();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.$toast.error(error.message);
      }
    }
    this.loadingDelete = false;
  }

  showDeletePrompt(data: CompanyInterface): void {
    this.prompt = data;
    this.showPrompt = true;
  }

  getLodash(val: unknown, type: string, defaultValue: string): unknown {
    return get(val, type, defaultValue);
  }

  search(): void {
    if (isEmpty(this.tempItems)) {
      this.tempItems = this.items;
    }
    if (!isEmpty(this.keyword)) {
      this.items = this.items.filter((x) =>
        x.name.toLowerCase().includes(this.keyword)
      );
    } else {
      this.reset();
    }
  }

  reset(): void {
    if (!isEmpty(this.tempItems)) {
      this.items = this.tempItems;
      this.tempItems = [];
    }
    this.keyword = '';
  }
}
</script>

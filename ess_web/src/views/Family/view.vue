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
            placeholder="Keluarga dari"
            v-model="keyword"
          ></v-text-field>
          <v-btn @click="search()">Cari</v-btn>
          <v-btn color="red" class="white--text" @click="reset()">Reset</v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$router.push({ name: 'CreateFamily' })"
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
        <template v-slot:[`item.relationship`]="{ item }">
          {{ getRelationship(item.relationship) }}
        </template>
        <template v-slot:[`item.sex`]="{ item }">
          {{ item.sex === 0 ? 'Laki-laki' : 'Perempuan' }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon :to="`/family/update/${item.id}`">
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
            @click="deleteFamily(prompt.id)"
            >Iya</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import FamilyParams from '@/interface/params/family-params.interface';
import FamilyInterface from '@/interface/family.interface';
import FamilyServices from '@/services/family.service';
import UserServices from '@/services/users.service';
import axios from 'axios';
import { find, get, isEmpty, map } from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { DataOptions } from 'vuetify';
const MainModule = namespace('MainModule');

@Component
export default class ViewFamilyPage extends Vue {
  loading = false;
  headers = [
    { text: 'Nama', value: 'name' },
    { text: 'Keluarga dari', value: 'user.name', sortable: false },
    { text: 'Hubungan', value: 'relationship' },
    { text: 'Jenis kelamin', value: 'sex' },
    { text: 'Actions', value: 'actions', sortable: false },
  ];
  items: FamilyInterface[] = [];
  page = 1;
  total = 0;
  params: FamilyParams = {};
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
  keyword = '';

  showPrompt = false;
  loadingDelete = false;
  prompt: FamilyInterface | null = null;
  service = new FamilyServices();
  userService = new UserServices();
  relationship = [
    { state: 'Ayah', value: 1 },
    { state: 'Ibu', value: 2 },
    { state: 'Istri', value: 3 },
    { state: 'Suami', value: 4 },
    { state: 'Saudara ke 1', value: 5 },
    { state: 'Saudara ke 2', value: 6 },
    { state: 'Saudara ke 3', value: 7 },
    { state: 'Saudara ke 4', value: 8 },
    { state: 'Saudara ke 5', value: 9 },
    { state: 'Saudara ke 6', value: 10 },
    { state: 'Anak ke 1', value: 11 },
    { state: 'Anak ke 2', value: 12 },
    { state: 'Anak ke 3', value: 13 },
    { state: 'Anak ke 4', value: 14 },
    { state: 'Anak ke 5', value: 15 },
    { state: 'Anak ke 6', value: 16 },
  ];

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Keluarga');
    this.params.take = 15;
    this.getFamily();
  }

  async getFamily(): Promise<void> {
    this.loading = true;
    try {
      const { data } = await this.service.get(this.params);
      const { data: family } = data;
      this.total = data.total;
      const mapUser = family.map((e) => this.userService.findUser(e.userId));
      const getUsers = await Promise.all(mapUser).then((res) =>
        map(res, 'data.data')
      );
      this.items = family.map((e) => {
        const findUser = getUsers.find((x) => x.id == e.userId);
        return {
          ...e,
          user: findUser,
        };
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.$toast.error(error.message);
      }
    }
    this.loading = false;
  }

  async deleteFamily(id: string): Promise<void> {
    this.loadingDelete = true;
    try {
      const {
        data: { data },
      } = await this.service.delete(id);
      this.showPrompt = false;
      this.$toast.success(`Berhasil menghapus ${data.name}`);
      this.getFamily();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.$toast.error(error.message);
      }
    }
    this.loadingDelete = false;
  }

  showDeletePrompt(data: FamilyInterface): void {
    this.prompt = data;
    this.showPrompt = true;
  }

  getRelationship(data: number): string {
    const getValue = find(this.relationship, (e) => e.value === data);
    return getValue?.state ?? '';
  }

  getLodash(val: unknown, type: string, defaultValue: string): unknown {
    return get(val, type, defaultValue);
  }

  pagination(val: number): void {
    this.params.skip = (val - 1) * (this.params.take ?? 10);
    this.getFamily();
    this.page = val;
  }

  changeOptions(): void {
    if (!isEmpty(this.options.sortBy)) {
      const desc = this.options.sortDesc[0] ? 'asc' : 'desc';
      this.params.sortBy = [`${this.options.sortBy[0]} ${desc}`];
    } else {
      this.params.sortBy = [];
    }
    this.getFamily();
  }

  updatePerPage(val: number): void {
    this.params.take = val;
    this.getFamily();
  }

  search(): void {
    this.params.username = this.keyword;
    this.params.skip = 0;
    this.getFamily();
  }

  reset(): void {
    this.params = {
      take: 10,
    };
    this.keyword = '';
    this.getFamily();
  }
}
</script>

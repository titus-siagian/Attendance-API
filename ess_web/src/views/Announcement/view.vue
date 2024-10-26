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
            placeholder="Cari nama"
            v-model="keyword"
          ></v-text-field>
          <v-btn @click="search()">Cari</v-btn>
          <v-btn color="red" class="white--text" @click="reset()">Reset</v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="$router.push({ name: 'CreateAnnouncement' })"
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
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ convertLocaleDate(item.createdAt) }}
        </template>
        <template v-slot:[`item.expiredAt`]="{ item }">
          {{ convertLocaleDate(item.expiredAt) }}
        </template>
        <template v-slot:[`item.published`]="{ item }">
          {{ item.published ? 'Diterbitkan' : 'Disimpan' }}</template
        >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon :to="`/announcement/update/${item.id}`">
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
          >Apakah anda yakin menghapus
          <b>{{ getLodash(prompt, 'title', '') }}</b
          >?</v-card-text
        >
        <v-card-actions>
          <v-spacer> </v-spacer>
          <v-btn text @click="showPrompt = false">Tidak</v-btn>
          <v-btn
            :loading="loadingDelete"
            color="red"
            text
            @click="deleteAnnouncement(prompt.id)"
            >Iya</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import AnnouncementParams from '@/interface/params/announcement-params.interface';
import AnnouncementInterface from '@/interface/announcement.interface';
import AnnouncementService from '@/services/announcement.service';
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { get, isEmpty } from 'lodash';
import axios from 'axios';
import { DataOptions } from 'vuetify';
import moment from 'moment';
const MainModule = namespace('MainModule');

@Component
export default class ViewAnnouncementPage extends Vue {
  loading = false;
  headers = [
    { text: 'Tanggal', value: 'createdAt' },
    { text: 'Judul', value: 'title' },
    { text: 'Kadaluarsa', value: 'expiredAt' },
    { text: 'Status', value: 'published' },
    { text: 'Actions', value: 'actions', sortable: false },
  ];
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
  params: AnnouncementParams = {};
  keyword = '';
  total = 0;

  items: AnnouncementInterface[] = [];
  showPrompt = false;
  loadingDelete = false;
  prompt: AnnouncementInterface | null = null;
  service = new AnnouncementService();

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Pengumuman');
    this.params.take = 10;
    this.getAnnouncement();
  }

  async getAnnouncement(): Promise<void> {
    this.loading = true;
    try {
      const { data } = await this.service.get(this.params);
      this.total = data.total;
      this.items = data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.$toast.error(error.message);
      }
    }
    this.loading = false;
  }

  async deleteAnnouncement(id: number): Promise<void> {
    this.loadingDelete = true;
    try {
      const {
        data: { data },
      } = await this.service.delete(id);
      this.showPrompt = false;
      this.$toast.success(`Berhasil menghapus ${data.title}`);
      this.getAnnouncement();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.$toast.error(error.message);
      }
    }
    this.loadingDelete = false;
  }

  convertLocaleDate(data: string): string {
    if (!isEmpty(data)) {
      return moment(data).format('DD/MM/YYYY');
    }
    return '-';
  }

  showDeletePrompt(data: AnnouncementInterface): void {
    this.prompt = data;
    this.showPrompt = true;
  }

  getLodash(val: unknown, type: string, defaultValue: string): unknown {
    return get(val, type, defaultValue);
  }

  pagination(val: number): void {
    this.params.skip = (val - 1) * (this.params.take ?? 10);
    this.getAnnouncement();
  }

  changeOptions(): void {
    if (!isEmpty(this.options.sortBy)) {
      const desc = this.options.sortDesc[0] ? 'asc' : 'desc';
      this.params.sortBy = [`${this.options.sortBy[0]} ${desc}`];
    } else {
      this.params.sortBy = [];
    }
    this.getAnnouncement();
  }

  updatePerPage(val: number): void {
    this.params.take = val;
    this.getAnnouncement();
  }

  search(): void {
    this.params.title = this.keyword;
    this.getAnnouncement();
  }

  reset(): void {
    this.params = {
      take: 10,
    };
    this.keyword = '';
    this.getAnnouncement();
  }
}
</script>

<template>
  <v-container fluid>
    <v-card class="mb-8">
      <v-card-title>Download Report</v-card-title>
      <v-card-text>
        <div class="flex items-start space-x-4">
          <div class="w-1/4">
            <v-text-field
              filled
              dense
              clearable
              label="Search (opsional)"
              placeholder="Cari Nama Karyawan"
              v-model="keywordReport"
            ></v-text-field>
          </div>
          <div class="w-1/6">
            <v-select
              label="Filter"
              placeholder="filter"
              v-model="filterReport"
              :items="keywordFilters"
              dense
              filled
            ></v-select>
          </div>
          <div class="w-1/6">
            <v-select
              label="Gunakan gambar"
              placeholder="gunakan gambar"
              v-model="reportImage"
              :items="[
                { state: 'Iya', value: true },
                { state: 'Tidak', value: false },
              ]"
              item-text="state"
              item-value="value"
              dense
              filled
            ></v-select>
          </div>
          <div class="w-1/4">
            <v-dialog
              ref="dialog"
              v-model="dateModal"
              :return-value.sync="dateRange"
              persistent
              width="320px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  filled
                  dense
                  v-model="dateJoin"
                  label="Pilih tanggal report"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="dateRange" scrollable range>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="dateModal = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  :loading="loadingDownload"
                  @click="$refs.dialog.save(dateRange)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </div>

          <v-btn @click="downloadReport" color="primary" :disabled="!dateJoin"
            >Download</v-btn
          >
        </div>
      </v-card-text>
    </v-card>
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
            placeholder="Cari Nama Karyawan"
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
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="10"
        :server-items-length="total"
        :loading="loading"
        class="elevation-1"
        :options.sync="options"
        @update:page="pagination"
        @update:sort-desc="changeOptions"
        @update:items-per-page="updatePerPage"
        :footer-props="{
          itemsPerPageOptions: [10, 20, 50],
        }"
      >
        <template v-slot:[`item.user`]="{ item }">
          <div class="flex items-center space-x-2">
            <img
              :src="imgUrl + '/' + item.user.avatarUrl"
              :alt="item.user.name"
              class="rounded-full w-8 h-8"
            />
            <div>{{ item.user.name }}</div>
          </div>
        </template>
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ convertLocaleDate(item.createdAt) }}
        </template>
        <template v-slot:[`item.type`]="{ item }">
          {{ item.problem ? 'Request' : item.type }}
        </template>
        <template v-slot:[`item.value`]="{ item }">
          {{ item.value === 'ClockIn' ? 'In' : 'Out' }}
        </template>
        <template v-slot:[`item.problem`]="{ item }">
          {{ item.problem ? convertProblem(item.problem) : item.description }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon :to="`/attendance/detail/${item.id}`">
            <v-icon small class="mr-2"> mdi-eye </v-icon>
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
            @click="deleteAttendance(prompt.id)"
            >Iya</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import AttendanceParams from '@/interface/params/attendance-params.interface';
import AttendanceInterface from '@/interface/attendance.interface';
import AttendanceServices from '@/services/attendance.service';
import UserServices from '@/services/users.service';
import Helper from '@/utils/helper';
import axios from 'axios';
import { get, isEmpty, map } from 'lodash';
import moment from 'moment';
import Vue from 'vue';
import Component from 'vue-class-component';
import { DataOptions } from 'vuetify';
import { namespace } from 'vuex-class';
import http from '@/services';
import MasterLocationServices from '@/services/masterLocation.service';
const MainModule = namespace('MainModule');

@Component
export default class ViewAttendancePage extends Vue {
  loading = false;
  headers = [
    { text: 'Karyawan', value: 'user', sortable: false },
    { text: 'ID', value: 'user.id', sortable: false },
    { text: 'Waktu', value: 'createdAt' },
    { text: 'Tipe', value: 'type' },
    { text: 'Tipe Clock', value: 'value' },
    { text: 'Keterangan', value: 'problem' },
    { text: 'Lokasi', value: 'location.name' },
    { text: 'Actions', value: 'actions', sortable: false },
  ];
  items: AttendanceInterface[] = [];
  total = 0;
  page = 1;
  keyword = '';
  keywordReport = '';
  reportImage = false;
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
  params: AttendanceParams = {};
  showPrompt = false;
  loadingDelete = false;
  loadingDownload = false;
  prompt: AttendanceInterface | null = null;
  service = new AttendanceServices();
  userService = new UserServices();
  locationService = new MasterLocationServices();
  dateModal = false;
  dateRange: string[] = [];
  imgUrl = http.defaults.baseURL;
  filter = 'name';
  filterReport = 'name';
  keywordFilters = ['name', 'id', 'nik'];

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  get dateJoin(): string {
    let formatDate1 = '';
    if (!isEmpty(this.dateRange?.[0])) {
      formatDate1 = moment(this.dateRange?.[0]).format('DD-MM-YYYY');
    }

    let formatDate2 = '';
    if (!isEmpty(this.dateRange?.[1])) {
      formatDate2 = moment(this.dateRange?.[1]).format('DD-MM-YYYY');
      return `${formatDate1} - ${formatDate2}`;
    }

    if (isEmpty(formatDate1) && isEmpty(formatDate2)) {
      return '';
    }

    return `${formatDate1}`;
  }

  mounted(): void {
    this.updateTitle('Daftar Kehadiran');
    this.params.take = 10;
    this.getAttendance();
  }

  async getAttendance(): Promise<void> {
    this.loading = true;
    try {
      const { data } = await this.service.get(this.params);
      const { data: attendance } = data;
      this.total = data.total;

      const mapUsers = attendance.map((e) =>
        this.userService.findUser(e.userId)
      );
      const getUsers = await Promise.all(mapUsers).then((res) =>
        map(res, 'data.data')
      );

      const mapLocation = attendance.map((e) =>
        this.locationService.find(e.masterLocationId ?? '')
      );

      const getLocations = await Promise.all(mapLocation).then((res) =>
        map(res, 'data.data')
      );

      this.items = attendance.map((e) => {
        const user = getUsers.find((x) => x.id === e.userId);
        const location = getLocations.find((x) => x.id === e.masterLocationId);
        return {
          ...e,
          user,
          location,
        };
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.$toast.error(error.message);
      }
    }
    this.loading = false;
  }

  getLodash(val: unknown, type: string, defaultValue: string): unknown {
    return get(val, type, defaultValue);
  }

  convertLocaleDate(data: string): string {
    return moment(data).format('DD/MM/YYYY HH:mm');
  }

  convertProblem(data: string): string {
    if (!isEmpty(data)) {
      return Helper.convertProblem(data);
    }
    return '';
  }

  pagination(val: number): void {
    this.params.skip = (val - 1) * (this.params.take ?? 10);
    this.getAttendance();
    this.page = val;
  }

  changeOptions(): void {
    if (!isEmpty(this.options.sortBy)) {
      const desc = this.options.sortDesc[0] ? 'asc' : 'desc';
      this.params.sortBy = [`${this.options.sortBy[0]} ${desc}`];
    } else {
      this.params.sortBy = [];
    }
    this.getAttendance();
  }

  updatePerPage(val: number): void {
    this.params.take = val;
    this.getAttendance();
  }

  search(): void {
    if (this.filter === 'nik') {
      this.params.identityNumber = this.keyword;
    } else if (this.filter === 'id') {
      this.params.userId = this.keyword;
    } else {
      this.params.username = this.keyword;
    }
    this.params.skip = 0;
    this.getAttendance();
  }

  reset(): void {
    this.params = {
      take: 10,
    };
    this.keyword = '';
    this.getAttendance();
  }

  async downloadReport(): Promise<void> {
    this.loadingDownload = true;
    const query: AttendanceParams = {
      startDate: this.dateRange[0] ?? '',
      endDate: this.dateRange[1] ?? '',
    };

    if (this.filterReport === 'nik') {
      query.identityNumber = this.keywordReport;
    } else if (this.filterReport === 'id') {
      query.userId = this.keywordReport;
    } else {
      query.username = this.keywordReport;
    }

    query.image = this.reportImage;

    const {
      data: { data },
    } = await this.service.report(query);

    const bytes = new Uint8Array(data.data);

    const blob = new Blob([bytes], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `report_${moment(Date.now()).format(
      'DD-MM-YYYY-HH-mm'
    )}.xlsx`;
    link.click();
    this.loadingDownload = false;
  }
}
</script>

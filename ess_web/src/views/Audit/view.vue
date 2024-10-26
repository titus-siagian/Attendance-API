<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onCreate">
      <v-card>
        <v-data-table
          :headers="headers"
          :items="items"
          :items-per-page="10"
          :server-items-length="total"
          :loading="isLoading"
          :options.sync="options"
          @update:page="pagination"
          @update:options="changeOptions"
          @update:items-per-page="updatePerPage"
          class="elevation-1"
          :footer-props="{ itemsPerPageOptions: [10, 20, 50] }"
        >
          <template v-slot:[`item.createdAt`]="{ item }">
            {{ convertLocaleDate(item.createdAt) }}
          </template></v-data-table
        >
      </v-card>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import AuditInterface from '@/interface/audit.interface';
import AuditParams from '@/interface/params/audit-params.interface';
import UserServices from '@/services/users.service';
import { VForm } from '@/utils/types';
import { isEmpty } from 'lodash';
import moment from 'moment';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { DataOptions } from 'vuetify';
import { namespace } from 'vuex-class';
const MainModule = namespace('MainModule');

@Component
export default class CreateCompanyPage extends Vue {
  @Ref('form') readonly form!: VForm;

  userService = new UserServices();

  isLoading = false;

  headers = [
    { text: 'Tanggal', value: 'createdAt' },
    { text: 'Keterangan', value: 'description' },
    { text: 'Data Lama', value: 'oldValue' },
    { text: 'Data Baru', value: 'newValue' },
  ];
  total = 0;
  page = 1;
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
  items: AuditInterface[] = [];
  params: AuditParams = {};

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Audit Log');

    this.params.take = 10;
    this.getAuditLogs();
  }

  async getAuditLogs(): Promise<void> {
    this.isLoading = true;
    try {
      const { data } = await this.userService.getAuditLog(this.params);
      this.total = data.total;
      this.items = data.data;
    } catch (error) {
      console.log('error', error);
    }
    this.isLoading = false;
  }

  convertLocaleDate(data: string): string {
    return moment(data).format('DD/MM/YYYY HH:mm');
  }

  pagination(val: number): void {
    this.params.skip = (val - 1) * (this.params.take ?? 10);
    this.getAuditLogs();
    this.page = val;
  }

  changeOptions(): void {
    if (!isEmpty(this.options.sortBy)) {
      const desc = this.options.sortDesc[0] ? 'asc' : 'desc';
      this.params.sortBy = [`${this.options.sortBy[0]} ${desc}`];
    } else {
      this.params.sortBy = [];
    }
    this.getAuditLogs();
  }

  updatePerPage(val: number): void {
    this.params.take = val;
    this.getAuditLogs();
  }
}
</script>

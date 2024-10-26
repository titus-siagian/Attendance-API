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
            placeholder="Nama Sub Divisi"
            v-model="keyword"
          ></v-text-field>
          <v-btn @click="search()">Cari</v-btn>
          <v-btn color="red" class="white--text" @click="reset()">Reset</v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="$router.push({ name: 'CreateSubdivision' })"
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
          <v-btn icon :to="`/subdivision/update/${item.id}`">
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
            @click="deleteSubdivision(prompt.id)"
            >Iya</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import SubdivisionInterface from '@/interface/subdivision.interface';
import UserService from '@/services/users.service';
import axios from 'axios';
import { get, isEmpty, map } from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
const MainModule = namespace('MainModule');

@Component
export default class ViewSubdivisionPage extends Vue {
  loading = false;
  headers = [
    { text: 'Perusahaan', value: 'company.name' },
    { text: 'Divisi', value: 'division.name' },
    { text: 'Nama', value: 'name' },
    { text: 'Actions', value: 'actions', sortable: false },
  ];
  items: SubdivisionInterface[] = [];
  tempItems: SubdivisionInterface[] = [];
  keyword = '';
  showPrompt = false;
  loadingDelete = false;
  prompt: SubdivisionInterface | null = null;
  userService = new UserService();

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Sub Divisi');
    this.getSubdivision();
  }

  async getSubdivision(): Promise<void> {
    this.loading = true;
    try {
      const {
        data: { data },
      } = await this.userService.getSubdivision();
      const mapDivisionInfo = data.map((e) =>
        this.userService.findDivision(e.divisionId ?? '')
      );
      const getDivision = await Promise.all(mapDivisionInfo).then((resp) => {
        return map(resp, 'data.data');
      });
      const mergeDivision = data.map((e) => {
        const division = getDivision.find((x) => x.id === e.divisionId);
        return {
          ...e,
          division,
        };
      });

      const mapCompanyInfo = mergeDivision.map((e) =>
        this.userService.findCompany(e.division?.companyId ?? '')
      );

      const getCompanies = await Promise.all(mapCompanyInfo).then((resp) => {
        return map(resp, 'data.data');
      });

      this.items = mergeDivision.map((e) => {
        const company = getCompanies.find(
          (x) => x.id === e.division?.companyId
        );
        return {
          ...e,
          company,
        };
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.$toast.error(error.message);
      }
    }
    this.loading = false;
  }

  async deleteSubdivision(id: string): Promise<void> {
    this.loadingDelete = true;
    try {
      const {
        data: { data },
      } = await this.userService.deleteSubdivision(id);
      this.showPrompt = false;
      this.$toast.success(`Berhasil menghapus ${data.name}`);
      this.getSubdivision();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.$toast.error(error.message);
      }
    }
    this.loadingDelete = false;
  }

  showDeletePrompt(data: SubdivisionInterface): void {
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

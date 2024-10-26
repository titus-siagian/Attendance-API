<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="$router.push({ name: 'CreateSchedule' })"
          >Create</v-btn
        >
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="5"
        :server-items-length="-1"
        :loading="loading"
        :options.sync="options"
        class="elevation-1"
      >
        <template v-slot:[`item.startTime`]="{ item }">
          {{ convertTime(item.startTime) }}
        </template>
        <template v-slot:[`item.endTime`]="{ item }">
          {{ convertTime(item.endTime) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon :to="`/schedule/update/${item.id}`">
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
        <v-card-text>Apakah anda yakin menghapusnya?</v-card-text>
        <v-card-actions>
          <v-spacer> </v-spacer>
          <v-btn text @click="showPrompt = false">Tidak</v-btn>
          <v-btn
            :loading="loadingDelete"
            color="red"
            text
            @click="deleteSchedule(prompt.id)"
            >Iya</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import ScheduleInterface from '@/interface/schedule.interface';
import ScheduleService from '@/services/schedule.service';
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
import { get } from 'lodash';
import axios from 'axios';
const MainModule = namespace('MainModule');

@Component
export default class ViewSchedulePage extends Vue {
  loading = false;
  headers = [
    { text: 'ID', value: 'id' },
    { text: 'Mulai', value: 'startTime' },
    { text: 'Selesai', value: 'endTime' },
    { text: 'Actions', value: 'actions', sortable: false },
  ];
  items: ScheduleInterface[] = [];
  options = {};
  showPrompt = false;
  loadingDelete = false;
  prompt: ScheduleInterface | null = null;
  ScheduleService = new ScheduleService();

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Jam Kerja');
    this.getSchedules();
  }

  async getSchedules(): Promise<void> {
    this.loading = true;
    try {
      const { data: { data } } = await this.ScheduleService.get();
      this.items = data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.$toast.error(error.message);
      }
    }
    this.loading = false;
  }

  async deleteSchedule(id: number): Promise<void> {
    this.loadingDelete = true;
    try {
      await this.ScheduleService.delete(id);
      this.showPrompt = false;
      this.$toast.success(`Berhasil menghapus jam kerja`);
      this.getSchedules();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.$toast.error(error.message);
      }
    }
    this.loadingDelete = false;
  }

  showDeletePrompt(data: ScheduleInterface): void {
    this.prompt = data;
    this.showPrompt = true;
  }

  getLodash(val: unknown, type: string, defaultValue: string): unknown {
    return get(val, type, defaultValue);
  }

  convertTime(time: number): string {
    const hours = ('0' + Math.floor(time / 60)).slice(-2);
    const minute = ('0' + (time % 60)).slice(-2);
    return `${hours}:${minute}`;
  }
}
</script>

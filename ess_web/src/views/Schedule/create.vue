<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onCreate">
      <v-card>
        <v-card-title>Tambah Jam Kerja</v-card-title>
        <v-card-text>
          <v-row justify="space-around" align="center">
            <v-col style="width: 350px; flex: 0 1 auto">
              <h2>Mulai:</h2>
              <v-time-picker
                format="24hr"
                full-width
                v-model="data.startTime"
                :max="data.endTime"
              ></v-time-picker>
            </v-col>
            <v-col style="width: 350px; flex: 0 1 auto">
              <h2>Selesai:</h2>
              <v-time-picker
                format="24hr"
                full-width
                v-model="data.endTime"
                :min="data.startTime"
              ></v-time-picker>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit" :loading="isLoading"
            >Tambah</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import ScheduleInterface from '@/interface/schedule.interface';
import ScheduleServices from '@/services/schedule.service';
import { VForm } from '@/utils/types';
import axios from 'axios';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const MainModule = namespace('MainModule');

@Component
export default class CreateSchedulePage extends Vue {
  @Ref('form') readonly form!: VForm;

  service = new ScheduleServices();

  isLoading = false;

  data: ScheduleInterface = {
    id: null,
    startTime: null,
    endTime: null,
    text: null,
  };

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Tambah Jam Kerja');
  }

  async onCreate(): Promise<void> {
    if (this.form.validate()) {
      this.isLoading = true;
      try {
        const splitStartTime = this.data.startTime?.toString().split(':') ?? [];
        const startTime =
          parseInt(splitStartTime[0]) * 60 + parseInt(splitStartTime[1]);

        const splitEndTime = this.data.endTime?.toString().split(':') ?? [];
        const endTime =
          parseInt(splitEndTime[0]) * 60 + parseInt(splitEndTime[1]);

        const request = {
          id: null,
          startTime,
          endTime,
          text: null,
        };
        await this.service.create(request);
        this.$toast.success(`Berhasil menambahkan Jam Kerja`);
        this.$router.push({ name: 'Schedule' });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.$toast.error(error.message);
        }
      }
      this.isLoading = false;
    }
  }
}
</script>

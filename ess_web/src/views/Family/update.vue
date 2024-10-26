<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onCreate">
      <v-card>
        <v-card-title>Update Keluarga</v-card-title>
        <v-card-text class="space-y-4">
          <div class="flex space-x-4">
            <v-select
              v-model="data.userId"
              :items="users"
              item-text="name"
              item-value="id"
              label="Keluarga dari"
              filled
              persistent-hint
              single-line
            ></v-select>
            <v-select
              v-model="data.relationship"
              :items="relationship"
              item-text="state"
              item-value="value"
              label="Hubungan"
              filled
              persistent-hint
              single-line
            ></v-select>
          </div>
          <v-text-field
            filled
            label="No. KTP"
            counter="16"
            maxLength="16"
            :rules="[(v) => !!v || 'Mohon masukkan no ktp']"
            v-model="data.identityNumber"
          ></v-text-field>
          <v-text-field
            filled
            label="Nama"
            :rules="[(v) => !!v || 'Mohon masukkan nama']"
            v-model="data.name"
          ></v-text-field>

          <div class="flex space-x-4">
            <v-text-field
              filled
              label="Tempat lahir"
              placeholder="Jakarta"
              v-model="data.placeOfBirth"
            ></v-text-field>
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="date"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  filled
                  v-model="date"
                  label="Tanggal lahir"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modal = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.dialog.save(date)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </div>
          <v-select
            v-model="data.sex"
            :items="jnsKelamin"
            item-text="state"
            item-value="value"
            label="Jenis Kelamin"
            filled
            persistent-hint
            single-line
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit" :loading="isLoading"
            >Update</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import FamilyInterface from '@/interface/family.interface';
import UserInterface from '@/interface/user.interface';
import FamilyServices from '@/services/family.service';
import UserServices from '@/services/users.service';
import { VForm } from '@/utils/types';
import axios from 'axios';
import { get } from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const MainModule = namespace('MainModule');

@Component
export default class UpdateFamilyPage extends Vue {
  @Ref('form') readonly form!: VForm;

  service = new FamilyServices();
  userService = new UserServices();

  isLoading = false;
  modal = false;
  date: string | null = null;

  data: FamilyInterface = {
    id: null,
    identityNumber: 0,
    name: null,
    sex: null,
    dateOfBirth: null,
    placeOfBirth: null,
    relationship: null,
    userId: '',
    user: undefined,
  };

  jnsKelamin = [
    { state: 'Laki-laki', value: 0 },
    { state: 'Perempuan', value: 1 },
  ];
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
  users: UserInterface[] = [];

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Update Keluarga');
    this.service.find(get(this.$route, 'params.id', '')).then((res) => {
      const {
        data: { data },
      } = res;
      const formatDate = new Date(data.dateOfBirth?.toString() || '');
      this.date = `${formatDate.getUTCFullYear()}-${
        formatDate.getUTCMonth() + 1
      }-${formatDate.getUTCDate()}`;
      this.data = data;
    });
    this.userService.getUsers().then((res) => {
      const {
        data: { data },
      } = res;
      this.users = data;
    });
  }

  async onCreate(): Promise<void> {
    if (this.form.validate()) {
      this.isLoading = true;
      try {
        this.data.dateOfBirth = new Date(this.date ?? '');
        const {
          data: { data: response },
        } = await this.service.patch(this.data);
        this.$toast.success(`Berhasil menambahkan ${response.name}`);
        this.$router.push({ name: 'Family' });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message: string = get(error.response, 'data.message', '');
          this.$toast.error(message);
        }
      }
      this.isLoading = false;
    }
  }
}
</script>

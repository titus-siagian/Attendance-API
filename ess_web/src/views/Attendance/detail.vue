<template>
  <v-container v-if="isMounted">
    <v-form ref="form" @submit.prevent="onUpdate">
      <v-card>
        <v-card-title>Detail</v-card-title>
        <v-card-text class="space-y-4">
          <div class="map-frame h-80">
            <iframe
              width="100%"
              height="100%"
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
              :src="`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&hl=es;z=14&amp;output=embed`"
            ></iframe>
          </div>
          <div class="text-black text-base">Foto</div>
          <div class="flex justify-center w-full">
            <img
              v-if="data.photoUrl"
              :src="`${imgUrl}/${data.photoUrl}`"
              :alt="data.id"
              class="h-60"
            />
            <div v-else class="block w-full py-16 bg-red-600 text-center mb-4">
              <h3 class="text-xl font-bold text-white">No image available</h3>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <v-text-field
              filled
              disabled
              type="number"
              label="Latitude"
              :rules="[(v) => !!v || 'Mohon masukkan latitude']"
              v-model="data.latitude"
            ></v-text-field>
            <v-text-field
              filled
              disabled
              type="number"
              label="longitude"
              :rules="[(v) => !!v || 'Mohon masukkan longitude']"
              v-model="data.longitude"
            ></v-text-field>
          </div>
          <div class="grid grid-cols-2 gap-x-6">
            <v-text-field
              filled
              disabled
              label="Value"
              v-model="data.value"
            ></v-text-field>
            <v-text-field
              filled
              disabled
              label="Status"
              :value="convertProblem(data.problem)"
            ></v-text-field>
          </div>
          <v-text-field
            filled
            disabled
            label="Keterangan"
            v-model="data.description"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import AttendanceInterface from '@/interface/attendance.interface';
import http from '@/services';
import AttendanceServices from '@/services/attendance.service';
import UserServices from '@/services/users.service';
import Helper from '@/utils/helper';
import { VForm } from '@/utils/types';
import { get, isEmpty } from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const MainModule = namespace('MainModule');

@Component
export default class UpdateAttendancePage extends Vue {
  @Ref('form') readonly form!: VForm;

  service = new AttendanceServices();
  userService = new UserServices();

  isMounted = false;
  isLoading = false;
  imgUrl = http.defaults.baseURL;

  data: AttendanceInterface = {
    id: null,
    latitude: 0,
    longitude: 0,
    userId: '',
    photoUrl: '',
    description: null,
    masterLocationId: null,
    type: '',
    value: '',
    createdAt: '',
    user: undefined,
    problem: null,
    location: undefined,
  };

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  mounted(): void {
    this.updateTitle('Detail Kehadiran');
    if (!isEmpty(this.$route.params.id)) {
      this.service
        .find(get(this.$route, 'params.id', 0))
        .then(async (response) => {
          const {
            data: { data },
          } = response;
          try {
            const {
              data: { data: user },
            } = await this.userService.findUser(data.userId);
            this.data.user = user;
            // eslint-disable-next-line no-empty
          } catch (error) {}
          this.data = data;
        })
        .finally(() => {
          this.isMounted = true;
        });
    }
  }

  convertLocaleDate(data: string): string {
    return (
      new Date(data).toLocaleTimeString() + ' ' + new Date(data).toDateString()
    );
  }

  convertProblem(data: string): string {
    if (!isEmpty(data)) {
      return Helper.convertProblem(data);
    }
    return '';
  }

  // updateMarker(value: LatLng): void {
  //   if (!isEmpty(this.marker)) {
  //     this.marker.removeFrom(this.map);
  //   }
  //   this.data.latitude = value.lat;
  //   this.data.longitude = value.lng;
  //   this.marker = new Marker(value, {
  //     icon: new Icon({
  //       iconUrl: require('leaflet/dist/images/marker-icon.png'),
  //       retinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  //       shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  //       iconSize: [24, 36],
  //       iconAnchor: [12, 36],
  //     }),
  //   }).addTo(this.map);
  // }
}
</script>

<style>
.map-frame {
  width: 100%;
  position: relative;
}

.map-content {
  z-index: 10;
  position: absolute;
  top: 50px;
  left: 50px;
  width: 390px;
  background-color: black;
  color: #fff;
}
</style>

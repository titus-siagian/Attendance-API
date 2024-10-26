<template>
  <v-container>
    <v-form ref="form" @submit.prevent="onUpdate">
      <v-card>
        <v-card-title>Update Perusahaan</v-card-title>
        <v-card-text class="space-y-4">
          <div class="text-base text-black font-bold">
            Klik 2x untuk memilih lokasi
          </div>
          <div id="map" style="height: 500px"></div>
          <v-text-field
            filled
            label="Nama Lokasi"
            :rules="[(v) => !!v || 'Mohon masukkan nama lokasi']"
            v-model="data.name"
          ></v-text-field>
          <v-textarea
            filled
            label="Alamat Lokasi"
            :rules="[(v) => !!v || 'Mohon masukkan alamat lokasi']"
            v-model="data.address"
          ></v-textarea>
          <v-text-field
            filled
            type="number"
            label="Latitude"
            :rules="[(v) => !!v || 'Mohon masukkan latitude']"
            v-model="data.latitude"
          ></v-text-field>
          <v-text-field
            filled
            type="number"
            label="Longitude"
            :rules="[(v) => !!v || 'Mohon masukkan longitude']"
            v-model="data.longitude"
          ></v-text-field>
          <v-text-field
            filled
            type="number"
            label="Radius"
            :rules="[(v) => !!v || 'Mohon masukkan radius']"
            v-model="data.radius"
          ></v-text-field>
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
import MasterLocationInterface from '@/interface/masterLocation.interface';
import MasterLocationServices from '@/services/masterLocation.service';
import { VForm } from '@/utils/types';
import axios from 'axios';
import { CircleMarker, Marker, Map, Icon, LatLng, TileLayer } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { assign, get, isEmpty, keys, pick } from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Ref, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const MainModule = namespace('MainModule');

@Component
export default class UpdateMasterLocationPage extends Vue {
  @Ref('form') readonly form!: VForm;

  service = new MasterLocationServices();

  isLoading = false;

  data: MasterLocationInterface = {
    id: null,
    name: '',
    address: null,
    latitude: null,
    longitude: null,
    radius: null,
  };

  searchControl = GeoSearchControl({
    provider: new OpenStreetMapProvider(),
    style: 'bar',
    showMarker: false,
  });

  marker!: Marker<unknown>;
  circleMarker!: CircleMarker<unknown>;

  map!: Map;

  @MainModule.Action
  public updateTitle!: (newTitle: string) => void;

  @Watch('data.radius')
  watchRadius(newValue: number): void {
    if (!isEmpty(this.circleMarker) && newValue > 0) {
      this.circleMarker.setRadius(newValue);
    }
  }

  @Watch('data.latitude')
  watchLatitude(newValue: number): void {
    if (newValue > 0) {
      const latLang = new LatLng(
        this.data.latitude ?? 0,
        this.data.longitude ?? 0
      );
      this.map.setView(latLang);
      this.createMarker(latLang);
    }
  }

  @Watch('data.longitude')
  watchLongitude(newValue: number): void {
    if (newValue > 0) {
      const latLang = new LatLng(
        this.data.latitude ?? 0,
        this.data.longitude ?? 0
      );
      this.map.setView(latLang);
      this.createMarker(latLang);
    }
  }

  mounted(): void {
    this.map = new Map('map', {
      zoom: 13,
      center: [-6.175709342863746, 106.8272486774367],
      doubleClickZoom: false,
    }).addControl(this.searchControl);

    new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.on('dblclick', (e) => {
      const latLang: LatLng = get(e, 'latlng');
      if (!isEmpty(latLang)) {
        this.createMarker(latLang);
      }
    });

    this.updateTitle('Update Lokasi');
    if (!isEmpty(this.$route.params.id)) {
      this.service.find(get(this.$route, 'params.id', 0)).then((response) => {
        const {
          data: { data },
        } = response;
        this.map.setView([data.latitude ?? 0, data.longitude ?? 0]);
        this.map.panTo([data.latitude ?? 0, data.longitude ?? 0]);
        const latLang = new LatLng(data.latitude ?? 0, data.longitude ?? 0);
        this.updateCircleMarker(latLang, data.radius ?? 0);
        this.updateMarker(latLang);

        assign(this.data, pick(data, keys(this.data)));
      });
    }
  }

  updateMarker(value: LatLng): void {
    if (!isEmpty(this.marker)) {
      this.marker.removeFrom(this.map);
    }
    this.data.latitude = value.lat;
    this.data.longitude = value.lng;
    this.marker = new Marker(value, {
      icon: new Icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        retinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        iconSize: [24, 36],
        iconAnchor: [12, 36],
      }),
    }).addTo(this.map);
  }

  updateCircleMarker(value: LatLng, radius: number): void {
    if (!isEmpty(this.circleMarker)) {
      this.circleMarker.removeFrom(this.map);
    }

    this.data.radius = radius;
    this.circleMarker = new CircleMarker(value, {
      radius: this.data.radius,
    }).addTo(this.map);
  }

  createMarker(latLang: LatLng): void {
    if (!isEmpty(this.marker)) {
      this.marker.removeFrom(this.map);
    }
    if (!isEmpty(this.circleMarker)) {
      this.circleMarker.removeFrom(this.map);
    }
    this.data.latitude = latLang.lat;
    this.data.longitude = latLang.lng;
    this.circleMarker = new CircleMarker(latLang, {
      radius: this.data.radius ?? 0,
    }).addTo(this.map);
    this.marker = new Marker(latLang, {
      icon: new Icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        retinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        iconSize: [24, 36],
        iconAnchor: [12, 36],
      }),
    }).addTo(this.map);
  }

  async onUpdate(): Promise<void> {
    if (this.form.validate()) {
      this.isLoading = true;
      try {
        this.data.radius = +(this.data.radius ?? 0);
        const {
          data: { data: response },
        } = await this.service.patch(this.data);
        this.$toast.success(`Berhasil mengubah ${response.name}`);
        this.$router.push({ name: 'MasterLocation' });
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

<template>
  <div>
    <v-app-bar elevation="4" rounded shaped>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-app-bar-title>{{ title }}</v-app-bar-title>

      <v-spacer></v-spacer>
      <div class="flex space-x-8 justify-end">
        <v-switch
          v-model="$vuetify.theme.dark"
          inset
          hide-details
          label="Dark Theme"
          class="!justify-center items-center"
        ></v-switch>
        <v-btn icon @click="$router.push('/setting')">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
        <v-btn icon @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav>
        <v-list-item-group active-class="text--accent-4">
          <v-list-item to="/users">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Karyawan</v-list-item-title>
          </v-list-item>

          <v-list-item to="/family">
            <v-list-item-icon>
              <v-icon>mdi-account-group</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Keluarga</v-list-item-title>
          </v-list-item>

          <v-list-item to="/company">
            <v-list-item-icon>
              <v-icon>mdi-city-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Perusahaan</v-list-item-title>
          </v-list-item>

          <v-list-item to="/division">
            <v-list-item-icon>
              <v-icon>mdi-account-tie</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Divisi</v-list-item-title>
          </v-list-item>

          <v-list-item to="/subdivision">
            <v-list-item-icon>
              <v-icon>mdi-account-supervisor</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Sub Divisi</v-list-item-title>
          </v-list-item>

          <v-list-item to="/department">
            <v-list-item-icon>
              <v-icon>mdi-account-network</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Departemen</v-list-item-title>
          </v-list-item>

          <v-list-item to="/masterlocation">
            <v-list-item-icon>
              <v-icon>mdi-office-building-marker</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Lokasi</v-list-item-title>
          </v-list-item>

          <v-list-item to="/attendance">
            <v-list-item-icon>
              <v-icon>mdi-map-marker-radius</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Kehadiran</v-list-item-title>
          </v-list-item>

          <!-- <v-list-item to="/schedule">
            <v-list-item-icon>
              <v-icon>mdi-clock-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Jam Kerja</v-list-item-title>
          </v-list-item> -->

          <v-list-item to="/announcement">
            <v-list-item-icon>
              <v-icon>mdi-bullhorn</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Pengumuman</v-list-item-title>
          </v-list-item>

          <v-list-item to="/audit">
            <v-list-item-icon>
              <v-icon>mdi-history</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Audit Log</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <slot />
  </div>
</template>

<script lang="ts">
import Helper from '@/utils/helper';
import { isEmpty } from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { namespace } from 'vuex-class';
const MainModule = namespace('MainModule');

@Component
export default class DashboardLayout extends Vue {
  drawer = false;

  @MainModule.State
  public title!: string;

  mounted(): void {
    const getToken = Helper.getWithExpiry('token');
    if (isEmpty(getToken)) {
      this.$router.push({ name: 'Login' });
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.$router.push({ name: 'Login' });
  }
}
</script>

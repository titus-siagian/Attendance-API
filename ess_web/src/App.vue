<template>
  <v-app>
    <v-main>
      <app-layout>
        <router-view />
      </app-layout>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import AppLayout from './layouts/AppLayout.vue';

@Component({
  components: {
    AppLayout,
  },
})
export default class App extends Vue {}
</script>

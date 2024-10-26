<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { get } from 'lodash';

@Component
export default class AppLayout extends Vue {
  get layout() {
    const layout = get(this.$route, 'meta.layout', 'AppLayoutDefault');
    return () => import(`@/layouts/${layout}.vue`);
  }
}
</script>

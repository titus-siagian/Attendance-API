import Vue from 'vue';
import Vuex from 'vuex';
import MainModule from './modules/main.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { MainModule },
});

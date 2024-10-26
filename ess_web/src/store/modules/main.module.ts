import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ namespaced: true })
export default class MainModule extends VuexModule {
  public title = '';

  @Mutation
  public setTitle(newTitle: string): void {
    this.title = newTitle;
  }

  @Action
  public updateTitle(newTitle: string): void {
    window.document.title = newTitle;
    this.context.commit('setTitle', newTitle);
  }
}

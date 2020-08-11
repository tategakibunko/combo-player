import { PluginStore, Plugin } from './types';

export class CsPluginStore implements PluginStore {
  constructor(
    private pluginTable: { [name: string]: Plugin } = {}
  ) { }

  add(name: string, entry: Plugin) {
    this.pluginTable[name.toLocaleLowerCase()] = entry;
  }

  get(name: string): Plugin | undefined {
    return this.pluginTable[name.toLocaleLowerCase()];
  }
}

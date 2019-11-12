import store from './store';

export interface SettingsInterface {
  version: number;
  isTestNet: boolean;
}

export const SETTINGS_KEY = 'settings_key';

const defaultSettings = {
  version: 0,
  isTestNet: false
};

class Settings {
  settings: SettingsInterface | null;

  constructor() {
    this.settings = null;
  }

  async initSettings() {
    await this.loadSettings();

    if (!this.settings) {
      console.log('init settings');
      this.saveSettings(defaultSettings);
    }
  }

  async saveSettings(settings: SettingsInterface) {
    await store.set(SETTINGS_KEY, settings, (): void => {
      this.settings = settings;
    });
  }

  async loadSettings() {
    await store.get(SETTINGS_KEY, settings => {
      this.settings = settings;
    });
  }
}

const settings = new Settings();

export default settings;

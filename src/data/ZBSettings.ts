/** settings are persisted in local storage but independent from client data */

export interface ZBSettingsFlags {
  // put boolean settings here
  showGrid: boolean;
}

export interface ZBSettings extends ZBSettingsFlags {
  // put non-boolean settings here
  language: string; // "de" or "en"
  colorMode: string;
}

export function initSettingsAsJSON(): string {
  return JSON.stringify({
    showGrid: true,
    language: "de", // TODO set from browser prefs
    colorMode: "green-mode",
  });
}

export function loadSettings(state: ZBSettings, loadedText: string): void {
  const loaded = JSON.parse(loadedText);
  // TODO: untested loading of settings
  state = { ...state, ...loaded };
}

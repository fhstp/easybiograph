/** settings are persisted in local storage but independent from client data */

export interface ZBSettingsFlags {
  // put boolean settings here
  showOnboarding: boolean;
}

export interface ZBSettings extends ZBSettingsFlags {
  // put non-boolean settings here
}

export function initSettingsAsJSON(): string {
  return JSON.stringify({
    showOnboarding: true,
  });
}

export function loadSettings(state: ZBSettings, loadedText: string): void {
  const loaded = JSON.parse(loadedText);
  // TODO: untested loading of settings
  state = { ...state, ...loaded };
}

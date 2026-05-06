export const LOCAL_PREFERENCES_KEY = "app-ui-preferences";

export const defaultUiPreferences = {
  compactMode: false,
  smoothAnimations: true,
  notificationsEnabled: true,
};

const canUseLocalStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const readUiPreferences = () => {
  if (!canUseLocalStorage()) {
    return { ...defaultUiPreferences };
  }

  const stored = window.localStorage.getItem(LOCAL_PREFERENCES_KEY);

  if (!stored) {
    return { ...defaultUiPreferences };
  }

  try {
    const parsed = JSON.parse(stored);
    return {
      ...defaultUiPreferences,
      ...parsed,
    };
  } catch {
    window.localStorage.removeItem(LOCAL_PREFERENCES_KEY);
    return { ...defaultUiPreferences };
  }
};

export const applyUiPreferences = (preferences = readUiPreferences()) => {
  if (typeof document === "undefined") {
    return {
      compactMode: Boolean(preferences.compactMode),
      smoothAnimations: preferences.smoothAnimations !== false,
      notificationsEnabled: preferences.notificationsEnabled !== false,
    };
  }

  const compactModeEnabled = Boolean(preferences.compactMode);
  const smoothAnimationsEnabled = preferences.smoothAnimations !== false;
  const notificationsEnabled = preferences.notificationsEnabled !== false;

  document.documentElement.classList.toggle("ui-compact-mode", compactModeEnabled);
  document.documentElement.classList.toggle("ui-comfortable-mode", !compactModeEnabled);
  document.documentElement.classList.toggle("ui-reduced-motion", !smoothAnimationsEnabled);
  document.documentElement.classList.toggle("ui-notifications-disabled", !notificationsEnabled);

  return {
    compactMode: compactModeEnabled,
    smoothAnimations: smoothAnimationsEnabled,
    notificationsEnabled,
  };
};

export const saveUiPreferences = (preferences) => {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(LOCAL_PREFERENCES_KEY, JSON.stringify(preferences));
};

import { PersistedState } from "runed";
import { MediaQuery } from "svelte/reactivity";

import { box } from '../utils/box.svelte';
import { isBrowser, noopStorage } from '../utils/helpers';

export type ThemeMode = 'light' | 'dark' | 'system';

const MODE_STORAGE_KEY = 'sg-theme-mode-storage-key'
const THEME_STORAGE_KEY = 'sg-theme-storage-key'

/**
 * The global theme state collection for reading and setting
 * global theme and themes modes. Initialization should be called
 * early in the components render tree.
 */
class ThemeState {

	public MODES: ThemeMode[] = ['light', 'dark', 'system']

	/**
	 * Returns user set theme mode, by default returns "system" value.
	 * The mode value will be synced with local storage and other browser's
	 * active tabs.
	 */
	public userPrefersMode = this.createUserPrefersMode()

	/**
	 * Returns readonly "system" converted mode (light or dark system preference).
	 */
	public systemPrefersMode = this.createSystemMode()

	/**
	 * Returns current theme value, by default returns our standard system
	 * theme "sg-standard".
	 */
	public currentTheme = this.createCustomTheme()

	/**
	 * Returns readonly converted theme mode value (either dark or light),
	 * takes into account userPrefersMode and converted value of systemPrefersMode.
	 */
	public currentMode = $derived(this.userPrefersMode.current === "system"
		? this.systemPrefersMode.current
		: this.userPrefersMode.current)

	public initialize() {
		$effect.root(() => {

			// Applying theme mode and theme values to the root element
			$effect.pre(() => {
				const root = document.documentElement;

				root.dataset.sgThemeMode = this.currentMode
				root.dataset.sgTheme = this.currentTheme.current
			})
		})
	}

	private createUserPrefersMode() {
		const defaultValue: ThemeMode = "system";
		const storage = isBrowser() ? localStorage : noopStorage;
		const initialValue = storage.getItem(MODE_STORAGE_KEY);
		const value = isValidMode(initialValue) ? initialValue : defaultValue;

		return new PersistedState<ThemeMode>(MODE_STORAGE_KEY, value, {
			serializer: {
				serialize: (v) => v,
				deserialize: (v) => {
					if (isValidMode(v)) return v;
					return defaultValue;
				},
			},
		})
	}

	private createSystemMode() {
		let systemMode = box<'dark' | 'light'>('light')
		const mediaQueryState = new MediaQuery("prefers-color-scheme: light")

		// Double effect with root here to make sure that this state can
		// work outside Svelte components tree
		$effect.root(() => {
			$effect.pre(() => {
				systemMode.current = mediaQueryState.current ? "light" : "dark"
			})
		})

		return systemMode
	}

	private createCustomTheme() {
		const storage = isBrowser() ? localStorage : noopStorage;
		const value = storage.getItem(THEME_STORAGE_KEY) ?? 'standard';

		return new PersistedState<string>(THEME_STORAGE_KEY, value, {
			serializer: {
				serialize: (v) => {
					if (typeof v !== "string") return "";
					return v;
				},
				deserialize: (v) => v,
			},
		});
	}

}

function isValidMode(value: unknown): value is ThemeMode {
	if (typeof value !== "string") return false;
	return ['light', 'dark', 'system'].includes(value as ThemeMode);
}

export const THEME_STATE = new ThemeState();

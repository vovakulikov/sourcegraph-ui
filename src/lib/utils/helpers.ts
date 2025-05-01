
export const noopStorage = {
	getItem: (_key: string) => null,
	setItem: (_key: string, _value: string) => {},
};

export const isBrowser = () => typeof document !== "undefined";

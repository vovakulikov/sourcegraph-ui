
const BoxSymbol = Symbol("box");
const isWritableSymbol = Symbol("is-writable");

export type ReadableBox<T> = {
	readonly [BoxSymbol]: true;
	readonly current: T;
};

export type WritableBox<T> = {
	readonly [isWritableSymbol]: true;
	current: T;
};

export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
	return typeof value === "function";
}

export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
	return value !== null && typeof value === "object";
}

/**
 * @returns Whether the value is a Box
 *
 * @see {@link https://runed.dev/docs/functions/box}
 */
function isBox(value: unknown): value is ReadableBox<unknown> {
	return isObject(value) && BoxSymbol in value;
}

export function box<T>(): WritableBox<T | undefined>;
export function box<T>(initialValue: T): WritableBox<T>;
export function box(initialValue?: unknown) {
	let current = $state(initialValue);

	return {
		[isWritableSymbol]: true,
		get current() {
			return current as unknown;
		},
		set current(v: unknown) {
			current = v;
		}
	};
}

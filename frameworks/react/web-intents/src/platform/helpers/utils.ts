/**
 * Test if a value is undefined or null.
 * @param value The value to test.
 * @returns True if the value is null or undefined.
 */
export function isEmpty(value: unknown): value is null | undefined {
	return value === undefined || value === null;
}

/**
 * Polyfills randomUUID if running in a non-secure context.
 * @returns The random UUID.
 */
export function randomUUID(): string {
	if ("randomUUID" in globalThis.crypto) {
		return globalThis.crypto.randomUUID();
	}

	function getRandomHex(c: string): string {
		const rnd = globalThis.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4));
		return (Number(c) ^ rnd).toString(16);
	}

	return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, getRandomHex);
}

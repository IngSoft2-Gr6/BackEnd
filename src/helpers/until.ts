async function until<T>(
	promiseOrPromiseList: Promise<T>
): Promise<[any, T | undefined]>;

async function until<T>(
	promiseOrPromiseList: Promise<T>[]
): Promise<[any, T[] | undefined[]]>;

async function until<T>(
	promiseOrPromiseList: Promise<T>[] | Promise<T>
): Promise<[any, T | T[] | undefined | undefined[]]> {
	if (!promiseOrPromiseList) {
		console.error("no promise provided", promiseOrPromiseList);
		return Promise.reject([undefined, undefined]);
	}
	// array of promises
	if (Array.isArray(promiseOrPromiseList)) {
		try {
			const results = await Promise.all(promiseOrPromiseList);
			return [null, results];
		} catch (e) {
			return [e, promiseOrPromiseList.map(() => undefined)];
		}
	}
	try {
		const result = await promiseOrPromiseList;
		return [null, result];
	} catch (e) {
		return [e, undefined];
	}
}

export default until;

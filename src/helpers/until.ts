export function until(
	promiseOrPromiseList: any[] | Promise<any>
): Promise<any> {
	if (!promiseOrPromiseList) {
		console.error("no promise provided", promiseOrPromiseList);
		return Promise.reject(["Unknow error"]);
	}
	// array of promises
	if (Array.isArray(promiseOrPromiseList)) {
		return Promise.all(promiseOrPromiseList)
			.then((results) => {
				return [null, results];
			})
			.catch((err) => {
				return [err, promiseOrPromiseList.map(() => undefined)];
			});
	}
	// single promise
	return promiseOrPromiseList
		.then((result: any) => {
			return [null, result];
		})
		.catch((err: any) => {
			return [err, undefined];
		});
}

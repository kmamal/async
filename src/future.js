
class Future {
	constructor () {
		this._promise = new Promise((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject
		})
	}

	promise () { return this._promise }

	static resolve (result) {
		const future = new Future()
		future.resolve(result)
		return future
	}

	static reject (reason) {
		const future = new Future()
		future.reject(reason)
		return future
	}
}

module.exports = { Future }

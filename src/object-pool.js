
class ObjectPool {
	constructor () {
		this._objects = []
		this._queue = []
	}

	get numAvailable () { return this._objects.length }
	get numQueued () { return this._queue.length }

	release (x) {
		if (this._queue.length > 0) {
			const resolve = this._queue.shift()
			resolve(x)
			return
		}

		this._objects.push(x)
	}

	async reserve () {
		return await new Promise((resolve) => {
			if (this._objects.length > 0) {
				resolve(this._objects.shift())
				return
			}

			this._queue.push(resolve)
		})
	}
}

module.exports = { ObjectPool }

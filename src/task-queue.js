
class TaskQueue {
	constructor () {
		this._queue = []
		this._promise = null
	}

	size () { return this._queue.length }

	run (fn) {
		return new Promise((resolve, reject) => {
			this._queue.push({ fn, resolve, reject })
			this._startRunning()
		})
	}

	async _startRunning () {
		if (this._promise) { return }
		let done
		this._promise = new Promise((resolve) => { done = resolve })

		while (this._queue.length > 0) {
			const { fn, resolve, reject } = this._queue.shift()
			try {
				resolve(await fn())
			} catch (error) {
				reject(error)
			}
		}

		done()
		this._promise = null
	}

	empty () { return this._promise }
}

module.exports = { TaskQueue }

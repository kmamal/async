
class TaskQueue {
	constructor () {
		this._queue = []
		this._running = false
	}

	run (fn) {
		return new Promise((resolve, reject) => {
			this._queue.push({ fn, resolve, reject })
			this._startRunning()
		})
	}

	_startRunning () {
		if (this._running) { return }
		this._running = true
		while (this._queue.length > 0) {
			const { fn, resolve, reject } = this._queue.shift()
			try {
				resolve(fn())
			} catch (error) {
				reject(error)
			}
		}
		this._running = false
	}
}

module.exports = { TaskQueue }

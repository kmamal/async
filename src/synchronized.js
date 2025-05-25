const { TaskQueue } = require('./task-queue')

class Synchronized {
	constructor (data) {
		this._data = data
		this._queue = new TaskQueue()
	}

	async access (fn) {
		await this._queue.run(async () => {
			const ret = await fn(this._data)
			if (ret !== undefined) { this._data = ret }
		})
	}
}

module.exports = { Synchronized }

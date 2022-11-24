
class TokenBucket {
	constructor () {
		this._count = 0
		this._queue = []
	}

	peek () { return this._count }

	release (inc) {
		this._count += inc

		for (;;) {
			const entry = this._queue[0]
			if (!entry) { return }

			const { dec, resolve } = entry
			if (this._count < dec) { return }

			this._count -= dec
			resolve()
			this._queue.shift()
		}
	}

	async reserve (dec, priority = false) {
		await new Promise((resolve) => {
			if (this._count >= dec) {
				this._count -= dec
				resolve()
				return
			}

			const entry = { dec, resolve }
			if (priority) {
				this._queue.unshift(entry)
			} else {
				this._queue.push(entry)
			}
		})
	}
}

module.exports = { TokenBucket }

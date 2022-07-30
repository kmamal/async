const { TokenBucket } = require('./token-bucket')

class Limiter {
	constructor (capacity, increment, interval, prefill = true) {
		this._capacity = capacity

		this._increment = increment
		this._interval = interval
		if (this._increment > this._capacity) {
			const ratio = this._capacity / this._increment
			this._increment = this._capacity
			this._interval = Math.floor(this._interval * ratio)
		}

		this._bucket = new TokenBucket()

		if (prefill) {
			this._bucket.release(capacity)
		}

		this._timer = null
	}

	_startUpdating () {
		if (this._timer) { return }

		this._timer = setInterval(() => {
			const current = this._bucket.peek()
			const total = current + this._increment
			const allowed = Math.min(this._capacity, total)
			const increment = allowed - current

			if (increment === 0) {
				clearInterval(this._timer)
				this._timer = null
				return
			}

			this._bucket.release(increment)
		}, this._interval)
	}

	peek () { return this._bucket.peek() }

	async get (n) {
		if (n > this._capacity) {
			const error = new Error("requested more tokens than capacity")
			error.tokens = n
			error.capacity = this._capacity
			throw error
		}

		this._startUpdating()
		await this._bucket.reserve(n)
	}
}

module.exports = { Limiter }

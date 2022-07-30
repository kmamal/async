
class Semaphore {
	constructor (value = 1) {
		this._value = value
		this._blocked = []
	}

	value () { return this._value }

	async dec (costs = 1, needs = costs) {
		if (this._value >= needs) {
			this._value -= costs
			return
		}

		await new Promise((resolve) => {
			this._blocked.push({ costs, needs, callback: resolve })
		})
	}

	inc (costs = 1) {
		this._value += costs
		this._checkBlocked()
	}

	free (needs = 1) {
		return this.dec(0, needs)
	}

	set (value) {
		const increased = value > this._value
		this._value = value
		increased && this._checkBlocked()
	}

	async do (callback, costs = 1, needs = costs) {
		await this.dec(costs, needs)
		await callback()
		this.inc(costs)
	}

	_checkBlocked () {
		const count = this._blocked.length
		for (let i = 0; i < count; i++) {
			const entry = this._blocked.shift()
			const { needs, costs, callback } = entry
			if (needs <= this._value) {
				this._value -= costs
				callback()

				if (this._value === 0) { break }
			} else {
				this._blocked.push(entry)
			}
		}
	}
}

module.exports = { Semaphore }

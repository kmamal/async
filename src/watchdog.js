
class Watchdog {
	constructor (callback, interval) {
		this._callback = callback
		this._interval = interval
		this._timer = null
	}

	start () {
		if (this._timer) { return }
		this._timer = setTimeout(() => {
			this._timer = null
			this._callback()
		}, this._interval)
	}

	stop () {
		if (!this._timer) { return }
		clearTimeout(this._timer)
		this._timer = null
	}

	reset () {
		this.stop()
		this.start()
	}
}

module.exports = { Watchdog }

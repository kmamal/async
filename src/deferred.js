const { Future } = require('./future')

class Deferred {
	constructor (params) {
		this._params = params
		this._future = new Future()
		this._state = Deferred.State.NEW
	}

	params () { return this._params }
	state () { return this._state }

	async get () {
		return await this._future.promise()
	}

	async produce (callback) {
		if (this._state !== Deferred.State.NEW) {
			const error = new Error("invalid state")
			error.state = this._state
			error.params = this._params
			error.callback = this._callback
			throw error
		}

		this._state = Deferred.State.PRODUCING
		const value = await callback(this._params)
		this._state = Deferred.State.PRODUCED
		this._future.resolve(value)
	}

	static State = {
		NEW: 'new',
		PRODUCING: 'producing',
		PRODUCED: 'produced',
	}

	static resolve (value) {
		const deferred = new Deferred()
		deferred._state = Deferred.State.PRODUCED
		deferred._future.resolve(value)
		return deferred
	}
}

module.exports = { Deferred }

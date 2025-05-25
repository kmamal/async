const { Future } = require('./future')

class Flux {
	static State = {
		SETTLED: 'settled',
		UNSETTLED: 'unsettled',
	}

	constructor () {
		this._state = Flux.State.UNSETTLED
		this._future = new Future()
	}

	promise () { return this._future.promise() }

	settle (value) {
		if (this._state === Flux.State.SETTLED) { this.unsettle() }

		this._state = Flux.State.SETTLED
		this._future.resolve(value)
	}

	unsettle () {
		if (this._state === Flux.State.UNSETTLED) { return }

		this._state = Flux.State.UNSETTLED
		this._future = new Future()
	}
}

module.exports = { Flux }

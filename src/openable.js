const { Future } = require('./future')

class Openable {
	constructor () {
		this._state = 'closed'
		this._stateTransitionFuture = null
	}

	stateTransitionFinished () { return this._stateTransitionFuture.promise() }

	__beginOpen () {
		if (!this._state === 'closed') { throw new Error("invalid state") }
		this._state = 'opening'
		this._stateTransitionFuture = new Future()
	}

	__endOpen () {
		this._stateTransitionFuture.resolve()
		this._state = 'open'
	}

	__beginClose () {
		if (!this._state === 'open') { throw new Error("invalid state") }
		this._state = 'closing'
		this._stateTransitionFuture = new Future()
	}

	__endClose () {
		this._stateTransitionFuture.resolve()
		this._state = 'closed'
	}
}

module.exports = { Openable }

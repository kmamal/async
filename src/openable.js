
class Openable {
	constructor () {
		this._state = 'closed'
		this._stateTransitionPromise = null
	}

	state () { return this._state }
	stateTransitionFinished () { return this._stateTransitionPromise }

	async open (fn) {
		if (this._state !== 'closed') {
			throw Object.assign(new Error("invalid state"), {
				state: this._state,
				action: 'open',
			})
		}
		this._state = 'opening'
		try {
			await (this._stateTransitionPromise = fn())
		} catch (error) {
			this._state = 'error'
			throw error
		}
		this._state = 'open'
	}

	async close (fn) {
		if (this._state !== 'open') {
			throw Object.assign(new Error("invalid state"), {
				state: this._state,
				action: 'close',
			})
		}
		this._state = 'closing'
		try {
			await (this._stateTransitionPromise = fn())
		} catch (error) {
			this._state = 'error'
			throw error
		}
		this._state = 'closed'
	}

	resetState (state) {
		this._state = state
		this._stateTransitionPromise = null
	}
}

module.exports = { Openable }

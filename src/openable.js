
class Openable {
	constructor () {
		this._state = 'closed'
		this._stateTransitionPromise = null
	}

	state () { return this._state }
	stateTransitionFinished () { return this._stateTransitionPromise }

	open (fn) {
		return this._doStateTransition('open', fn, 'closed', 'opening', 'open')
	}

	close (fn) {
		return this._doStateTransition('close', fn, 'open', 'closing', 'closed')
	}

	resetState (state) {
		this._state = state
		this._stateTransitionPromise = null
	}

	_doStateTransition (action, fn, a, b, c) {
		if (this._state !== a) {
			throw Object.assign(new Error("invalid state"), {
				state: this._state,
				action,
			})
		}
		this._state = b
		this._stateTransitionPromise = (async () => {
			try {
				await fn()
			} catch (error) {
				this._state = 'error'
				throw error
			}
			this._state = c
		})()
		return this._stateTransitionPromise
	}
}

module.exports = { Openable }

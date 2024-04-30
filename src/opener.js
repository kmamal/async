
class Opener {
	constructor () {
		this._state = 'closed'
		this._stateTransitionPromise = null
	}

	state () { return this._state }
	stateTransitionFinished () { return this._stateTransitionPromise }

	async open (fn) {
		await this._doStateTransition('open', fn, 'closed', 'opening', 'open')
	}

	async close (fn) {
		await this._doStateTransition('close', fn, 'open', 'closing', 'closed')
	}

	resetState (state) {
		this._state = state
		this._stateTransitionPromise = null
	}

	async _doStateTransition (action, fn, a, b, c) {
		if (this._state !== a) {
			throw Object.assign(new Error("invalid state"), {
				state: this._state,
				action,
			})
		}
		this._state = b
		try {
			await (this._stateTransitionPromise = fn())
		} catch (error) {
			this._state = 'error'
			throw error
		}
		this._state = c
	}
}

module.exports = { Opener }


class TaskQueue {
	constructor () {
		this._chain = Promise.resolve()
		this._size = 0
	}

	size () { return this._size }

	run (fn) {
		this._size++
		const result = this._chain.then(fn)
		this._chain = result
			.catch(() => {})
			.finally(() => { this._size-- })
		return result
	}

	async empty () {
		while (true) {
			const chain = this._chain
			await chain
			if (this._chain === chain) { return }
		}
	}
}

module.exports = { TaskQueue }

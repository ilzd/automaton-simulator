import Automaton from "./automaton";

export default class DFA extends Automaton {
  constructor () {
    super()
  }

  automatonIsValid () {
    return true
  }

  testString (str: String) {
    if (!this.automatonIsValid()) return

    let currentState = this.startState
    for (const symbol of str) {
      const possibleTransitions = this.transitions.filter(transition => transition.from === currentState)
      const transition = possibleTransitions.find(transition => transition.symbol === symbol)
      if (!transition) return false
      currentState = transition.to
    }

    const isValid = this.acceptStates.includes(currentState)

    return isValid
  }
}
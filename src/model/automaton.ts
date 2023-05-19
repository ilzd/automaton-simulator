import State from "./state";
import Transition from "./transition";
import { AutomatonTest } from "./validation-step";

export default abstract class Automaton {
  states: State[]
  startState: State
  acceptStates: State[]
  transitions: Transition[]
  private lastStateId = 0

  constructor () {
    this.states = []
    this.startState = null
    this.acceptStates = []
    this.transitions = []
  }

  addState () {
    const newState: State = { id: this.lastStateId, name: `S${this.lastStateId}` }
    this.states.push(newState)
    this.lastStateId++
    return newState
  }

  removeState (state: State) {
    const index = this.states.indexOf(state)
    if (index === -1) return
    this.states.splice(index, 1)
    if (this.startState === state) this.startState = null
    this.removeAcceptState(state)

    const transitionsToRemove = this.transitions.filter(transition => transition.from === state || transition.to === state)
    transitionsToRemove.forEach(transition => this.removeTransition(transition))
  }

  setStartState (state: State) {
    if (!this.states.includes(state)) return
    this.startState = state
  }

  addAcceptState (state: State) {
    if (!this.states.includes(state)) return
    if (this.acceptStates.includes(state)) return
    this.acceptStates.push(state)
  }

  removeAcceptState (state: State) {
    const index = this.acceptStates.indexOf(state)
    if (index === -1) return
    this.acceptStates.splice(index, 1)
  }

  addTransition (transition: Transition) {
    if (this.transitions.includes(transition)) return
    if (!this.states.includes(transition.from) || !this.states.includes(transition.to)) return

    const identicalTransition = this.transitions.find(existingTransition => {
      return existingTransition.from === transition.from &&
        existingTransition.to === transition.to &&
        existingTransition.symbol === transition.symbol
    })

    if (identicalTransition) return

    this.transitions.push(transition)
  }

  removeTransition (transition: Transition) {
    const index = this.transitions.indexOf(transition)
    if (index === -1) return
    this.transitions.splice(index, 1)
  }

  abstract automatonIsValid (): boolean
  abstract testString (str: String): AutomatonTest
}
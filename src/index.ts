import DFA from "./model/dfa";
import createGame from "./phaser/phaser";

createGame()

const dfa = new DFA();

const s0 = { id: 0, name: 'S0' }
const s1 = { id: 1, name: 'S1' }
const s2 = { id: 2, name: 'S2' }

dfa.addState(s0)
dfa.addState(s1)
dfa.addState(s2)

dfa.setStartState(s0)

dfa.addAcceptState(s0)

dfa.addTransition({ from: s0, to: s0, symbol: 'a' })


console.log(dfa.testString('aaaaa'))
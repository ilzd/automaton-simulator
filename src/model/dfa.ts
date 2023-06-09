import Automaton from "./automaton";
import { AutomatonTest, TestStep } from "./validation-step";
export default class DFA extends Automaton {
  constructor () {
    super()
  }

  automatonIsValid () {
    return true
  }

  testString (str: string): AutomatonTest {
    if (!this.automatonIsValid()) return

    const steps: TestStep[] = []

    let currentState = this.startState
    let remainingInput = str
    steps.push({ remainingInput, currStates: [currentState] })

    while (remainingInput.length) {
      const possibleTransitions = this.transitions.filter(transition => transition.from === currentState)
      const validTransition = possibleTransitions.find(transition => transition.symbol === remainingInput[0])
      if (!validTransition) break


      currentState = validTransition.to
      if (remainingInput.length === 1) {
        remainingInput = ''
      } else {
        remainingInput = remainingInput.substring(1, remainingInput.length)
      }

      steps.push({ remainingInput, currStates: [currentState] })
    }
    
    const isValid = this.acceptStates.includes(currentState) && !remainingInput.length

    const testResult: AutomatonTest = {
      valid: isValid,
      steps
    }

    return testResult
  }

  validationSteps (): AutomatonTest[] {
    throw new Error("Method not implemented.");
  }
}
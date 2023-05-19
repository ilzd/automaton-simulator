import Automaton from "./automaton";
import { AutomatonTest, TestStep } from "./validation-step";
export default class NFA extends Automaton {
  constructor () {
    super()
  }

  automatonIsValid () {
    return true
  }

  testString (str: string): AutomatonTest {
    if (!this.automatonIsValid()) return

    const steps: TestStep[] = []

    let currentStates = [this.startState]
    let remainingInput = str
    steps.push({ remainingInput, currStates: currentStates })

    while (remainingInput.length) {
      const possibleTransitions = this.transitions.filter(transition => currentStates.includes(transition.from))
      const validTransitions = possibleTransitions.filter(transition => transition.symbol === remainingInput[0])
      if (!validTransitions.length) break

      currentStates = validTransitions.map(transition => transition.to)
      if (remainingInput.length === 1) {
        remainingInput = ''
      } else {
        remainingInput = remainingInput.substring(1, remainingInput.length)
      }

      steps.push({ remainingInput, currStates: currentStates })
    }

    const isValid = this.acceptStates.find(acceptState => currentStates.includes(acceptState)) && !remainingInput.length

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
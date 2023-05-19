import State from "./state";

export interface AutomatonTest {
  steps: TestStep[]
  valid: boolean
}

export interface TestStep {
  currStates: State[]
  remainingInput: string
}
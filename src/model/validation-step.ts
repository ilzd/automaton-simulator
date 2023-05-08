import State from "./state";

export default interface ValidationStep {
  currStates: State[]
  remainingInput: string
}
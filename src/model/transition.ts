import State from "./state";

export default interface Transition {
  from: State
  to: State
  symbol: string
}
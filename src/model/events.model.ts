import { DecisionCard, LuckCard } from "./card.model";
import Player from "./player.model";

export interface EventAuth {
  player: Player
  ticket: number
}

export interface RollDiceInfo {
  player: Player
  value: number
}

export interface WaitingPathInfo {
  auth: EventAuth
  paths: number[][]
}

export interface PlayerMoveInfo {
  player: Player
  path: number[]
}

export interface CardDecisionInfo {
  auth: EventAuth
  decisionCard: DecisionCard
}

export interface CardConfirmationInfo {
  auth: EventAuth
  luckCard: LuckCard
}

export interface PlayerCreditInfo {
  player: Player
  credits: number
  delta: number
}

export interface StartMatchInfo {
  players: Player[]
}

export interface EndMatchInfo {
  players: Player[]
}

export interface PlayerFinishedInfo {
  player: Player
}

export interface PlayerWonInfo {
  player: Player
}

export interface AllPlayersFinishedInfo {
  players: Player[]
}

export interface ItemsPurchaseInfo {
  players: Player[]
}
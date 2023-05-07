import { DecisionCard, LuckCard } from "./card.model"
import Player from "./player.model"

export interface DiceSceneData {
  localAction: boolean
}

export interface CardDecitionSceneData {
  localAction: boolean
  decisionCard: DecisionCard
}

export interface CardConfirmationSceneData {
  localAction: boolean
  luckCard: LuckCard
}

export interface ItemPurchaseSceneData {
  player: Player
}
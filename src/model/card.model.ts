export interface LuckCard {
  id: number
  credits: number
}

export interface DecisionCard {
  id: number
  options: DecisionOption[]
}

export interface DecisionOption {
  credits?: number
  displacement?: number
  itemReward?: number
}
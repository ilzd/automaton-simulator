import { DecisionCard, LuckCard } from "../model/card.model";

export const LUCK_CARDS: LuckCard[] = [
  {
    id: 1,
    credits: 1
  },
  {
    id: 2,
    credits: -1
  },
  {
    id: 3,
    credits: -1
  },
  {
    id: 4,
    credits: -2
  },
  {
    id: 6,
    credits: 1
  },
  {
    id: 7,
    credits: 1
  },
  {
    id: 8,
    credits: -1
  },
  {
    id: 9,
    credits: 1
  },
  {
    id: 10,
    credits: -1
  },
  {
    id: 11,
    credits: 1
  },
  {
    id: 12,
    credits: -1
  },
  {
    id: 13,
    credits: 2
  }
]

export const DECISION_CARDS: DecisionCard[] = [
  {
    id: 4,
    options: [
      {
        credits: -1,
        displacement: 4
      },
      {
        credits: 1,
        displacement: 2
      }
    ]
  },
  {
    id: 6,
    options: [
      {
        credits: -1,
        displacement: 5
      },
      {
        displacement: -1,
        itemReward: 11
      }
    ]
  },
  {
    id: 7,
    options: [
      {
        credits: -1,
        displacement: 3
      },
      {
        credits: 1,
        displacement: 1
      }
    ]
  },
  {
    id: 8,
    options: [
      {
        credits: -1,
        displacement: 5
      },
      {
        displacement: -5,
        itemReward: 8
      }
    ]
  }
]
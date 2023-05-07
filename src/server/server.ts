import { Subject, take, timer } from "rxjs";
import { GameState, STARTING_CREDITS, DICE_ROLL_DELAY, CHOOSE_PATH_DELAY, MOVE_DELAY, STEP_DURATION, END_MATCH_DELAY, CHOOSE_CARD_OPTION_DELAY, END_TURN_DELAY, CAMERA_TRANSITION_DELAY, START_MATCH_DELAY, START_TURN_DELAY, CARD_CONFIRMATION_DELAY, CARD_DECISION_DELAY, NPC_ID_PREFIX, NPC_DELAY, ITEMS_COUNT, PREPARE_MATCH_DELAY, PLAYERS_FINISHED_DELAY, PLAYER_PURCHASE_DELAY } from "../const/game.const";
import Player from "../model/player.model";
import { BoardMap } from "../model/map.model";
import { BOARD_MAP, BoardPointType } from "../const/map.const";
import { getPossiblePaths } from "../util/graph.util";
import { EventAuth, PlayerCreditInfo, CardDecisionInfo, PlayerMoveInfo, RollDiceInfo, WaitingPathInfo, CardConfirmationInfo as LuckCardConfirmationInfo, StartMatchInfo, PlayerFinishedInfo, AllPlayersFinishedInfo, EndMatchInfo, ItemsPurchaseInfo } from "../model/events.model";
import { DecisionCard, LuckCard } from "../model/card.model";
import { DECISION_CARDS, LUCK_CARDS } from "../const/card.const";
import { Item } from "../model/item.model";
import { ITEMS } from "../const/item.const";

export default class Server {
  private readonly players: Player[]
  private currPlayer: Player
  private currTicket: number
  private ticketUsed: boolean
  private possiblePaths: number[][]
  private currDecisionCard: DecisionCard
  private currLuckCard: LuckCard
  private canGetCard: boolean
  private boardMap: BoardMap
  private currNPCIndex = 0

  private onWaitingItemChoice$ = new Subject<void>()
  private onWaitingDiceRoll$ = new Subject<EventAuth>()
  private onDiceRoll$ = new Subject<RollDiceInfo>()
  private onWaitingPath$ = new Subject<WaitingPathInfo>()
  private onPlayerMove$ = new Subject<PlayerMoveInfo>()
  private onWaitingCardDecision$ = new Subject<CardDecisionInfo>()
  private onWaitingLuckCardConfirmation$ = new Subject<LuckCardConfirmationInfo>()
  private onPlayerCreditsUpdate$ = new Subject<PlayerCreditInfo>()
  private onPlayerFinished$ = new Subject<PlayerFinishedInfo>()
  private onPlayerWon$ = new Subject<PlayerFinishedInfo>()
  private onAllPlayersFinished$ = new Subject<AllPlayersFinishedInfo>()
  private onWaitingItemsPurchase$ = new Subject<ItemsPurchaseInfo>()

  private onStartMatch$ = new Subject<StartMatchInfo>()
  private onEndMatch$ = new Subject<EndMatchInfo>()
  private onStartTurn$ = new Subject<EventAuth>()
  private onEndTurn$ = new Subject<void>()

  constructor () {
    this.players = []
    this.possiblePaths = []
    this.boardMap = BOARD_MAP

    const url_string = window.location.href
    const url = new URL(url_string)
    let npcCount = parseInt(url.searchParams.get('bots'))
    npcCount = Math.min(npcCount, 3)
    if (npcCount) {
      for (let i = 0; i < npcCount; i++) {
        const npcInfo = this.getNPCInfo()
        this.addPlayer(new Player(npcInfo.id, npcInfo.name))
      }
    }
  }

  private getNPCInfo () {
    this.currNPCIndex++
    return {
      id: `${NPC_ID_PREFIX}-${this.currNPCIndex}`,
      name: `NPC ${this.currNPCIndex}`
    }
  }

  private isNPC (player: Player) {
    return player.id.indexOf(NPC_ID_PREFIX) !== -1
  }

  private shufflePlayers () {
    for (let i = this.players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const player = this.players[i];
      this.players[i] = this.players[j];
      this.players[j] = player;
    }
  }

  startPreparation () {
    console.log('server: startPreparation')
    if (!this.players.length) return

    this.resetPlayers()
    this.shufflePlayers()

    this.players.forEach(player => {
      if (this.isNPC(player)) this.chooseItems(player.id, this.randomizeItems(ITEMS_COUNT))
    })

    this.onWaitingItemChoice$.next()
  }

  private startMatch () {
    console.log('server: startMatch')

    this.currPlayer = this.players[0]
    this.currTicket = 0

    console.log('server: onStartMatch')
    this.onStartMatch$.next({ players: this.players })

    timer(START_MATCH_DELAY).pipe(take(1)).subscribe(() => {
      this.startTurn()
    })
  }

  private endMatch () {
    console.log('server: endMatch')

    console.log('server: onEndMatch')
    this.onEndMatch$.next({ players: this.players })
  }

  private startTurn () {
    console.log('server: startTurn')
    this.updateTicket()

    console.log('server: onStartTurn')
    this.onStartTurn$.next(this.getAuth())

    timer(START_TURN_DELAY).pipe(take(1)).subscribe(() => {
      console.log('server: onWaitingDiceRoll')
      this.onWaitingDiceRoll$.next({
        player: this.currPlayer,
        ticket: this.currTicket
      })
      if (!this.isNPC(this.currPlayer)) return
      timer(NPC_DELAY).pipe(take(1)).subscribe(() => {
        this.rollDice(this.currTicket)
      })
    })

  }

  private endTurn () {
    console.log('server: endTurn')
    this.onEndTurn$.next()
    console.log('server: onTurnEnd')

    if (this.testIfPlayerFinished(this.currPlayer)) {
      console.log('server: onPlayerFinished')
      this.onPlayerFinished$.next({
        player: this.currPlayer
      })
    }

    if (this.testIfAllFinished()) {
      timer(PLAYERS_FINISHED_DELAY + CAMERA_TRANSITION_DELAY).pipe(take(1)).subscribe(() => {
        console.log('server: onAllPlayersFinished')
        this.onAllPlayersFinished$.next({ players: this.players })
      })
      timer(PLAYERS_FINISHED_DELAY + CAMERA_TRANSITION_DELAY).pipe(take(1)).subscribe(() => {
        console.log('server: onWaitingItemsPurchase')
        this.purchaseNPCItems()
        this.onWaitingItemsPurchase$.next({ players: this.players })
      })
      return
    }

    this.updateCurrPlayer()
    timer(END_TURN_DELAY + CAMERA_TRANSITION_DELAY).pipe(take(1)).subscribe(() => {
      this.startTurn()
    })
  }

  purchaseNPCItems () {
    this.players.forEach(player => {
      if (this.isNPC(player)) this.purchaseItems(player.id)
    })
  }

  private resetPlayers () {
    console.log('server: resetPlayers')
    this.players.forEach((player, index) => {
      player.setPos(0)
      player.setCredits(STARTING_CREDITS)
      player.setRanking(index)
    })
  }

  private updateCurrPlayer () {
    console.log('server: updateCurrPlayer')
    let currIndex = this.players.indexOf(this.currPlayer)

    do {
      currIndex++
      if (currIndex >= this.players.length) {
        currIndex = 0
      }
    } while (this.players[currIndex].getFinished())

    this.currPlayer = this.players[currIndex]
  }

  private checkTicket (testTicket: number) {
    if (this.ticketUsed) return false

    const valid = this.currTicket == testTicket
    if (valid) this.ticketUsed = true
    return valid
  }

  private updateTicket () {
    console.log('server: updateTicket')
    this.currTicket++
    this.ticketUsed = false
  }

  addPlayer (newPlayer: Player) {
    if (this.players.find(player => player.id === newPlayer.id)) return
    console.log('server: addPlayer')

    this.players.push(newPlayer)
  }

  randomizeItems (count: number) {
    const randomItems = []

    while (randomItems.length < count) {
      const randomIndex = Math.floor(Math.random() * ITEMS.length)
      const randomItem = ITEMS[randomIndex]
      if (!randomItems.includes(randomItem)) randomItems.push(randomItem)
    }

    return randomItems
  }

  chooseItems (playerId: string, items: Item[]) {
    if (items.length !== ITEMS_COUNT) return
    const player = this.players.find(player => playerId === player.id)
    if (!player || player.isReady()) return

    player.chooseItems(items)

    if (this.canStart()) {
      timer(PREPARE_MATCH_DELAY).pipe(take(1)).subscribe(() => {
        this.startMatch()
      })
    }
  }

  canStart () {
    return this.players.every(player => player.isReady())
  }

  rollDice (ticket: number) {
    if (!this.checkTicket(ticket)) return
    console.log('server: rollDice')

    const rndVal = Math.floor(Math.random() * 6) + 1
    this.onDiceRoll$.next({ player: this.currPlayer, value: rndVal })
    console.log('server: onDiceRoll')
    this.canGetCard = true

    timer(DICE_ROLL_DELAY).pipe(take(1)).subscribe(() => {
      this.calculatePaths(rndVal)
    })
  }

  choosePath (ticket: number, path: number[]) {
    if (!this.checkTicket(ticket)) return
    console.log('server: choosePath')

    timer(CHOOSE_PATH_DELAY).pipe(take(1)).subscribe(() => {
      this.movePlayer(path)
    })
  }

  chooseCardOption (ticket: number, id: number) {
    if (!this.checkTicket(ticket)) return
    console.log('server: chooseCardOption')

    const optionChosen = this.currDecisionCard.options[id]
    if (!optionChosen) return

    if (optionChosen.credits) {
      this.addCredits(this.currPlayer, optionChosen.credits)
      console.log('server: onPlayerCreditsUpdate')
      this.onPlayerCreditsUpdate$.next({
        player: this.currPlayer,
        credits: this.currPlayer.getCredits(),
        delta: optionChosen.credits
      })
    }

    if (optionChosen.itemReward) {
      this.currPlayer.addItem(optionChosen.itemReward)
    }

    if (optionChosen.displacement) {
      timer(CHOOSE_CARD_OPTION_DELAY).pipe(take(1)).subscribe(() => {
        this.calculatePaths(optionChosen.displacement)
      })
      return
    }


    timer(CARD_DECISION_DELAY).pipe(take(1)).subscribe(() => {
      this.endTurn()
    })
  }

  confirmLuckCard (ticket: number) {
    if (!this.checkTicket(ticket)) return
    console.log('server: confirmLuckCard')

    this.addCredits(this.currPlayer, this.currLuckCard.credits)
    console.log('server: onPlayerCreditsUpdate')
    this.onPlayerCreditsUpdate$.next({
      player: this.currPlayer,
      credits: this.currPlayer.getCredits(),
      delta: this.currLuckCard.credits
    })

    timer(CARD_CONFIRMATION_DELAY).pipe(take(1)).subscribe(() => {
      this.endTurn()
    })
  }

  private addCredits (player: Player, credits: number) {
    player.addCredits(credits)
    this.updateRankings()
  }

  private updateRankings () {
    const players = [...this.players]
    players.sort((p1, p2) => p2.getCredits() - p1.getCredits())

    players.forEach((player, index) => player.setRanking(index + 1))
  }

  purchaseItems (playerId: string) {
    const player = this.players.find(player => player.id === playerId)
    if (!player) return

    const itemsChosen = player.getItemsChosen()

    itemsChosen.forEach(itemChosen => {
      if (player.hasItem(itemChosen.id)) return

      this.addCredits(player, -itemChosen.price)
      player.addItem(itemChosen.id)
    })


    const playerWon = this.testIfPlayerWon(player)
    if (playerWon) {
      timer(PLAYER_PURCHASE_DELAY).pipe(take(1)).subscribe(() => {
        console.log('server: onPlayerWon')
        this.onPlayerWon$.next({ player })
      })
      if (this.testIfGameEnded()) {
        timer(END_MATCH_DELAY).pipe(take(1)).subscribe(() => {
          this.endMatch()
        })
      }
    }
  }

  private calculatePaths (steps: number) {
    this.possiblePaths = []
    getPossiblePaths(this.boardMap.points, this.currPlayer.getPos(), Math.abs(steps), this.possiblePaths, steps < 0)

    if (this.possiblePaths.length > 1) {
      this.updateTicket()
      console.log('server: onWaitingPath')
      this.onWaitingPath$.next({
        auth: this.getAuth(),
        paths: this.possiblePaths
      })
      if (!this.isNPC(this.currPlayer)) return
      timer(NPC_DELAY).pipe(take(1)).subscribe(() => {
        this.choosePath(this.currTicket, this.possiblePaths[0])
      })
      return
    }

    this.movePlayer(this.possiblePaths[0])
  }

  private getAuth () {
    return {
      player: this.currPlayer,
      ticket: this.currTicket
    }
  }

  private movePlayer (path: number[]) {
    console.log('server: movePlayer')
    this.currPlayer.setPos(path[path.length - 1])
    console.log('server: onPlayerMove')
    this.onPlayerMove$.next({
      player: this.currPlayer,
      path: path
    })

    timer(MOVE_DELAY + path.length * STEP_DURATION + CAMERA_TRANSITION_DELAY).pipe(take(1)).subscribe(() => {
      const currPoint = BOARD_MAP.points.find(point => point.id === this.currPlayer.getPos())

      if (!this.canGetCard || currPoint.type === BoardPointType.NORMAL) {
        this.endTurn()
        return
      }

      this.getCard()
    })
  }

  private getCard () {
    this.canGetCard = false
    const currPoint = BOARD_MAP.points.find(point => point.id === this.currPlayer.getPos())

    this.updateTicket()
    if (currPoint.type === BoardPointType.DECISION) {
      const randomIndex = Math.floor(Math.random() * DECISION_CARDS.length)
      this.currDecisionCard = DECISION_CARDS[randomIndex]
      console.log('server: onWaitingCardDecision')
      this.onWaitingCardDecision$.next({
        auth: this.getAuth(),
        decisionCard: this.currDecisionCard
      })
      if (!this.isNPC(this.currPlayer)) return
      timer(NPC_DELAY).pipe(take(1)).subscribe(() => {
        this.chooseCardOption(this.currTicket, 0)
      })
      return
    }

    const randomIndex = Math.floor(Math.random() * LUCK_CARDS.length)
    this.currLuckCard = LUCK_CARDS[randomIndex]
    console.log('server: onWaitingCardConfirmation')
    this.onWaitingLuckCardConfirmation$.next({
      auth: this.getAuth(),
      luckCard: this.currLuckCard
    })
    if (!this.isNPC(this.currPlayer)) return
    timer(NPC_DELAY).pipe(take(1)).subscribe(() => {
      this.confirmLuckCard(this.currTicket)
    })
  }

  private testIfPlayerFinished (player: Player) {
    const playerPoint = BOARD_MAP.points.find(point => point.id === player.getPos())

    const playerFinished = !playerPoint.next.length
    player.setFinished(playerFinished)

    return playerFinished
  }

  private testIfAllFinished () {
    const allFinished = this.players.every(player => player.getFinished())
    return allFinished
  }

  private testIfPlayerWon (player: Player) {
    const itemsChosen = player.getItemsChosen()
    const playerWon = itemsChosen.every(itemChosen => player.hasItem(itemChosen.id))
    player.setWon(playerWon)

    return playerWon
  }

  private testIfGameEnded () {
    const ended = this.players.every(player => player.getWon())
    return ended
  }

  onWaitingDiceRoll () {
    return this.onWaitingDiceRoll$.asObservable()
  }

  onDiceRoll () {
    return this.onDiceRoll$.asObservable()
  }

  onWaitingPath () {
    return this.onWaitingPath$.asObservable()
  }

  onPlayerMove () {
    return this.onPlayerMove$.asObservable()
  }

  onWaitingCardDecision () {
    return this.onWaitingCardDecision$.asObservable()
  }

  onWaitingCardConfirmation () {
    return this.onWaitingLuckCardConfirmation$.asObservable()
  }

  onPlayerCreditsUpdate () {
    return this.onPlayerCreditsUpdate$.asObservable()
  }

  onStartMatch () {
    return this.onStartMatch$.asObservable()
  }

  onWaitingItemChoice () {
    return this.onWaitingItemChoice$.asObservable()
  }

  onEndMatch () {
    return this.onEndMatch$.asObservable()
  }

  onStartTurn () {
    return this.onStartTurn$.asObservable()
  }

  onEndTurn () {
    return this.onEndTurn$.asObservable()
  }

  onPlayerFinished () {
    return this.onPlayerFinished$.asObservable()
  }

  onPlayerWon () {
    return this.onPlayerWon$.asObservable()
  }

  onAllPlayersFinished () {
    return this.onAllPlayersFinished$.asObservable()
  }

  onWaitingItemsPurchase () {
    return this.onWaitingItemsPurchase$.asObservable()
  }
}
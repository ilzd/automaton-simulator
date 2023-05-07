import { ITEMS_COUNT } from "../const/game.const"
import { ITEMS } from "../const/item.const"
import { Item } from "./item.model"

export default class Player {
  readonly id: string
  readonly name: string
  private pos: number
  private credits: number
  private finished: boolean
  private won: boolean
  private itemsChosen: Item[]
  private items: Item[]
  private ranking: number

  constructor (id: string, name: string) {
    this.id = id
    this.name = name
    this.itemsChosen = []
    this.items = []
    this.pos = 0
    this.credits = 0
    this.won = false
  }

  chooseItems (items: Item[]) {
    if (items.length !== ITEMS_COUNT) return
    this.itemsChosen = items
  }

  isReady () {
    return this.itemsChosen.length === ITEMS_COUNT
  }

  setPos (newPos: number) {
    this.pos = newPos
  }

  getPos () {
    return this.pos
  }

  addItem (itemId: number) {
    const newItem = ITEMS.find(item => item.id === itemId)
    if (!newItem) return

    if (this.items.includes(newItem)) return
    this.items.push(newItem)
  }

  hasItem (itemId: number) {
    return this.items.find(item => item.id === itemId)
  }

  hasItemChosen (itemId: number) {
    return this.itemsChosen.find(item => item.id === itemId)
  }

  setCredits (newCredits: number) {
    this.credits = newCredits
  }

  getCredits () {
    return this.credits
  }

  addCredits (creditsToAdd: number) {
    this.credits += creditsToAdd
  }

  setWon (newWon: boolean) {
    this.won = newWon
  }

  getWon () {
    return this.won
  }

  setRanking(newRank: number) {
    this.ranking = newRank
  }

  getRanking() {
    return this.ranking
  }

  setFinished (newFinished: boolean) {
    this.finished = newFinished
  }

  getFinished () {
    return this.finished
  }

  getItems () {
    return this.items
  }

  getItemsChosen () {
    return this.itemsChosen
  }
}
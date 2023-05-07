import Phaser from 'phaser'
import { Item } from '../../model/item.model';
import { ITEMS } from '../../const/item.const';
import { GameEvents, ITEMS_COUNT } from '../../const/game.const';
import { ItemPurchaseSceneData } from '../../model/scene.model';
import Player from '../../model/player.model';

export default class ItemPurchaseScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'item-purchase-scene'

  private text: any
  private sceneData: ItemPurchaseSceneData
  private purchasedItems: Item[]
  private itemsOwned: Item[]
  private items: Phaser.GameObjects.Group
  private balanceText: Phaser.GameObjects.Text
  private player: Player

  init (data: ItemPurchaseSceneData) {
    this.sceneData = data
  }

  constructor () {
    super(ItemPurchaseScene.SCENE_KEY);
  }

  preload () {
  }

  create () {
    this.text = this.cache.json.get('text')

    this.player = this.sceneData.player

    this.cameras.main.setBackgroundColor('rgba(0,0,0,0.85)')

    this.purchasedItems = []
    this.itemsOwned = [...this.player.getItems()]
    this.createTitle()
    this.createItems()
    this.buildBalanceText()

    this.updateBalance()

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanUp()
    })
  }

  createItems () {
    const gameSize = this.scale.gameSize
    const items = this.sceneData.player.getItemsChosen()

    this.items = this.add.group()

    items.forEach(item => {
      const newItem = this.buildItem(item)
      this.items.add(newItem)
    })

    const gridWidth = ITEMS_COUNT
    const cellWidth = 260
    const cellHeight = 250
    const totalWidth = gridWidth * cellWidth

    Phaser.Actions.GridAlign(this.items.getChildren(), {
      width: 6,
      cellWidth: cellWidth,
      cellHeight: cellHeight,
      position: Phaser.Display.Align.CENTER,
      x: gameSize.width * 0.5 - totalWidth / 2 + cellWidth / 2,
      y: gameSize.height * 0.5,
    })
  }

  buyItem (item: Item) {
    if (this.itemsOwned.includes(item)) return

    this.purchasedItems.push(item)
    this.itemsOwned.push(item)
    this.updateBalance()

    if (this.itemsOwned.length === this.sceneData.player.getItemsChosen().length) {
      this.game.events.emit(GameEvents.REQUEST_ITEMS_PURCHASE)
    }
  }

  createTitle () {
    const gameSize = this.scale.gameSize
    this.add.text(gameSize.width * 0.5, gameSize.height * 0.1, this.text.items.purchaseItemsTitle.toUpperCase(), {
      fontSize: '48px',
      strokeThickness: 1
    }).setOrigin(0.5)
  }

  buildItem (item: Item) {
    const size = 220

    const itemBought = this.player.hasItem(item.id)

    const selectedBackground = this.add.rexRoundRectangle(
      0, 0, size + 15, size + 15, 20, itemBought ? 0xFF0000 : 0xAAAAAA, 1
    )

    const background = this.add.rexRoundRectangle(
      0, 0, size, size, 20, 0xFFFFFF, 1
    )

    const name = this.add.text(0, -105, `${this.text.items.names[item.id]}`, {
      fontSize: '26px',
      color: '#000000',
      wordWrap: {
        width: size
      },
      align: 'center'
    }).setOrigin(0.5, 0)

    const image = this.add.image(0, size / 2, item.image)
    const imageRatio = (size * 0.8) / image.height

    image
      .setOrigin(0.5, 1)
      .setDisplaySize(image.width * imageRatio, image.height * imageRatio)

    const itemView = this.add.container(0, 0, [selectedBackground, background, image, name])

    itemView
      .setSize(size, size)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        if (!this.purchasedItems.includes(item)) itemView.setScale(1.05)
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        itemView.setScale(1)
      })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.buyItem(item)
        selectedBackground.setFillStyle(0xFF0000)
      })

    return itemView
  }

  updateBalance () {
    let balance = this.sceneData.player.getCredits()
    this.purchasedItems.forEach(item => {
      balance -= item.price
    })

    let text = this.text.items.balance
    text = text.replace('%credits', balance)
    this.balanceText.setText(text)
  }

  buildBalanceText () {
    const gameSize = this.scale.gameSize
    this.balanceText = this.add.text(gameSize.width * 0.5, gameSize.height * 0.85, '', {
      fontSize: '62px',
      stroke: '0x000000',
      strokeThickness: 1.
    }).setOrigin(0.5)
  }

  cleanUp () {
    this.text = undefined
    this.sceneData = undefined
    this.items = undefined
    this.balanceText = undefined
    this.player = undefined
  }
}

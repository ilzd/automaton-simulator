import Phaser from 'phaser'
import { Item } from '../../model/item.model';
import { ITEMS } from '../../const/item.const';
import { GameEvents, ITEMS_COUNT } from '../../const/game.const';

export default class ItemChoiceScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'item-choice-scene'

  private text: any
  private items: Phaser.GameObjects.Group
  private selectedItems: Item[]
  private totalText: Phaser.GameObjects.Text

  constructor () {
    super(ItemChoiceScene.SCENE_KEY);
  }

  preload () {
  }

  create () {
    this.text = this.cache.json.get('text')
    this.selectedItems = []

    this.cameras.main.setBackgroundColor('rgba(0,0,0,0.85)')

    this.createTitle()
    this.createItems()
    this.buildTotalText()

    this.updateItems()

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanUp()
    })
  }

  createItems () {
    const gameSize = this.scale.gameSize
    const items = ITEMS

    this.items = this.add.group()

    items.forEach(item => {
      const newItem = this.buildItem(item)
      this.items.add(newItem)
    })

    const gridWidth = 6
    const cellWidth = 260
    const cellHeight = 250
    const totalWidth = gridWidth * cellWidth

    Phaser.Actions.GridAlign(this.items.getChildren(), {
      width: 6,
      cellWidth: cellWidth,
      cellHeight: cellHeight,
      position: Phaser.Display.Align.CENTER,
      x: gameSize.width * 0.5 - totalWidth / 2 + cellWidth / 2,
      y: gameSize.height * 0.275,
    })
  }

  createTitle () {
    const gameSize = this.scale.gameSize
    this.add.text(gameSize.width * 0.5, gameSize.height * 0.1, this.text.items.selectItemsTitle.toUpperCase(), {
      fontSize: '48px',
      strokeThickness: 1
    }).setOrigin(0.5)
  }

  buildItem (item: Item) {
    const size = 220

    const selectedBackground = this.add.rexRoundRectangle(
      0, 0, size + 15, size + 15, 20, 0xAAAAAA, 1
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
        if (this.selectedItems.length < ITEMS_COUNT) itemView.setScale(1.05)
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        itemView.setScale(1)
      })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.toggleItem(item)
        const selected = this.selectedItems.includes(item)
        selectedBackground.setFillStyle(selected ? 0xFF0000 : 0xAAAAAA)
      })

    return itemView
  }

  toggleItem (item: Item) {
    if (this.selectedItems.length === ITEMS_COUNT) return

    if (this.selectedItems.includes(item)) {
      const itemIndex = this.selectedItems.indexOf(item)
      if (itemIndex === -1) return
      this.selectedItems.splice(itemIndex, 1)
    } else if (this.selectedItems.length < ITEMS_COUNT) {
      this.selectedItems.push(item)
    }

    if (this.selectedItems.length === ITEMS_COUNT) {
      this.game.events.emit(GameEvents.REQUEST_ITEM_CHOICE, this.selectedItems)
    }

    this.updateItems()
  }

  updateItems () {
    const prices = this.selectedItems.map(item => item.price)
    const totalPrice = prices.reduce((acc, curr) => acc + curr, 0)

    this.totalText.setText(`${this.text.items.totalPrice.toUpperCase()}: $ ${totalPrice}`)
  }

  confirm () {
    console.log('confirm')
  }

  buildTotalText () {
    const gameSize = this.scale.gameSize
    this.totalText = this.add.text(gameSize.width * 0.5, gameSize.height * 0.9, '', {
      fontSize: '42px',
      stroke: '0x000000',
      strokeThickness: 1.
    }).setOrigin(0.5)
  }

  cleanUp () {
    this.text = undefined
    this.items = undefined
    this.selectedItems = undefined
    this.totalText = undefined
  }
}

import Phaser from 'phaser'
import { CardConfirmationSceneData, CardDecitionSceneData } from '../../model/scene.model'
import { LuckCard } from '../../model/card.model'
import { GameEvents } from '../../const/game.const'
import { LUCK_CARD_PREFIX } from '../../const/file.const'

export default class CardConfirmationScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'card-confirmation-scene'

  private text: any
  private sceneData: CardConfirmationSceneData

  constructor () {
    super(CardConfirmationScene.SCENE_KEY);
  }

  init (data: CardConfirmationSceneData) {
    this.sceneData = data
  }

  preload () {
  }

  create () {
    this.text = this.cache.json.get('text')

    this.cameras.main.setBackgroundColor('rgba(0,0,0,0.75)')

    this.buildTitle()
    this.buildCard()

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanUp()
    })

  }

  buildTitle () {
    const gameSize = this.scale.gameSize

    var titleBackground = this.add.rexRoundRectangle(
      gameSize.width / 2, gameSize.height * 0.25, gameSize.width * 0.5, 150, 10, 0xAAAA22
    ).setOrigin(0.5)

    const title = this.add.text(titleBackground.x,
      titleBackground.y,
      this.text.cards.luckCards[this.sceneData.luckCard.id].title,
      {
        fontSize: '50px',
        strokeThickness: 2,
        padding: 16,
      }
    ).setOrigin(0.5)
  }

  buildCard () {
    const gameSize = this.scale.gameSize

    const option1 = this.buildOption(this.sceneData.luckCard)

    option1
      .setPosition(gameSize.width * 0.5, gameSize.height * 0.6)
      .once(Phaser.Input.Events.POINTER_DOWN, () => {
        this.game.events.emit(GameEvents.REQUEST_CARD_CONFIRMATION)
      })
  }

  buildOption (luckCard: LuckCard) {
    const background = this.add.rexRoundRectangle(0, 0, 450, 500, 10, 0xFFFFFF)

    const image = this.add.image(0, -background.height / 2, LUCK_CARD_PREFIX + luckCard.id).setOrigin(0.5, 0)
    image.setScale((background.width / 2) / image.width)

    const description = this.text.cards.luckCards[this.sceneData.luckCard.id].description
    const descriptionView = this.add.text(0, 0, description, {
      color: '#000000',
      fontSize: '32px',
      align: 'center',
      wordWrap: {
        width: background.width * 0.95
      }
    }).setOrigin(0.5)

    let creditsText = luckCard.credits < 0 ? this.text.cards.pay : this.text.cards.receive
    creditsText = creditsText.replace('%credits', Math.abs(luckCard.credits))

    const effectsView = this.add.text(0, background.height / 2, creditsText, {
      color: '#000000',
      fontSize: '32px',
      align: 'center',
      padding: 12,
      wordWrap: {
        width: background.width * 0.95
      }
    }).setOrigin(0.5, 1)

    const optionView = this.add.container(0, 0, [background, image, descriptionView, effectsView])
    optionView.setSize(background.width, background.height)

    if (this.sceneData.localAction) {
      optionView.setInteractive()

      optionView.on(Phaser.Input.Events.POINTER_OVER, () => {
        optionView.setScale(1.05)
      })
      optionView.on(Phaser.Input.Events.POINTER_OUT, () => {
        optionView.setScale(1)
      })
    }

    return optionView
  }

  cleanUp () {
    this.text = undefined
    this.sceneData = undefined
  }
}

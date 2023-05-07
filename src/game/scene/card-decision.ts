import Phaser from 'phaser'
import { CardDecitionSceneData } from '../../model/scene.model'
import { DecisionOption } from '../../model/card.model'
import { GameEvents } from '../../const/game.const'
import { DECISION_CARD_PREFIX } from '../../const/file.const'

export default class CardDecisionScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'card-decision-scene'

  private text: any
  private sceneData: CardDecitionSceneData

  constructor () {
    super(CardDecisionScene.SCENE_KEY);
  }

  init (data: CardDecitionSceneData) {
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
      gameSize.width / 2, gameSize.height * 0.25, gameSize.width * 0.525, 150, 10, 0xAA2222
    ).setOrigin(0.5)

    const title = this.add.text(titleBackground.x,
      titleBackground.y,
      this.text.cards.decisionCards[this.sceneData.decisionCard.id].title,
      {
        fontSize: '50px',
        strokeThickness: 2,
        padding: 16,
      }
    ).setOrigin(0.5)
  }

  buildCard () {
    const gameSize = this.scale.gameSize

    const option1 = this.buildOption(
      this.text.cards.decisionCards[this.sceneData.decisionCard.id].options[0].description,
      this.sceneData.decisionCard.options[0],
      this.sceneData.decisionCard.id,
      1
    )

    option1
      .setPosition(gameSize.width * 0.355, gameSize.height * 0.6)
      .once(Phaser.Input.Events.POINTER_DOWN, () => {
        this.game.events.emit(GameEvents.REQUEST_CARD_DECISION, 0)
      })

    const option2 = this.buildOption(
      this.text.cards.decisionCards[this.sceneData.decisionCard.id].options[1].description,
      this.sceneData.decisionCard.options[1],
      this.sceneData.decisionCard.id,
      2
    )

    this.add.text(gameSize.width * 0.5, option1.y, this.text.cards.or, {
      fontSize: '32px',
      strokeThickness: 1,
    }).setOrigin(0.5)

    option2
      .setPosition(gameSize.width * 0.645, gameSize.height * 0.6)
      .once(Phaser.Input.Events.POINTER_DOWN, () => {
        this.game.events.emit(GameEvents.REQUEST_CARD_DECISION, 1)
      })
  }

  buildOption (description: string, option: DecisionOption, cardId: number, optionIndex: number) {
    const background = this.add.rexRoundRectangle(0, 0, 450, 500, 10, 0xFFFFFF)

    const image = this.add.image(0, -background.height / 2, `${DECISION_CARD_PREFIX}${cardId}_${optionIndex}`).setOrigin(0.5, 0)
    image.setScale((background.width / 2) / image.width)

    const descriptionView = this.add.text(0, 0, description, {
      color: '#000000',
      fontSize: '32px',
      align: 'center',
      wordWrap: {
        width: background.width * 0.95
      }
    }).setOrigin(0.5)

    let effectText = ""
    if (option.credits) {
      let creditsText = option.credits < 0 ? this.text.cards.pay : this.text.cards.receive
      creditsText = creditsText.replace('%credits', Math.abs(option.credits))
      effectText += creditsText
    }
    if (option.displacement) {
      let displacementText = option.displacement < 0 ? this.text.cards.walkBack : this.text.cards.walkAhead
      displacementText = displacementText.replace('%displacement', Math.abs(option.displacement))
      effectText += `\n${displacementText}`
    }

    const effectsView = this.add.text(0, background.height / 2, effectText, {
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

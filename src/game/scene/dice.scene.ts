import Phaser from 'phaser'
import { DiceSceneData } from '../../model/scene.model';
import { GameEvents, SERVER_DATA_KEY, USER_ID_KEY, USER_NAME_KEY } from '../../const/game.const';
import { CHAR_ANIM_KEY, CREDITS_KEY, DICE_KEY, LOGO_KEY, RED_TABLE_KEY, TABLE_KEY } from '../../const/file.const';
import { makeAnimName } from '../../util/animation.util';
import { CharAnimDir, CharAnimType } from '../../const/animation.const';
import { ReplaySubject, takeUntil } from 'rxjs';
import Server from '../../server/server';
import Player from '../../model/player.model';
import { EventAuth } from '../../model/events.model';

export default class DiceScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'dice-scene'
  private componentDestroyed$: ReplaySubject<unknown>

  private text: any
  // private sceneData: DiceSceneData
  private table: Phaser.GameObjects.Container
  private dice: Phaser.GameObjects.Sprite
  private textIndicator: Phaser.GameObjects.Text
  private creditsText: Phaser.GameObjects.Text
  private sidebar: Phaser.GameObjects.Container
  private character: Phaser.GameObjects.Container
  private currPlayerId: string
  private nameText: Phaser.GameObjects.Text
  private server?: Server
  private localAction: boolean
  private ticket: number

  constructor () {
    super(DiceScene.SCENE_KEY);
  }

  // init (data: DiceSceneData) {
  //   this.sceneData = data
  // }

  preload () {
  }

  create () {
    this.componentDestroyed$ = new ReplaySubject(1)
    this.text = this.cache.json.get('text')

    this.setupServer()
    this.createSidebar()
    this.createCharacter()
    this.createTable()

    // this.game.events.on(GameEvents.DICE_VALUE, this.diceValueHandler, this)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanUp()
    })
  }

  setupServer () {
    const server = this.game.registry.get(SERVER_DATA_KEY)

    if (!server) return
    this.server = server

    this.server.onWaitingDiceRoll().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        this.checkAuth(res)
        if (this.isLocalUser(res.player.id)) this.setBackground()
        this.updateCharacter(res.player)
        this.updateTable()
        this.showSidebar()
        this.showCharacter()
        this.showTable()
      }
    })

    this.server.onDiceRoll().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        this.diceValueHandler(res.value)
      }
    })

    this.server.onWaitingCardConfirmation().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        this.isLocalUser(res.auth.player.id) ? this.hideAll() : this.hideForNonLocal()
      }
    })

    this.server.onPlayerMove().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        this.isLocalUser(res.player.id) ? this.hideAll() : this.hideForNonLocal()
      }
    })

    this.server.onWaitingCardDecision().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        this.isLocalUser(res.auth.player.id) ? this.hideAll() : this.hideForNonLocal()
      }
    })

    this.server.onWaitingPath().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        this.isLocalUser(res.auth.player.id) ? this.hideAll() : this.hideForNonLocal()
      }
    })

    this.server.onEndTurn().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: () => {
        this.hideAll()
      }
    })

    this.server.onPlayerCreditsUpdate().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        if (res.player.id === this.currPlayerId) this.updateCredits(res.credits)
      }
    })
  }

  clearBackground () {
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0)')
  }

  setBackground () {
    this.cameras.main.setBackgroundColor('rgba(0,0,0,0.75)')
  }

  hideAll () {
    this.clearBackground()
    this.hideCharacter()
    this.hideSidebar()
    this.hideTable()
  }

  showAll () {
    this.showCharacter()
    this.showSidebar()
    this.showTable()
  }

  hideForNonLocal () {
    this.clearBackground()
    this.hideSidebar()
  }

  checkAuth (auth: EventAuth) {
    this.localAction = this.isLocalUser(auth.player.id)
    this.currPlayerId = auth.player.id
    if (this.localAction) this.ticket = auth.ticket
  }

  isLocalUser (id: string) {
    const localUserId = this.registry.get(USER_ID_KEY)
    return id === localUserId
  }

  createSidebar () {
    const gameSize = this.scale.gameSize
    const background = this.add.rectangle(0, 0, 350, gameSize.height, 0x001848, 0.6).setOrigin(0)
    const logo = this.add.image(background.width / 2, 15, LOGO_KEY)
      .setOrigin(0.5, 0)
      .setScale(2.1)

    const metaText = this.add.text(background.width / 2, logo.y + logo.displayHeight - 5, 'M E T A V E R S O', {
      color: '#fbb900',
      fontSize: '22px',
      strokeThickness: 1,
      stroke: '#fbb900'
    }).setOrigin(0.5, 0)

    this.sidebar = this.add.container(-500, 0, [background, logo, metaText])
  }

  createCharacter () {
    const gameSize = this.scale.gameSize
    const charSprite = this.add.sprite(0, gameSize.height, CHAR_ANIM_KEY)
    charSprite
      .setOrigin(0.25, 1)
      .setScale(2.2)
      .play(makeAnimName(CharAnimType.IDLE, CharAnimDir.L))

    this.nameText = this.add.text(gameSize.height * 0.125, gameSize.height * 0.77, '', {
      fontSize: '28px',
      strokeThickness: 1,
      wordWrap: {
        width: 235
      }
    }).setOrigin(0, 1)

    this.character = this.add.container(-500, 0, [charSprite, this.nameText])
  }

  createTable () {
    const gameSize = this.scale.gameSize

    const creditsTable = this.add.image(360, 25, RED_TABLE_KEY)
    creditsTable
      .setScale(2.1)

    const diceTable = this.add.image(0, 0, TABLE_KEY)
    diceTable
      .setFlipX(true)
      .setScale(3)

    this.dice = this.add.sprite(0, -130, DICE_KEY)

    this.textIndicator = this.add.text(0, -40, '', {
      fontSize: "30px",
    }).setOrigin(0.5)

    const creditsImage = this.add.image(420, -80, CREDITS_KEY).setScale(1.5)

    this.creditsText = this.add.text(420, -30, '', {
      fontSize: "30px",
      strokeThickness: 1
    }).setOrigin(0.5)

    this.table = this.add.container(gameSize.width * 0.15, gameSize.height + 500,
      [creditsTable, diceTable, creditsImage, this.dice, this.textIndicator, this.creditsText]
    )
    this.table.setSize(diceTable.displayWidth, diceTable.displayHeight)
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, this.pointerDownHandler, this)
  }

  showSidebar () {
    this.tweens.add({
      targets: this.sidebar,
      x: 0,
      duration: 500,
      ease: Phaser.Math.Easing.Sine.Out
    })
  }

  hideSidebar () {
    this.tweens.add({
      targets: this.sidebar,
      x: -500,
      duration: 500,
      ease: Phaser.Math.Easing.Sine.Out
    })
  }

  showCharacter () {
    this.tweens.add({
      targets: this.character,
      x: 0,
      duration: 500,
      ease: Phaser.Math.Easing.Sine.Out
    })
  }

  hideCharacter () {
    this.tweens.add({
      targets: this.character,
      x: -500,
      duration: 500,
      ease: Phaser.Math.Easing.Sine.Out
    })
  }

  showTable () {
    const gameSize = this.scale.gameSize
    this.tweens.add({
      targets: this.table,
      y: gameSize.height,
      duration: 500,
      ease: Phaser.Math.Easing.Sine.InOut
    })
  }

  hideTable () {
    const gameSize = this.scale.gameSize
    this.tweens.add({
      targets: this.table,
      y: gameSize.height + 500,
      duration: 500,
      ease: Phaser.Math.Easing.Sine.InOut
    })
  }

  updateCharacter (player: Player) {
    this.nameText.setText(player.name.toUpperCase())
    this.creditsText.setText(`$ ${player.getCredits()}`)
  }

  updateTable () {
    this.tweens.killTweensOf(this.textIndicator)
    this.textIndicator.setVisible(true)

    if (!this.localAction) {
      this.textIndicator.setText(this.text.dice.waitingDiceRoll.toUpperCase())
      return
    }

    this.textIndicator.setText(this.text.dice.rollTheDice.toUpperCase())
    this.tweens.add({
      targets: this.textIndicator,
      scale: 1.1,
      ease: Phaser.Math.Easing.Sine.InOut,
      duration: 500,
      yoyo: true,
      repeat: -1
    })
  }

  updateCredits (newCredits: number) {
    this.creditsText.setText(`$ ${newCredits}`)
    this.tweens.add({
      targets: this.creditsText,
      scale: 1.3,
      duration: 500,
      ease: Phaser.Math.Easing.Sine.Out,
      yoyo: true
    })
  }

  diceValueHandler (value: number) {
    this.textIndicator.setVisible(false)

    const rowOffset = Math.floor(Math.random() * 4) * 6
    const frame = value + rowOffset - 1
    let stopped = false

    const frameEvent = this.time.addEvent({
      delay: 10,
      repeat: 50,
      callback: () => {
        const frame = Math.floor(Math.random() * 24)
        this.dice.setFrame(frame)
      }
    })

    this.tweens.add({
      targets: this.dice,
      rotation: Math.PI * 6,
      duration: 900,
      ease: Phaser.Math.Easing.Cubic.Out,
      onComplete: () => {
        if (!stopped) {
          frameEvent.destroy()
          this.dice.setFrame(frame)
        }
      },
      onUpdate: (tweenInfo: Phaser.Tweens.Tween) => {
        if (tweenInfo.elapsed > 700 && !stopped) {
          stopped = true
          frameEvent.destroy()
          this.dice.setFrame(frame)
        }
      }
    })

    this.tweens.add({
      targets: this.dice,
      y: '-=200',
      scale: 1.1,
      duration: 450,
      ease: Phaser.Math.Easing.Quadratic.Out
    })

    this.tweens.add({
      targets: this.dice,
      y: '+=200',
      scale: 1,
      duration: 450,
      delay: 500,
      ease: Phaser.Math.Easing.Bounce.Out,
    })
  }

  pointerDownHandler () {
    if (!this.localAction) return
    // this.game.events.emit(GameEvents.REQUEST_ROLL)
    this.server.rollDice(this.ticket)
  }

  cleanUp () {
    this.componentDestroyed$?.next(true)
    this.componentDestroyed$?.complete()
    this.componentDestroyed$ = undefined

    this.table.off(Phaser.Input.Events.POINTER_DOWN, this.pointerDownHandler, this)
    // this.game.events.off(GameEvents.DICE_VALUE, this.diceValueHandler, this)

    this.text = undefined
    // this.sceneData = undefined
    this.dice = undefined
    this.table = undefined
    this.textIndicator = undefined
    this.creditsText = undefined
    this.sidebar = undefined
    this.character = undefined
    this.nameText = undefined
    this.server = undefined
  }
}

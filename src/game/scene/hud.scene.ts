import Phaser from 'phaser'
import { CREDITS_KEY, CUP_KEY, TEXT_KEY } from '../../const/file.const';
import { ReplaySubject, takeUntil } from 'rxjs';
import Server from '../../server/server';
import { SERVER_DATA_KEY, STARTING_CREDITS, USER_ID_KEY } from '../../const/game.const';

export default class HUDScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'hud-scene'
  private componentDestroyed$: ReplaySubject<unknown>

  private text: any
  private feedText: Phaser.GameObjects.Text
  private feed: Phaser.GameObjects.Container
  private rankText: Phaser.GameObjects.Text
  private creditsText: Phaser.GameObjects.Text
  private server?: Server

  constructor () {
    super(HUDScene.SCENE_KEY);
  }

  preload () {
    this.load.json(TEXT_KEY, 'texts/ptBr.json')
  }

  create () {
    this.componentDestroyed$ = new ReplaySubject(1)
    this.text = this.cache.json.get('text')
    this.setupServer()
    this.createCredits()
    this.createRank()
    this.createFeed()
  }

  setupServer () {
    const server = this.game.registry.get(SERVER_DATA_KEY)

    if (!server) return
    this.server = server

    this.server.onStartMatch().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: () => {
        this.updateFeed(this.text.board.feed.startMatch)
      }
    })

    this.server.onEndMatch().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: () => {
        this.updateFeed(this.text.board.feed.endMatch)
      }
    })

    this.server.onStartTurn().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        const text: string = this.text.board.feed.playerTurn
        const finalText = text.replace('%name', res.player.name)
        this.updateFeed(finalText)
      }
    })

    this.server.onEndTurn().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: () => {
        this.updateFeed(this.text.board.feed.endTurn)
      }
    })

    this.server.onWaitingDiceRoll().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        let text = this.text.board.feed.playing
        text = text.replace('%name', res.player.name)
        this.updateFeed(text)
      }
    })

    // this.server.onWaitingCardConfirmation().pipe(takeUntil(this.componentDestroyed$)).subscribe({
    //   next: (res) => {
    //     let text = this.text.board.feed.playing
    //     text = text.replace('%name', res.auth.player.name)
    //     this.updateFeed(text)
    //   }
    // })

    // this.server.onWaitingCardDecision().pipe(takeUntil(this.componentDestroyed$)).subscribe({
    //   next: (res) => {
    //     let text = this.text.board.feed.playing
    //     text = text.replace('%name', res.auth.player.name)
    //     this.updateFeed(text)
    //   }
    // })

    // this.server.onWaitingPath().pipe(takeUntil(this.componentDestroyed$)).subscribe({
    //   next: (res) => {
    //     let text = this.text.board.feed.playing
    //     text = text.replace('%name', res.auth.player.name)
    //     this.updateFeed(text)
    //   }
    // })

    this.server.onPlayerCreditsUpdate().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        let text = res.delta > 0 ? this.text.board.feed.playerCreditsGain : this.text.board.feed.playerCreditsLoss
        text = text.replace('%credits', Math.abs(res.delta))
        text = text.replace('%name', res.player.name)
        this.updateFeed(text)

        const userId = this.game.registry.get(USER_ID_KEY)
        if (res.player.id === userId) {
          this.updateCredits(res.player.getCredits())
          this.updateRank(res.player.getRanking())
        }
      }
    })
  }

  createFeed () {
    const gameSize = this.scale.gameSize
    const feedBackground = this.add.rexRoundRectangle(
      0, 0, gameSize.width * 0.55, 50, 10, 0x000000, 0.75
    )

    this.feedText = this.add.text(0, 0, '', {
      fontSize: '26px',
      strokeThickness: 1,
    }).setOrigin(0.5)

    this.feed = this.add.container(gameSize.width * 0.75, gameSize.height * 0.96, [feedBackground, this.feedText])
  }

  createCredits () {
    const gameSize = this.scale.gameSize

    const background = this.add.rexRoundRectangle(
      0, 0, 130, 20, 17, 0xd2dd8c, 1
    ).setOrigin(0.5)

    const creditsImage = this.add.image(-55, 0, CREDITS_KEY)

    this.creditsText = this.add.text(10, 0, `$ ${STARTING_CREDITS}`, {
      fontSize: '28px',
      color: '#000000'
    }).setOrigin(0.5)

    const credits = this.add.container(gameSize.width * 0.93, 50, [background, creditsImage, this.creditsText])
  }

  createRank () {
    const gameSize = this.scale.gameSize

    const background = this.add.rexRoundRectangle(
      0, 0, 130, 20, 17, 0xfef5ba, 1
    ).setOrigin(0.5)

    const rankImage = this.add.image(-55, 0, CUP_KEY)

    this.rankText = this.add.text(10, 0, '1º', {
      fontSize: '28px',
      color: '#000000'
    }).setOrigin(0.5)

    const rank = this.add.container(gameSize.width * 0.83, 50, [background, rankImage, this.rankText])
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

  updateRank (newRank: number) {
    this.rankText.setText(`${newRank}º`)
    this.tweens.add({
      targets: this.rankText,
      scale: 1.3,
      duration: 500,
      ease: Phaser.Math.Easing.Sine.Out,
      yoyo: true
    })
  }

  updateFeed (message: string) {
    this.feedText.setText(message)
    this.tweens.add({
      targets: this.feed,
      scale: 1.1,
      yoyo: true,
      duration: 250,
      ease: Phaser.Math.Easing.Sine.Out
    })
  }

  cleanUp () {
    this.componentDestroyed$?.next(true)
    this.componentDestroyed$?.complete()
    this.componentDestroyed$ = undefined

    this.text = undefined
    this.feedText = undefined
    this.creditsText = undefined
    this.feed = undefined
    this.server = undefined
  }
}

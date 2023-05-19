import { AutomatonEvents } from "../const/events.const"

export default class HUDScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'hud-scene'

  constructor () {
    super(HUDScene.SCENE_KEY)
  }

  preload () {
  }

  create () {
    this.createNewStateButton()

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanUp()
    })
  }

  createNewStateButton () {
    const button = this.add.text(15, 15, 'Novo estado', {
      fontSize: '24px',
      color: '#222222',
      backgroundColor: '#DDDDDD',
      padding: 12
    })

    button
      .setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.game.events.emit(AutomatonEvents.ADD_STATE)
      })
  }

  cleanUp () {
  }
}
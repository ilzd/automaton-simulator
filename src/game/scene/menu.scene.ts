import Phaser from 'phaser'
import BoardScene from './board.scene';
import HUDScene from './hud.scene';

export default class MenuScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'menu-scene'

  private text: any

  constructor () {
    super(MenuScene.SCENE_KEY);
  }

  preload () {
  }

  create () {
    this.text = this.cache.json.get('text')
    
    this.scene.start(BoardScene.SCENE_KEY)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanUp()
    })
  }

  cleanUp () {
    this.text = undefined
  }
}

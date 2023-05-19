import AutomatonScene from "./automaton.scene"

export default class PreloadScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'preload-scene'

  constructor () {
    super(PreloadScene.SCENE_KEY)
  }

  preload () {
  }

  create () {
    this.scene.start(AutomatonScene.SCENE_KEY)
  }
}
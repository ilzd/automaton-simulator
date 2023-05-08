import Phaser from "phaser";
import PreloadScene from "./scenes/preload";

export default function createGame () {
  new Phaser.Game({
    parent: 'phaser',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [PreloadScene]
  })
}
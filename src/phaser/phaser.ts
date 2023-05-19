import Phaser from "phaser";
import PreloadScene from "./scenes/preload.scene";
import AutomatonScene from "./scenes/automaton.scene";
import HUDScene from "./scenes/hud.scene";

export default function createGame () {
  new Phaser.Game({
    parent: 'phaser',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#222222',
    scene: [PreloadScene, AutomatonScene, HUDScene]
  })
}
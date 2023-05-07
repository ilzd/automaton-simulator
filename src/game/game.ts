import Phaser from "phaser"
import RoundRectanglePlugin from 'phaser3-rex-plugins/plugins/roundrectangle-plugin.js';
import PreloadScene from "./scene/preload.scene"
import MenuScene from "./scene/menu.scene"
import BoardScene from "./scene/board.scene"
import Server from "../server/server"
import { SERVER_DATA_KEY, USER_ID_KEY, USER_NAME_KEY } from "../const/game.const"
import DiceScene from "./scene/dice.scene"
import CardDecisionScene from "./scene/card-decision"
import CardConfirmationScene from "./scene/card-confirmation";
import HUDScene from "./scene/hud.scene";
import ItemChoiceScene from "./scene/item-choice.scene";
import ItemPurchaseScene from "./scene/item-purchase.scene";

export default function createGame (server?: Server) {
  const game = new Phaser.Game({
    width: 1920,
    height: 1080,
    parent: 'phaser',
    roundPixels: true,
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#7fa5c5',
    scene: [
      PreloadScene,
      MenuScene,
      BoardScene,
      DiceScene,
      CardDecisionScene,
      CardConfirmationScene,
      HUDScene,
      ItemChoiceScene,
      ItemPurchaseScene
    ],
    plugins: {
      global: [
        {
          key: 'rexRoundRectanglePlugin',
          plugin: RoundRectanglePlugin,
          start: true
        }
      ]
    }
  })

  if (server) game.registry.set(SERVER_DATA_KEY, server)

  const url_string = window.location.href
  const url = new URL(url_string)
  const id = url.searchParams.get('id')
  const name = url.searchParams.get('name')

  game.registry.set(USER_ID_KEY, id || Date.now().toString())
  game.registry.set(USER_NAME_KEY, name || 'Jogador sem nome')

  return game
}

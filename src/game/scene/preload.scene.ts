import Phaser from 'phaser'
import MenuScene from './menu.scene'
import { CHAR_ANIM_DIR_DATA } from '../../const/animation.const';
import { BACK_HOLO_KEY, BIKE_KEY, BOARD_IMAGE_KEY, CHAR_ANIM_KEY, TABLE_KEY, FRONT_HOLO_KEY, TEXT_KEY, DICE_KEY, CREDITS_KEY, CUP_KEY, LOGO_KEY, RED_TABLE_KEY, PATTERN_KEY, BANANA_KEY, CARROT_CAKE_KEY, CHEESE_BREAD_KEY, CHOCOLAT_KEY, FRIES_KEY, IOGURT_KEY, ORANGE_JUICE_KEY, PASTEL_KEY, POPCORN_KEY, SANDWISH_KEY, SODA_KEY, TAPIOCA_KEY, WATER_KEY, COCONUT_KEY, COOKIE_KEY, APPLE_KEY, PIQUENIQUE_TABLE_KEY, CHAIR_KEY, LUCK_CARD_PREFIX, DECISION_CARD_PREFIX } from '../../const/file.const';
import { DECISION_CARDS, LUCK_CARDS } from '../../const/card.const';

export default class PreloadScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'preload-scene'

  constructor () {
    super(PreloadScene.SCENE_KEY);
  }

  preload () {
    this.load.json(TEXT_KEY, 'texts/ptBr.json')
    this.load.spritesheet(CHAR_ANIM_KEY, 'images/character.png', { frameWidth: 150, frameHeight: 220 })
    for (let i = 1; i <= 10; i++) {
      this.load.image(BOARD_IMAGE_KEY + i, `images/board${i}.png`)
    }
    this.load.image(FRONT_HOLO_KEY, 'images/front-hologram.png')
    this.load.image(BACK_HOLO_KEY, 'images/back-hologram.png')
    this.load.image(TABLE_KEY, 'images/table.png')
    this.load.image(RED_TABLE_KEY, 'images/redtable.png')
    this.load.image(CREDITS_KEY, 'images/credits.png')
    this.load.image(CUP_KEY, 'images/cup.png')
    this.load.image(PIQUENIQUE_TABLE_KEY, 'images/piqueniqueTable.png')
    this.load.image(CHAIR_KEY, 'images/chair.png')
    this.load.image(LOGO_KEY, 'images/logo.png')
    this.load.image(PATTERN_KEY, 'images/bgpattern.png')
    this.load.spritesheet(DICE_KEY, 'images/dice.png', { frameWidth: 113, frameHeight: 123 })

    LUCK_CARDS.forEach(card => {
      this.load.image(LUCK_CARD_PREFIX + card.id, `images/cards/luck/${card.id}.png`)
    })

    DECISION_CARDS.forEach(card => {
      this.load.image(DECISION_CARD_PREFIX + card.id + '_1', `images/cards/decision/${card.id}_1.png`)
      this.load.image(DECISION_CARD_PREFIX + card.id + '_2', `images/cards/decision/${card.id}_2.png`)
    })

    this.load.image(BANANA_KEY, 'images/items/banana.png')
    this.load.image(CARROT_CAKE_KEY, 'images/items/carrotCake.png')
    this.load.image(CHEESE_BREAD_KEY, 'images/items/cheeseBread.png')
    this.load.image(CHOCOLAT_KEY, 'images/items/chocolat.png')
    this.load.image(COOKIE_KEY, 'images/items/cookie.png')
    this.load.image(APPLE_KEY, 'images/items/apple.png')
    this.load.image(COCONUT_KEY, 'images/items/coconut.png')
    this.load.image(FRIES_KEY, 'images/items/fries.png')
    this.load.image(IOGURT_KEY, 'images/items/iogurt.png')
    this.load.image(ORANGE_JUICE_KEY, 'images/items/orangeJuice.png')
    this.load.image(PASTEL_KEY, 'images/items/pastel.png')
    this.load.image(POPCORN_KEY, 'images/items/popcorn.png')
    this.load.image(SANDWISH_KEY, 'images/items/sandwish.png')
    this.load.image(SODA_KEY, 'images/items/soda.png')
    this.load.image(TAPIOCA_KEY, 'images/items/tapioca.png')
    this.load.image(WATER_KEY, 'images/items/water.png')
  }

  create () {
    this.createCharacterAnimations()
    this.scene.start(MenuScene.SCENE_KEY)
  }

  createCharacterAnimations () {
    CHAR_ANIM_DIR_DATA.forEach(animData => {
      this.anims.create({
        key: animData.name,
        frames: this.anims.generateFrameNames(CHAR_ANIM_KEY, { start: animData.start, end: animData.end }),
        duration: animData.duration,
        yoyo: animData.yoyo,
        repeat: -1
      })
    })
  }
}

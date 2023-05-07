import { CHAR_ANIM_DIR_DATA, CharAnimDir, CharAnimType } from "../../const/animation.const";
import { CHAR_ANIM_KEY } from "../../const/file.const";
import { STEP_DURATION } from "../../const/game.const";
import { BOARD_MAP } from "../../const/map.const";
import { Vec2 } from "../../model/math.model";
import Player from "../../model/player.model";
import { getAnimDir, makeAnimName } from "../../util/animation.util";
import { getMapPointPosition } from "../../util/map.util";

export default class Character {
  private scene: Phaser.Scene
  public readonly player: Player
  public readonly sprite: Phaser.GameObjects.Sprite
  private currPath: number[]
  private currDir: CharAnimDir
  private currPos: number
  private offset: Vec2

  constructor (scene: Phaser.Scene, player: Player, offset: Vec2) {
    this.scene = scene
    this.player = player
    this.offset = offset

    const startCoord = BOARD_MAP.points[0].coords
    const startPos = getMapPointPosition(startCoord.x, startCoord.y)
    this.currPos = BOARD_MAP.points[0].id
    this.sprite = scene.add.sprite(startPos.x + offset.x, startPos.y + offset.y, CHAR_ANIM_KEY)
      .setOrigin(0.5, 0.82)
      .setScale(2.5)
      .setDepth(startPos.y + offset.y)
      .play('IDLE_SE')
  }

  getId () {
    return this.player.id
  }

  getName () {
    return this.player.name
  }

  startPath (path: number[]) {
    if (!path?.length) return
    this.currPath = path
    this.player.setPos(path[path.length - 1])
    this.step()
  }

  setPos (x: number, y: number) {
    this.sprite.setPosition(x, y)
  }

  step () {
    if (!this.currPath?.length) {
      this.sprite.play(makeAnimName(CharAnimType.IDLE, this.currDir))
      return
    }

    const currPoint = BOARD_MAP.points.find(point => point.id === this.currPos)
    const currCoord = currPoint.coords

    const nextId = this.currPath.splice(0, 1)[0]
    const nextPoint = BOARD_MAP.points.find(point => point.id === nextId)
    if (!nextPoint) return

    const destCoord = nextPoint.coords
    const dest = getMapPointPosition(destCoord.x, destCoord.y)
    this.currPos = nextPoint.id

    this.scene.tweens.add({
      targets: this.sprite,
      x: dest.x + this.offset.x,
      y: dest.y + this.offset.y,
      duration: STEP_DURATION,
      hold: 50,
      onComplete: () => {
        this.sprite.play(makeAnimName(CharAnimType.IDLE, this.currDir))
        this.sprite.setDepth(this.sprite.y + this.offset.y)
        this.step()
      }
    })

    this.currDir = getAnimDir(destCoord.x - currCoord.x, destCoord.y - currCoord.y)

    const animName = makeAnimName(CharAnimType.WALK, this.currDir)
    const animData = CHAR_ANIM_DIR_DATA.find(animData => animData.name === animName)

    if (!animData) return
    this.sprite
      .play(animName, true)
      .setFlipX(animData.flip)
  }
}
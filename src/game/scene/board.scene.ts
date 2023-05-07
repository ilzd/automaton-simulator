import Phaser from 'phaser'
import { BoardMap, MapBounds } from '../../model/map.model';
import { BOARD_MAP, BoardPointType, MAP_POINT_RADIUS, MAP_TILE_SIZE } from '../../const/map.const';
import Character from '../class/character';
import Server from '../../server/server';
import { CAMERA_TRANSITION_DELAY, GameEvents, SERVER_DATA_KEY, STEP_DURATION, USER_ID_KEY, USER_NAME_KEY } from '../../const/game.const';
import Player from '../../model/player.model';
import { ReplaySubject, takeUntil } from 'rxjs';
import { EventAuth, PlayerCreditInfo, CardDecisionInfo, PlayerMoveInfo, RollDiceInfo, WaitingPathInfo, CardConfirmationInfo } from '../../model/events.model';
import DiceScene from './dice.scene';
import { CardConfirmationSceneData, CardDecitionSceneData, DiceSceneData } from '../../model/scene.model';
import { getMapPointPosition } from '../../util/map.util';
import { DecisionCard, LuckCard } from '../../model/card.model';
import CardDecisionScene from './card-decision';
import { BACK_HOLO_KEY, BOARD_IMAGE_KEY, CHAIR_KEY, CUP_KEY, DICE_KEY, FRONT_HOLO_KEY, PATTERN_KEY, PIQUENIQUE_TABLE_KEY } from '../../const/file.const';
import CardConfirmationScene from './card-confirmation';
import HUDScene from './hud.scene';
import { Vec2 } from '../../model/math.model';
import ItemChoiceScene from './item-choice.scene';
import { Item } from '../../model/item.model';
import ItemPurchaseScene from './item-purchase.scene';
import { CHAR_ANIM_DIR_DATA, CharAnimDir, CharAnimType } from '../../const/animation.const';
import { makeAnimName } from '../../util/animation.util';

export default class BoardScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'board-scene'
  private componentDestroyed$: ReplaySubject<unknown>
  public static readonly finalPositions = {
    zoom: 1,
    position: { x: 2200, y: 2110 },
    spots: [
      { x: 2090, y: 2040, dir: CharAnimDir.L, offset: { x: 50, y: 25 } },
      { x: 2000, y: 2105, dir: CharAnimDir.L, offset: { x: 50, y: 25 } },
      { x: 2300, y: 2245, dir: CharAnimDir.O, offset: { x: -60, y: -30 } },
      { x: 2390, y: 2200, dir: CharAnimDir.O, offset: { x: -60, y: -30 } }
    ]
  }

  private text: any
  private map: BoardMap
  private mapBounds: MapBounds
  private character: Character
  private onlineCharacters: Character[]
  private server?: Server
  private ticket: number
  private localAction: boolean
  private holograms: Phaser.GameObjects.Group
  private pointSensors: Phaser.GameObjects.Group
  private background: Phaser.GameObjects.TileSprite
  private lastCameraState: {
    zoom: number
    scrollX: number
    scrollY: number
  }

  constructor () {
    super(BoardScene.SCENE_KEY);
  }

  preload () {
  }

  create () {
    this.componentDestroyed$ = new ReplaySubject(1)
    this.scene.launch(HUDScene.SCENE_KEY)
    this.scene.launch(DiceScene.SCENE_KEY)

    this.text = this.cache.json.get('text')

    this.lastCameraState = {
      zoom: 1,
      scrollX: 0,
      scrollY: 0
    }

    this.holograms = this.add.group()
    this.pointSensors = this.add.group()

    // const userId = this.game.registry.get(USER_ID_KEY)
    // const userName = this.game.registry.get(USER_NAME_KEY)
    // const localPlayer = new Player(userId, userName)
    // this.character = new Character(this, localPlayer)


    this.map = BOARD_MAP
    this.buildBoard()
    this.mapBounds = this.calculateMapBounds(this.map)
    // this.buildMapPoints()

    this.onlineCharacters = []
    this.setupServer()

    this.resetCamera(true)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanUp()
    })

    this.input.on(Phaser.Input.Events.POINTER_MOVE, this.pointerMoveHandler, this)
    // this.game.events.on(GameEvents.REQUEST_ROLL, this.requestDiceRollHandler, this)
    this.game.events.on(GameEvents.REQUEST_CARD_DECISION, this.requestCardDecisionHandler, this)
    this.game.events.on(GameEvents.REQUEST_CARD_CONFIRMATION, this.requestCardConfirmationHandler, this)
    this.game.events.on(GameEvents.REQUEST_ITEM_CHOICE, this.requestItemChoiceHandler, this)
    this.game.events.on(GameEvents.REQUEST_ITEMS_PURCHASE, this.requestItemPurchaseHandler, this)
  }

  update () {
    if (this.checkIfCameraChanged()) {
      this.updateBackground()
    }
  }

  checkIfCameraChanged () {
    const cam = this.cameras.main
    let changed = false
    if (cam.zoom !== this.lastCameraState.zoom ||
      cam.scrollX !== this.lastCameraState.scrollX ||
      cam.scrollY !== this.lastCameraState.scrollY) changed = true

    if (changed) {
      this.lastCameraState.zoom = cam.zoom
      this.lastCameraState.scrollX = cam.scrollX
      this.lastCameraState.scrollY = cam.scrollY
    }

    return changed
  }

  updateBackground () {
    const cam = this.cameras.main

    const dW = cam.width - cam.displayWidth
    const dH = cam.height - cam.displayHeight

    this.background.setPosition(dW / 2, dH / 2)

    this.background.setTilePosition(
      cam.scrollX + dW / 2,
      cam.scrollY + dH / 2
    )
    this.background.setTileScale(cam.zoom)
    this.background.setScale(1 / cam.zoom)
  }

  buildBoard () {
    const gameSize = this.scale.gameSize

    this.background = this.add.tileSprite(0, 0, gameSize.width, gameSize.height, PATTERN_KEY)
    this.background
      .setOrigin(0)
      .setScrollFactor(0)

    const firstPoint = this.map.points[0].coords
    const startPos = getMapPointPosition(firstPoint.x, firstPoint.y)
    for (let i = 0; i < 10; i++) {
      const xStep = (i % 4)
      const yStep = Math.floor(i / 4)
      let x = xStep * 2048
      let y = yStep * 2048
      x -= xStep * 2
      y -= yStep * 2
      if (i > 7) x += 2048
      this.add.image(x + startPos.x, y - startPos.y, BOARD_IMAGE_KEY + (i + 1)).setOrigin(0.935, 0.44)
    }

    this.buildPiqueniqueTable()
  }

  buildPiqueniqueTable () {
    const finalPosition = BoardScene.finalPositions

    this.add.image(finalPosition.position.x, finalPosition.position.y, PIQUENIQUE_TABLE_KEY).setDepth(finalPosition.position.y)

    finalPosition.spots.forEach(spot => {
      this.add.image(spot.x, spot.y, CHAIR_KEY).setDepth(spot.y).setOrigin(0.5, 0.8)
    })
  }

  setupServer () {
    const server = this.game.registry.get(SERVER_DATA_KEY)

    if (!server) return
    this.server = server

    // this.server.addPlayer(new Player(
    //   this.character.getId(),
    //   this.character.getName()
    // ))

    this.server.addPlayer(new Player(
      this.game.registry.get(USER_ID_KEY),
      this.game.registry.get(USER_NAME_KEY)
    ))

    this.server.onWaitingItemChoice().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: () => {
        this.launchItemChoiceScene()
      }
    })

    this.server.onPlayerFinished().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        let char = this.character
        let index = 0

        if (!this.isLocalUser(res.player.id)) {
          const onlineChar = this.onlineCharacters.find(onlineChar => onlineChar.getId() === res.player.id)

          if (!onlineChar) return
          index = 1 + this.onlineCharacters.indexOf(onlineChar)
          char = onlineChar
        }

        const pos = BoardScene.finalPositions.spots[index]
        char.setPos(pos.x + pos.offset.x, pos.y + pos.offset.y)
        const animName = makeAnimName(CharAnimType.SIT, CharAnimDir[pos.dir])
        const animData = CHAR_ANIM_DIR_DATA.find(animData => animData.name === animName)
        char.sprite
          .play(makeAnimName(CharAnimType.SIT, CharAnimDir[pos.dir]))
          .setDepth(pos.y + 1)
          .setFlipX(animData.flip)
          .setScale(2)
      }
    })

    this.server.onPlayerWon().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        if (this.isLocalUser(res.player.id)) this.scene.stop(ItemPurchaseScene.SCENE_KEY)
      }
    })

    this.server.onAllPlayersFinished().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        this.focusFinalPosition()
      }
    })

    this.server.onWaitingItemsPurchase().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        const userId = this.game.registry.get(USER_ID_KEY)
        let player = res.players.find(player => player.id === userId)
        this.launchItemPurchaseScene(player)
      }
    })

    this.server.onStartMatch().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        this.scene.stop(ItemChoiceScene.SCENE_KEY)
        const players = res.players
        players.forEach((player, index) => {
          const newPlayer = new Player(player.id, player.name)
          const offset = this.getCharacterOffset(index, players.length)

          if (this.isLocalUser(newPlayer.id)) {
            this.character = new Character(this, newPlayer, offset)
            return
          }

          this.onlineCharacters.push(new Character(this, newPlayer, offset))
        })
      }
    })

    this.server.onEndMatch().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        this.createFinalRanking(res.players)
      }
    })

    // this.server.onWaitingDiceRoll().pipe(takeUntil(this.componentDestroyed$)).subscribe({
    //   next: (res) => {
    //     this.checkAuth(res)
    //     this.launchDiceScene()
    //   }
    // })

    this.server.onWaitingCardDecision().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        this.checkAuth(res.auth)
        this.launchCardDecisionScene(res.decisionCard)
      }
    })

    this.server.onWaitingCardConfirmation().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        this.checkAuth(res.auth)
        this.launchCardConfirmationScene(res.luckCard)
      }
    })

    // this.server.onDiceRoll().pipe(takeUntil(this.componentDestroyed$)).subscribe({
    //   next: (res) => {
    //     this.game.events.emit(GameEvents.DICE_VALUE, res.value)
    //   }
    // })

    this.server.onPlayerCreditsUpdate().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        if (res.player.id === this.character.getId()) this.character.player.setCredits(res.credits)
      }
    })

    this.server.onEndTurn().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: () => {
        this.scene.stop(CardDecisionScene.SCENE_KEY)
        this.scene.stop(CardConfirmationScene.SCENE_KEY)
        this.resetCamera()
      }
    })

    this.server.onPlayerMove().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        // this.scene.stop(DiceScene.SCENE_KEY)
        this.scene.stop(CardDecisionScene.SCENE_KEY)
        this.clearHolograms()
        this.clearPointSensors()

        let characterToMove: Character
        if (res.player.id === this.character.getId()) {
          characterToMove = this.character
        } else {
          characterToMove = this.onlineCharacters.find(char => res.player.id === char.getId())
        }

        if (characterToMove) this.startMovingPlayer(characterToMove, res.path)
      }
    })

    this.server.onWaitingPath().pipe(takeUntil(this.componentDestroyed$)).subscribe({
      next: (res) => {
        // this.scene.stop(DiceScene.SCENE_KEY)
        this.scene.stop(CardDecisionScene.SCENE_KEY)
        this.checkAuth(res.auth)
        const paths = res.paths
        if (!paths?.length) return

        paths.forEach(path => {
          const destIndex = path[path.length - 1]
          const destPoint = BOARD_MAP.points.find(point => point.id === destIndex)
          if (!destPoint) return
          const destCoord = destPoint.coords
          const destPos = getMapPointPosition(destCoord.x, destCoord.y)
          this.createHologram(destPos.x, destPos.y)
          if (!this.localAction) return
          this.createPointSensor(destPos.x, destPos.y, () => {
            this.server.choosePath(this.ticket, path)
          })
        })
        if (this.localAction) this.highlightDecision()
      }
    })

    this.server.startPreparation()
  }

  checkAuth (auth: EventAuth) {
    this.localAction = auth.player.id === this.character.getId()
    if (this.localAction) this.ticket = auth.ticket
  }

  isLocalUser (id: string) {
    const localUserId = this.registry.get(USER_ID_KEY)
    return id === localUserId
  }

  getCharacterOffset (index: number, total: number) {
    const offset: Vec2 = {
      x: 0,
      y: 0,
    }

    if (total === 2) {
      offset.x = MAP_TILE_SIZE * (index === 0 ? -1 : 1)
    } else if (total === 3) {
      if (index !== 2) {
        offset.x = MAP_TILE_SIZE * (index === 0 ? -1 : 1)
      } else {
        offset.y -= MAP_TILE_SIZE * 0.75
      }
    } else if (total === 4) {
      if (index < 2) {
        offset.x = MAP_TILE_SIZE * (index === 0 ? -1 : 1)
      } else {
        offset.y = MAP_TILE_SIZE * (index === 2 ? -1 : 1) * 0.75
      }
    }

    return offset
  }

  // launchDiceScene () {
  //   const diceSceneData: DiceSceneData = {
  //     localAction: this.localAction
  //   }

  //   this.scene.launch(DiceScene.SCENE_KEY, diceSceneData)
  // }

  launchItemChoiceScene () {
    this.scene.launch(ItemChoiceScene.SCENE_KEY)
  }

  launchItemPurchaseScene (player: Player) {
    this.scene.launch(ItemPurchaseScene.SCENE_KEY, { player })
  }

  launchCardDecisionScene (decisionCard: DecisionCard) {
    const cardDecisionSceneData: CardDecitionSceneData = {
      localAction: this.localAction,
      decisionCard: decisionCard
    }

    this.scene.launch(CardDecisionScene.SCENE_KEY, cardDecisionSceneData)
  }

  launchCardConfirmationScene (luckCard: LuckCard) {
    const cardConfirmationSceneData: CardConfirmationSceneData = {
      localAction: this.localAction,
      luckCard: luckCard
    }

    this.scene.launch(CardConfirmationScene.SCENE_KEY, cardConfirmationSceneData)
  }

  buildMapPoints () {
    this.map.points.forEach((point) => {
      const pointPos = getMapPointPosition(point.coords.x, point.coords.y)
      this.add.circle(pointPos.x, pointPos.y, MAP_POINT_RADIUS).setStrokeStyle(3, 0x000000, 0.5)
      const type = point.type === BoardPointType.DECISION ? 'D' : (point.type === BoardPointType.LUCK ? 'L' : 'N')
      this.add.text(pointPos.x, pointPos.y, `${point.id}\n${type}`, {
        fontSize: '50px',
        stroke: '#000000',
        strokeThickness: 5
      }).setOrigin(0.5)
      const nextPoints = this.map.points.filter(nextPoint => nextPoint.prev.includes(point.id))
      nextPoints.forEach(nextPoint => {
        const nextPointPos = getMapPointPosition(nextPoint.coords.x, nextPoint.coords.y)
        const deltaX = nextPointPos.x - pointPos.x
        const deltaY = nextPointPos.y - pointPos.y
        const dir = new Phaser.Math.Vector2(deltaX, deltaY).normalize()
        const startX = pointPos.x + dir.x * MAP_POINT_RADIUS
        const startY = pointPos.y + dir.y * MAP_POINT_RADIUS
        const endX = nextPointPos.x - dir.x * MAP_POINT_RADIUS
        const endY = nextPointPos.y - dir.y * MAP_POINT_RADIUS
        this.add.line(0, 0, startX, startY, endX, endY, 0x000000, 0.5).setOrigin(0).setLineWidth(5)
      })
    })
  }

  pointerMoveHandler (pointer: Phaser.Input.Pointer) {
    // if (pointer.isDown) {
    //   this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom
    //   this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom
    // }
  }

  // requestDiceRollHandler () {
  //   this.server.rollDice(this.ticket)
  // }

  requestCardDecisionHandler (option: number) {
    this.server.chooseCardOption(this.ticket, option)
  }

  requestCardConfirmationHandler (option: number) {
    this.server.confirmLuckCard(this.ticket)
  }

  requestItemChoiceHandler (items: Item[]) {
    const userId = this.game.registry.get(USER_ID_KEY)
    this.server.chooseItems(userId, items)
  }

  requestItemPurchaseHandler () {
    const userId = this.game.registry.get(USER_ID_KEY)
    this.server.purchaseItems(userId)
  }

  createHologram (x: number, y: number) {
    const frontHolo = this.holograms.get() as Phaser.GameObjects.Sprite
    frontHolo
      .setActive(true)
      .setPosition(x, y + MAP_TILE_SIZE)
      .setVisible(true)
      .setTexture(FRONT_HOLO_KEY)
      .setOrigin(0.5, 0.91)
      .setScale(1.5)
    frontHolo.setDepth(frontHolo.y)

    const backHolo = this.holograms.get() as Phaser.GameObjects.Sprite
    backHolo
      .setActive(true)
      .setPosition(x, y - MAP_TILE_SIZE - 15)
      .setVisible(true)
      .setTexture(BACK_HOLO_KEY)
      .setOrigin(0.5, 0.68)
      .setScale(1.5)
    backHolo.setDepth(backHolo.y)

    if (!this.localAction) return

    this.tweens.add({
      targets: [frontHolo, backHolo],
      alpha: { from: 1, to: 0.5 },
      duration: 700,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true
    })
  }

  clearHolograms () {
    const holograms = this.holograms.getChildren()

    this.tweens.killTweensOf(holograms)

    holograms.forEach(hologram => {
      this.holograms.killAndHide(hologram)
    })
  }

  createPointSensor (x: number, y: number, callback: Function) {
    const sensor = this.add.circle(x, y, MAP_POINT_RADIUS, 0xFF0000, 0)
    sensor.setInteractive()
      .on(Phaser.Input.Events.POINTER_DOWN, () => { callback() })
    this.pointSensors.add(sensor)
  }

  clearPointSensors () {
    this.pointSensors.clear(true, true)
  }

  startMovingPlayer (character: Character, path: number[]) {
    if (!this.isLocalUser(character.getId())) {
      character.startPath(path)
      return
    }
    this.cameras.main.pan(character.sprite.x, character.sprite.y, CAMERA_TRANSITION_DELAY, Phaser.Math.Easing.Sine.InOut, true)
    this.cameras.main.zoomTo(1, CAMERA_TRANSITION_DELAY, Phaser.Math.Easing.Sine.InOut, true, (cam: Phaser.Cameras.Scene2D.BaseCamera, progress: number) => {
      if (progress === 1) {
        this.cameras.main.startFollow(character.sprite, false, 0.1)
        character.startPath(path)
      }
    })
  }

  highlightDecision () {
    const holograms = this.holograms.getChildren().filter(hologram => hologram.active)
    const xArr = holograms.map((hologram: Phaser.GameObjects.Sprite) => hologram.x)
    const yArr = holograms.map((hologram: Phaser.GameObjects.Sprite) => hologram.y)
    let x = xArr.reduce((acc, curr) => acc + curr, 0) / xArr.length
    let y = yArr.reduce((acc, curr) => acc + curr, 0) / yArr.length

    const gameSize = this.scale.gameSize
    const hightlightWidth = (Math.max(...xArr) - Math.min(...xArr)) * 2
    const hightlightHeight = (Math.max(...yArr) - Math.min(...yArr)) * 2
    let zoom = Math.min(gameSize.width / hightlightWidth, gameSize.height / hightlightHeight, 1)

    this.cameras.main.pan(x, y, CAMERA_TRANSITION_DELAY, Phaser.Math.Easing.Sine.InOut, true)
    this.cameras.main.zoomTo(zoom, CAMERA_TRANSITION_DELAY, Phaser.Math.Easing.Sine.In, true)
  }

  resetCamera (instant?: boolean) {
    this.cameras.main.stopFollow()
    const gameSize = this.scale.gameSize
    const width = (this.mapBounds.right - this.mapBounds.left) + 400
    const height = (this.mapBounds.bottom - this.mapBounds.top) + 800
    const zoom = Math.min(gameSize.width / width, gameSize.height / height)

    if (instant) {
      this.cameras.main.centerOn(this.mapBounds.center.x, this.mapBounds.center.y)
      this.cameras.main.setZoom(zoom)
      return
    }
    this.cameras.main.pan(this.mapBounds.center.x, this.mapBounds.center.y, CAMERA_TRANSITION_DELAY, Phaser.Math.Easing.Sine.InOut, true)
    this.cameras.main.zoomTo(zoom, CAMERA_TRANSITION_DELAY, Phaser.Math.Easing.Sine.InOut, true)
  }

  calculateMapBounds (map: BoardMap) {
    const posArr = map.points.map(point => getMapPointPosition(point.coords.x, point.coords.y))
    const xArr = posArr.map(pos => pos.x)
    const yArr = posArr.map(pos => pos.y)

    const minX = Math.min(...xArr)
    const maxX = Math.max(...xArr)
    const minY = Math.min(...yArr)
    const maxY = Math.max(...yArr)
    const midX = (maxX + minX) / 2
    const midY = (maxY + minY) / 2
    const bounds: MapBounds = {
      left: minX,
      right: maxX,
      top: minY,
      bottom: maxY,
      center: { x: midX, y: midY }
    }

    return bounds
  }

  focusFinalPosition () {
    const pos = BoardScene.finalPositions.position
    const zoom = BoardScene.finalPositions.zoom
    this.cameras.main.pan(pos.x, pos.y, CAMERA_TRANSITION_DELAY, Phaser.Math.Easing.Sine.InOut, true)
    this.cameras.main.zoomTo(zoom, CAMERA_TRANSITION_DELAY, Phaser.Math.Easing.Sine.In, true)
  }

  createFinalRanking (players: Player[]) {
    players.forEach(player => {
      let char = this.character

      if (!this.isLocalUser(player.id)) {
        char = this.onlineCharacters.find(onlineChar => onlineChar.getId() === player.id)
      }

      if (!char) return

      const background = this.add.rexRoundRectangle(
        0, 0, 250, 50, 10, 0x000000, 0.75
      )

      const credits = this.add.text(75, 0, `$${player.getCredits()}`, {
        fontSize: '35px',
        strokeThickness: 2,
        stroke: '#000000'
      }).setOrigin(0.5)

      const cup = this.add.image(-75, 0, CUP_KEY).setScale(0.75)
      const rank = this.add.text(-25, 0, `#${player.getRanking()}`, {
        fontSize: '35px',
        strokeThickness: 2,
        stroke: '#000000'
      }).setOrigin(0.5)

      if (player.getRanking() === 1) {
        this.tweens.add({
          targets: cup,
          scale: 1.1,
          angle: { from: -5, to: 5 },
          yoyo: true,
          duration: 500,
          repeat: -1,
          ease: Phaser.Math.Easing.Sine.InOut
        })
      }

      this.add.container(char.sprite.x, char.sprite.y - 350, [background, credits, cup, rank]).setDepth(char.sprite.y + 1)
    })
  }

  cleanUp () {
    this.componentDestroyed$?.next(true)
    this.componentDestroyed$?.complete()
    this.componentDestroyed$ = undefined

    this.input.off(Phaser.Input.Events.POINTER_MOVE, this.pointerMoveHandler, this)
    // this.game.events.off(GameEvents.REQUEST_ROLL, this.requestDiceRollHandler, this)
    this.game.events.off(GameEvents.REQUEST_CARD_DECISION, this.requestCardDecisionHandler, this)
    this.game.events.off(GameEvents.REQUEST_CARD_CONFIRMATION, this.requestCardConfirmationHandler, this)
    this.game.events.off(GameEvents.REQUEST_ITEM_CHOICE, this.requestItemChoiceHandler, this)
    this.game.events.off(GameEvents.REQUEST_ITEMS_PURCHASE, this.requestItemPurchaseHandler, this)

    this.text = undefined
    this.map = undefined
    this.mapBounds = undefined
    this.character = undefined
    this.onlineCharacters = undefined
    this.server = undefined
    this.ticket = undefined
    this.localAction = undefined
    this.holograms = undefined
    this.pointSensors = undefined
    this.background = undefined
    this.lastCameraState = undefined
  }
}

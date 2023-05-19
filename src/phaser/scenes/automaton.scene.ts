import Automaton from "../../model/automaton"
import DFA from "../../model/dfa"
import NFA from "../../model/nfa"
import State from "../../model/state"
import { AutomatonEvents } from "../const/events.const"
import { GRID_COLOR, GRID_LINE_ALPHA, GRID_LINE_WIDTH } from "../const/grid.const"
import { STATE_BORDER_COLOR, STATE_BORDER_WIDTH, STATE_COLOR, STATE_DATA_KEY, STATE_DRAG_KEY, STATE_NAME_COLOR, STATE_NAME_FONT_SIZE, STATE_NAME_STROKE_COLOR, STATE_NAME_STROKE_WIDTH, STATE_OPTIONT_RADIUS, STATE_RADIUS, STATE_REMOVE_OFFSET } from "../const/state.const"
import HUDScene from "./hud.scene"

export default class AutomatonScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'automaton-scene'

  private grid: Phaser.GameObjects.Graphics

  private stateViews: Phaser.GameObjects.Group
  private transitions: Phaser.GameObjects.Group

  private dfa: DFA
  private nfa: NFA
  private currAutomaton: Automaton

  constructor () {
    super(AutomatonScene.SCENE_KEY)
  }

  preload () {
  }

  create () {
    this.createGrid()

    this.stateViews = this.add.group()
    this.transitions = this.add.group()
    this.dfa = new DFA()
    this.dfa.addState()

    this.nfa = new NFA()
    this.nfa.addState()

    this.selectAutomaton(this.dfa)

    this.scene.launch(HUDScene.SCENE_KEY)

    this.setupEvents()

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanUp()
    })
  }

  setupEvents () {
    this.game.events.on(AutomatonEvents.ADD_STATE, this.addState, this)
  }

  clearEvents () {
    this.game.events.off(AutomatonEvents.ADD_STATE, this.addState, this)
  }

  createGrid () {
    const grid = this.add.graphics()
      .lineStyle(GRID_LINE_WIDTH, GRID_COLOR, GRID_LINE_ALPHA)

    const cellSize = 100
    const gameSize = this.scale.gameSize

    grid.beginPath()
    for (let x = 0; x <= gameSize.width; x += cellSize) {
      grid.moveTo(x, 0)
      grid.lineTo(x, gameSize.height)
    }
    for (let y = 0; y <= gameSize.height; y += cellSize) {
      grid.moveTo(0, y)
      grid.lineTo(gameSize.width, y)
    }
    grid.strokePath()
  }

  updateAutomatonView () {

  }

  selectAutomaton (automaton: Automaton) {
    this.currAutomaton = automaton

    this.resetViews()
    this.buildViews()
  }

  addState (state?: State) {
    const newState = state || this.currAutomaton.addState()

    const stateView = this.buildStateView(newState)
    this.stateViews.add(stateView)
  }

  buildStateView (state: State) {
    const gameSize = this.scale.gameSize
    const stateCircle = this.add.circle(0, 0, STATE_RADIUS, STATE_COLOR)
    stateCircle.setStrokeStyle(STATE_BORDER_WIDTH, STATE_BORDER_COLOR)

    const stateName = this.add.text(0, 0, state.name, {
      color: STATE_NAME_COLOR,
      fontSize: STATE_NAME_FONT_SIZE,
      strokeThickness: STATE_NAME_STROKE_WIDTH,
      stroke: STATE_NAME_STROKE_COLOR
    }).setOrigin(0.5)

    const removeButton = this.add.circle(STATE_REMOVE_OFFSET.x, STATE_REMOVE_OFFSET.y, STATE_OPTIONT_RADIUS, 0xFF0000)
    removeButton
      .setVisible(false)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
      })

    const showOptions = () => {
      removeButton.setVisible(true)
    }

    const hideOptions = () => {
      removeButton.setVisible(false)
    }

    const toggleOptions = () => {
      removeButton.setVisible(!removeButton.visible)
    }

    const stateView = this.add.container(gameSize.width * 0.5, gameSize.height * 0.5, [
      stateCircle,
      stateName,
      removeButton
    ])

    const hitArea = new Phaser.Geom.Circle(0, 0, STATE_RADIUS)

    stateView
      .setInteractive({
        hitArea: hitArea,
        hitAreaCallback: Phaser.Geom.Circle.Contains,
        draggable: true,
        useHandCursor: true
      })
      .on(Phaser.Input.Events.POINTER_OVER, () => {
        hitArea.radius = STATE_RADIUS + (STATE_OPTIONT_RADIUS * 2)
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        hitArea.radius = STATE_RADIUS
      })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        stateView.removeFromDisplayList()
        stateView.addToDisplayList()
      })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        const wasDragged = stateView.getData(STATE_DRAG_KEY)
        if (!wasDragged) toggleOptions()
        stateView.setData(STATE_DRAG_KEY, false)
      })
      .on(Phaser.Input.Events.DRAG, (pointer: Phaser.Input.Pointer) => {
        const deltaPos = pointer.position.clone().subtract(pointer.prevPosition)
        const zoom = this.cameras.main.zoom
        stateView.x += deltaPos.x / zoom
        stateView.y += deltaPos.y / zoom
        stateView.setData(STATE_DRAG_KEY, true)
        hideOptions()
      })

    stateView.setData(STATE_DATA_KEY, state)

    return stateView
  }

  resetViews () {
    this.stateViews.destroy(true, true)
    this.stateViews = this.add.group()

    this.transitions.destroy(true, true)
    this.transitions = this.add.group()
  }

  buildViews () {
    const states = this.currAutomaton.states
    states.forEach(state => this.addState(state))
  }

  cleanUp () {
    this.grid = undefined
    this.dfa = undefined
    this.nfa = undefined
    this.stateViews = undefined
    this.transitions = undefined
    this.currAutomaton = undefined

    this.clearEvents()
  }
}
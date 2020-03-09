import * as Phaser from 'phaser';
import { GameEvent } from '../utils/gameEvent';
import TransitionData from './transitionData';
import Player from '../objects/player';
import TilemapHelper from '../utils/tiled/tilemapHelper';
import SceneKey from './sceneKey';

export default abstract class BaseScene extends Phaser.Scene {
  private customUpdateList: Phaser.GameObjects.GameObject[] = [];

  protected player: Player;
  protected cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  /**
   * Data from the scene it is transitioning from.
   *
   * Note that this resolves to an empty object {} for the first scene started.
   */
  protected transitionData: TransitionData;

  /**
   * Scene tile map.
   *
   * This should be assigned in the Scene's create method.
   */
  protected map: Phaser.Tilemaps.Tilemap;

  /**
   * The scene's unique identifier.
   */
  key: SceneKey;

  constructor(key: SceneKey, config?: Phaser.Types.Scenes.SettingsConfig) {
    super({ key, ...config });
    this.key = key;
  }

  /**
   * Child scenes overridding this method should call it before anything else.
   */
  init(data: TransitionData) {
    console.log(`Initializing ${this.key}`);
    this.transitionData = data;

    this.load.addListener('progress', () => {
      const progress = this.load.progress;
      if (!isNaN(progress)) {
        // TODO: 2020-02-05 Blockost Maybe add a progress bar somewhere?
        console.log(`Progress: ${progress * 100}%`);
      }
    });

    // Add listeners for custom objects to be updated and destroyed
    this.events.on(GameEvent.NEW_OBJECT_TO_UPDATE, (object: Phaser.GameObjects.GameObject) => {
      this.customUpdateList.push(object);
    });

    this.events.on(GameEvent.OBJECT_DESTROYED, (object: Phaser.GameObjects.GameObject) => {
      this.customUpdateList.splice(this.customUpdateList.indexOf(object), 1);
    });

    this.events.on(GameEvent.SCENE_SLEEP, this.onSceneSleep.bind(this));
    this.events.on(GameEvent.SCENE_WAKE, this.onSceneWake.bind(this));
  }

  /**
   * Child scenes overridding this method should call it before anything else.
   */
  preload() {}

  /**
   * Child scenes overridding this method should call it before anything else.
   */
  create() {
    console.log(`Creating ${this.key}`);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  /**
   * Child scenes overridding this method should call it before anything else.
   *
   * @param time the current time. Either a High Resolution Timer value if it comes from Request Animation
   * Frame, or Date.now using SetTimeout.
   * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based
   *  on the FPS rate.
   */
  update(time: number, delta: number) {
    this.customUpdateList.forEach((object) => object.update(time, delta));
  }

  protected onSceneSleep() {
    console.log(`${this.key} is sleeping...`);
    this.input.keyboard.resetKeys();
  }

  protected onSceneWake(systems: Phaser.Scenes.Systems, data: TransitionData) {
    console.log(`${this.key} is waking up`, data);
    const spawnPoint = TilemapHelper.getSpawnPoint(this.map, data.targetSpawnPointName);
    this.player.spawnAt(spawnPoint);
  }
}

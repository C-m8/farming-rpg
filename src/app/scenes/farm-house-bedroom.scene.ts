import BaseScene from './base.scene';
import SceneKey from './sceneKey';
import Player from '../objects/characters/player';
import { SkinPalette, HairPalette, HairStyle, Gender } from '../utils/colorPaletteUtil';
import GameConfig from '../utils/gameConfig';
import Map from '../utils/map';
import { getLocaleWeekEndRange } from '@angular/common';

const MAP_KEY = 'map_farm_house_bedroom';

export default class FarmHouseBedroomScene extends BaseScene {
  constructor() {
    super(SceneKey.FarmHouseBedroom, MAP_KEY);
  }

  preload() {
    super.preload();

    this.load.tilemapTiledJSON(this.mapKey, '/assets/tilemaps/farm_house_bedroom.json');
    this.load.image('interior', '/assets/spritesheets/tiled/interior.png');
  }

  create() {
    super.create();

    // Create world from tilemap
    this.map = new Map(this, this.player);

    // Retrieve player spawn point
    const spawnPointName = this.transitionData.targetSpawnPointName;
    const playerSpawnPoint = this.map.getSpawnPoint(spawnPointName);
    this.player.spawnAt(playerSpawnPoint);

    // configure camera
    this.cameras.main
      .startFollow(this.player.getSprite())
      .setBounds(
        0,
        0,
        this.map.getWidth() * GameConfig.map.tileSize.width,
        this.map.getHeight() * GameConfig.map.tileSize.height
      )
      .setZoom(2);
  }
}

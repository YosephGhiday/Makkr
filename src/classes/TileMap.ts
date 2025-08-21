import { GrassTile, Platform, type Tile } from "./Tile.ts";
import { Vector2 } from "./Vector2.ts";

interface TileMapOptions {
  tiles: Tile[];
}

export class TileMap {
  tiles: Tile[];

  constructor({ tiles }: TileMapOptions) {
    this.tiles = tiles;
  }

  drawAllImages(ctx: CanvasRenderingContext2D) {
    this.tiles.forEach((tile) => {
      tile.drawImage(ctx, tile.positionInMap.x, tile.positionInMap.y);
    });
  }
}

export const map1 = new TileMap({
  tiles: [
    new GrassTile(new Vector2(0, 408)),
    new GrassTile(new Vector2(90, 408)),
    new GrassTile(new Vector2(180, 408)),
    new GrassTile(new Vector2(400, 408)),
    new GrassTile(new Vector2(490, 408)),
    new GrassTile(new Vector2(710, 408)),
    new Platform(new Vector2(500, 200)),
    new Platform(new Vector2(200, 200)),
  ],
});

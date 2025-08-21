import { type SpriteOptions, Sprite } from "./Sprite.ts";
import { Vector2 } from "./Vector2.ts";
import { resources } from "./Resources.ts";

interface TileOptions {
  frameSize: Vector2;
  scale: number;
  position: Vector2;
  resource: { image: HTMLImageElement; isLoaded: boolean };
  tilePositionOnSpriteSheet: Vector2;
  positionInMap: Vector2;
}

export class Tile extends Sprite {
  tilePositionOnSpriteSheet: Vector2;
  positionInMap;

  constructor({
    frameSize,
    scale,
    position,
    resource,
    tilePositionOnSpriteSheet,
    positionInMap,
  }: TileOptions) {
    super({
      frameSize: frameSize,
      vFrames: 1,
      frame: 1,
      hFrames: 1,
      scale: scale,
      position: position,
      resource: resource,
    } as SpriteOptions);
    this.tilePositionOnSpriteSheet = tilePositionOnSpriteSheet;
    this.positionInMap = positionInMap;
  }

  drawImage(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    if (!this.resource.isLoaded) {
      return;
    }

    let frameCoordX = this.tilePositionOnSpriteSheet.x;
    let frameCoordY = this.tilePositionOnSpriteSheet.y;

    const frameSizeX = this.frameSize.x;
    const frameSizeY = this.frameSize.y;

    ctx.drawImage(
      this.resource.image,
      frameCoordX,
      frameCoordY,
      frameSizeX,
      frameSizeY,
      x,
      y,
      frameSizeX * this.scale,
      frameSizeY * this.scale
    );
  }
}

export class GrassTile extends Tile {
  constructor(positionInMap: Vector2) {
    super({
      frameSize: new Vector2(32, 32),
      position: positionInMap,
      resource: resources.images.terrain,
      scale: 3,
      tilePositionOnSpriteSheet: new Vector2(100, 2),
      positionInMap: positionInMap,
    });
  }
}

export class Platform extends Tile {
  constructor(positionInMap: Vector2) {
    super({
      frameSize: new Vector2(50, 16),
      position: positionInMap,
      resource: resources.images.terrain,
      scale: 3,
      tilePositionOnSpriteSheet: new Vector2(190, 0),
      positionInMap: positionInMap,
    });
  }
}

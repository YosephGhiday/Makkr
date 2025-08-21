import { Vector2 } from "./Vector2.ts";
import { resources } from "./Resources.ts";
import { type SpriteOptions, Sprite } from "./Sprite.ts";

interface TrashOptions {
  frameSize: Vector2;
  scale: number;
  position: Vector2;
  positionInSpriteSheet: Vector2;
  resource: {
    image: HTMLImageElement;
    isLoaded: boolean;
  };
}

export class Trash extends Sprite {
  type = "TRASH";
  positionInSpriteSheet;
  constructor({
    frameSize,
    scale,
    position,
    resource,
    positionInSpriteSheet,
  }: TrashOptions) {
    super({
      frameSize: frameSize,
      vFrames: 1,
      frame: 1,
      scale: scale,
      position: position,
      resource: resource,
      hFrames: 1,
    } as SpriteOptions);
    this.positionInSpriteSheet = positionInSpriteSheet;
    this.buildFrameMap();
  }

  drawImage(ctx: CanvasRenderingContext2D) {
    if (!this.resource.isLoaded) {
      return;
    }

    let frameCoordX = this.positionInSpriteSheet.x;
    let frameCoordY = this.positionInSpriteSheet.y;

    const frameSizeX = this.frameSize.x;
    const frameSizeY = this.frameSize.y;

    ctx.drawImage(
      this.resource.image,
      frameCoordX,
      frameCoordY,
      frameSizeX,
      frameSizeY,
      this.position.x,
      this.position.y,
      frameSizeX * this.scale,
      frameSizeY * this.scale
    );
  }

  fall() {
    this.position = new Vector2(this.position.x, this.position.y + 3);
  }
}

const Trash1 = new Trash({
  resource: resources.images.trash,
  frameSize: new Vector2(32, 32),
  scale: 2,
  position: new Vector2(0, 0),
  positionInSpriteSheet: new Vector2(64, 0),
});

const Trash2 = new Trash({
  resource: resources.images.trash,
  frameSize: new Vector2(32, 32),
  scale: 2,
  position: new Vector2(0, 0),
  positionInSpriteSheet: new Vector2(0, 0),
});

const Trash3 = new Trash({
  resource: resources.images.trash,
  frameSize: new Vector2(32, 32),
  scale: 2,
  position: new Vector2(0, 0),
  positionInSpriteSheet: new Vector2(32, 0),
});

export const Trashes = [Trash1, Trash2, Trash3];

import { Vector2 } from "./Vector2.ts";
import { resources } from "./Resources.ts";
import { type SpriteOptions, Sprite } from "./Sprite.ts";

interface CakeOptions {
  frameSize: Vector2;
  scale: number;
  position: Vector2;
  positionInSpriteSheet: Vector2;
  resource: {
    image: HTMLImageElement;
    isLoaded: boolean;
  };
}

export class Cake extends Sprite {
  type = "CAKE";
  positionInSpriteSheet;
  constructor({
    frameSize,
    scale,
    position,
    resource,
    positionInSpriteSheet,
  }: CakeOptions) {
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

export const Cake1 = new Cake({
  resource: resources.images.cakes,
  frameSize: new Vector2(64, 32),
  scale: 2,
  position: new Vector2(0, 0),
  positionInSpriteSheet: new Vector2(32, 32),
});

const Cake2 = new Cake({
  resource: resources.images.cakes,
  frameSize: new Vector2(32, 32),
  scale: 2,
  position: new Vector2(0, 0),
  positionInSpriteSheet: new Vector2(0, 0),
});

const Cake3 = new Cake({
  resource: resources.images.cakes,
  frameSize: new Vector2(32, 32),
  scale: 2,
  position: new Vector2(0, 0),
  positionInSpriteSheet: new Vector2(0, 32),
});

const Cake4 = new Cake({
  resource: resources.images.cakes,
  frameSize: new Vector2(32, 32),
  scale: 2,
  position: new Vector2(0, 0),
  positionInSpriteSheet: new Vector2(32, 32),
});

const Cake5 = new Cake({
  resource: resources.images.cakes,
  frameSize: new Vector2(32, 32),
  scale: 2,
  position: new Vector2(0, 0),
  positionInSpriteSheet: new Vector2(96, 0),
});

const Cake6 = new Cake({
  resource: resources.images.cakes,
  frameSize: new Vector2(32, 32),
  scale: 2,
  position: new Vector2(0, 0),
  positionInSpriteSheet: new Vector2(96, 32),
});

const Cake7 = new Cake({
  resource: resources.images.cakes,
  frameSize: new Vector2(32, 32),
  scale: 2,
  position: new Vector2(0, 0),
  positionInSpriteSheet: new Vector2(128, 0),
});

const Cake8 = new Cake({
  resource: resources.images.cakes,
  frameSize: new Vector2(32, 32),
  scale: 2,
  position: new Vector2(0, 0),
  positionInSpriteSheet: new Vector2(128, 32),
});

export const Cakes = [Cake1, Cake2, Cake3, Cake4, Cake5, Cake6, Cake7, Cake8];

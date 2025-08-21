import { Vector2 } from "./Vector2.js";

export interface SpriteOptions {
  resource: { image: HTMLImageElement; isLoaded: boolean };
  frameSize?: Vector2;
  hFrames?: number;
  vFrames?: number;
  frame?: number;
  scale?: number;
  position?: Vector2;
}

export class Sprite {
  resource: { image: HTMLImageElement; isLoaded: boolean };
  frameSize: Vector2;
  hFrames: number;
  vFrames: number;
  frame: number;
  scale: number;
  frameMap: Map<number, Vector2>;
  position: Vector2;

  constructor({
    resource,
    frameSize,
    hFrames,
    vFrames,
    frame,
    scale,
    position,
  }: SpriteOptions) {
    this.resource = resource;
    this.frameSize = frameSize ?? new Vector2(32, 32);
    this.hFrames = hFrames ?? 1;
    this.vFrames = vFrames ?? 1;
    this.frame = frame ?? 0;
    this.scale = scale ?? 1;
    this.frameMap = new Map<number, Vector2>();
    this.position = position ?? new Vector2(0, 0);
  }

  buildFrameMap(): void {
    let frameCount = 0;
    for (let i = 0; i < this.hFrames; i++) {
      this.frameMap.set(frameCount, new Vector2(this.frameSize.x * i, 0));
      frameCount++;
    }
  }

  drawImage(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    if (!this.resource.isLoaded) {
      return;
    }

    let frameCoordX = 0;
    let frameCoordY = 0;
    const frame = this.frameMap.get(this.frame);
    if (frame) {
      frameCoordX = frame.x;
      frameCoordY = frame.y;
    }

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

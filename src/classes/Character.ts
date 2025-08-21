import { Vector2 } from "./Vector2.ts";
import { resources } from "./Resources.ts";
import { type SpriteOptions, Sprite } from "./Sprite.ts";

interface CharacterOptions {
  frameSize: Vector2;
  scale: number;
  position: Vector2;
  resource: {
    image: HTMLImageElement;
    isLoaded: boolean;
  };
  hFrames: number;
}

type CharacterState =
  | "running"
  | "idle"
  | "jumping"
  | "falling"
  | "double_jumping";

export class Character extends Sprite {
  constructor({
    frameSize,
    scale,
    position,
    resource,
    hFrames,
  }: CharacterOptions) {
    super({
      frameSize: frameSize,
      vFrames: 1,
      frame: 1,
      scale: scale,
      position: position,
      resource: resource,
      hFrames: hFrames,
    } as SpriteOptions);
    this.buildFrameMap();
  }

  state: CharacterState = "falling";
  facingDirection: "right" | "left" = "right";
  moveSpeed = 8;
  hasJumpedTwice = false;

  animate() {
    setInterval(() => {
      this.frame++;
      if (this.frame > this.hFrames) {
        this.frame = 0;
      }
    }, 100);
  }

  drawImage(ctx: CanvasRenderingContext2D) {
    super.drawImage(ctx, this.position.x, this.position.y);
  }

  setState(state: CharacterState) {
    this.state = state;
    if (state == "idle") {
      this.hFrames = 11;
      if (this.facingDirection == "right") {
        this.resource = resources.images.hero_idle_right;
      } else {
        this.resource = resources.images.hero_idle_left;
      }
    }
  }

  setFacingDirection(direction: "right" | "left") {
    this.facingDirection = direction;
  }

  fall() {
    this.hFrames = 1;
    this.frame = 0;
    this.setState("falling");
    this.position = new Vector2(this.position.x, this.position.y + 12);
    if (this.facingDirection == "right") {
      this.resource = resources.images.fall_right;
    } else {
      this.resource = resources.images.fall_left;
    }
  }

  land() {
    this.hasJumpedTwice = false;
    this.setState("idle");
  }

  jump() {
    if (this.state != "falling") {
      this.hFrames = 1;
      this.frame = 0;
      this.setState("jumping");
      if (this.facingDirection == "right") {
        this.position = new Vector2(
          this.position.x < 720
            ? this.position.x + this.moveSpeed
            : this.position.x,
          this.position.y - 12
        );
        this.resource = resources.images.jump_right;
      } else {
        this.position = new Vector2(
          this.position.x > -16
            ? this.position.x - this.moveSpeed
            : this.position.x,
          this.position.y - 12
        );
        this.resource = resources.images.jump_left;
      }
    }
  }

  doubleJump() {
    if (!this.hasJumpedTwice) {
      this.hasJumpedTwice = true;
      this.hFrames = 6;
      this.frame = 0;
      this.buildFrameMap();
    }
    this.setState("double_jumping");
    if (this.facingDirection == "right") {
      this.position = new Vector2(
        this.position.x < 720
          ? this.position.x + this.moveSpeed
          : this.position.x,
        this.position.y - 18
      );
      this.resource = resources.images.double_jump_right;
    } else {
      this.position = new Vector2(
        this.position.x > -16
          ? this.position.x - this.moveSpeed
          : this.position.x,
        this.position.y - 18
      );
      this.resource = resources.images.double_jump_left;
    }
  }

  move(direction: string) {
    let resource;
    if (direction == "right") {
      resource = resources.images.hero_run_right;
      if (this.facingDirection == "left") {
        this.setFacingDirection("right");
      }
      if (this.position.x < 720) {
        this.position = new Vector2(
          this.position.x + this.moveSpeed,
          this.position.y
        );
      }
    } else {
      resource = resources.images.hero_run_left;
      if (this.facingDirection == "right") {
        this.setFacingDirection("left");
      }
      if (this.position.x > -16) {
        this.position = new Vector2(
          this.position.x - this.moveSpeed,
          this.position.y
        );
      }
    }
    if (this.state != "falling" && this.state != "jumping") {
      this.state = "running";
      this.hFrames = 12;
      this.resource = resource;
    }
  }
}

export const heroSprite = new Character({
  resource: resources.images.hero_idle_right,
  hFrames: 11,
  frameSize: new Vector2(32, 32),
  scale: 3,
  position: new Vector2(0, 0),
});

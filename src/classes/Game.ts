import type { Character } from "./Character";
import type { TileMap } from "./TileMap";
import { map1 } from "./TileMap";
import { heroSprite } from "./Character";
import { Sprite } from "./Sprite";
import { resources } from "./Resources";
import { Vector2 } from "./Vector2";
import { Trashes } from "./Trash.ts";
import { Cakes } from "./Cake.ts";

const backGroundImage = new Sprite({
  resource: resources.images.background,
  frame: 1,
  frameSize: new Vector2(800, 500),
  hFrames: 1,
  scale: 1.3,
});

const logo = new Sprite({
  resource: resources.images.logo,
  frame: 1,
  frameSize: new Vector2(256, 256),
  hFrames: 1,
  scale: 1.8,
});
let currentGameOverMessage = "";

const fallingGameOverMessages = [
  "You fought bravely… but gravity fought harder.",
  "Don’t worry, the cake still loves you. (It just ate you first.)",
  "Pro tip: Jumping off cliffs is rarely a good idea.",
  "Insert coin to continue… (Just kidding, your keyboard is free.)",
  "You didn’t lose. You just discovered 100 new ways NOT to win.",
  "That jump was sponsored by Newton’s Laws of Motion.",
  "Congratulations! You won… absolutely nothing.",
  "No refunds. No cake either.",
  "It’s not a bug. It’s a skill issue.",
  "Error 404: Player skill not found.",
  "Don’t worry, nobody saw that… except me.",
];

const trashGameOverMessages = [
  "You are what you eat… and you ate trash",
  "Trash diet complete. Side effects: death.",
  "Breaking News: Maraki overdoses on trash buffet.",
  "Your body is now 100% recyclable.",
  "Congratulations! You’ve been promoted to Garbage Collector.",
];

const song = new Audio("/Tsundere Twintails - Rest Area.mp3");

const items = [...Cakes, ...Trashes];

class Game {
  heroSprite: Character;
  map: TileMap;
  onWin: () => void;
  constructor(heroSprite: Character, map: TileMap, onWin: () => void) {
    this.heroSprite = heroSprite;
    this.map = map;
    this.onWin = onWin;
  }
  isMovingRight = false;
  isMovingLeft = false;
  isJumping = false;
  isDoubleJumping = false;
  jumpTimer = 0;
  initialized = false;
  isRunning = false;
  logoPosition = new Vector2(160, 100);
  logoRemoved = false;
  score = 0;
  lives = 5;
  gameOver = false;
  gameWon = false;

  activeItems: (typeof items)[number][] = []; // store spawned items

  spawnItem() {
    setInterval(() => {
      if (this.isRunning) {
        // Pick a random item (clone it so it doesn’t reuse same reference)
        const randomIndex = Math.floor(Math.random() * items.length);
        const itemTemplate = items[randomIndex];

        // Create a new instance (assuming Cake/Trash are classes with .position & .fall)
        const newItem = Object.create(itemTemplate);

        // Place it at random x at top of screen
        newItem.position = new Vector2(
          Math.floor(Math.random() * 700) + 50, // within canvas width
          -32 // above screen
        );

        // Track it
        this.activeItems.push(newItem);
      }
    }, 1500);
  }

  initializeGame() {
    this.animate();
    document.onkeydown = (e) => {
      if (e.key == "d" || e.key == "D") {
        this.isMovingLeft = false;
        this.isMovingRight = true;
      }
      if (e.key == "a" || e.key == "A") {
        this.isMovingLeft = true;
        this.isMovingRight = false;
      }
      if (e.key == "w" || e.key == "W") {
        if (
          !this.checkCollisionBetweenPlayerAndMap(map1, heroSprite) &&
          !this.heroSprite.hasJumpedTwice
        ) {
          this.jumpTimer = 0;
          this.isDoubleJumping = true;
        }
        this.isJumping = true;
      }
    };
    document.onkeyup = () => {
      this.isMovingLeft = false;
      this.isMovingRight = false;
      !this.isJumping && this.heroSprite.setState("idle");
    };
    this.initialized = true;
  }

  draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    backGroundImage.drawImage(ctx, 0, 0);
    if (this.isRunning && this.logoRemoved) {
      this.map.drawAllImages(ctx);
      this.heroSprite.drawImage(ctx);
    }
    if (this.gameOver) {
      this.showGameOver(ctx, "falling");
    }
    this.activeItems.forEach((item) => item.drawImage(ctx));
    logo.drawImage(ctx, this.logoPosition.x, this.logoPosition.y);
  }

  animate() {
    this.heroSprite.animate();
  }

  showScore(ctx: CanvasRenderingContext2D) {
    ctx.font = "30px bold";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    // Draw text
    ctx.fillText(this.score.toString(), 400, 50);
  }

  showGameOver(ctx: CanvasRenderingContext2D, deathBy: "falling" | "trash") {
    ctx.font = "30px bold";
    ctx.fillStyle = "Red";
    ctx.textAlign = "center";

    ctx.fillText("GAME OVER!", 400, 200);
    if (this.isRunning) {
      if (deathBy == "falling") {
        const randomIndex = Math.floor(
          Math.random() * fallingGameOverMessages.length
        );
        currentGameOverMessage = fallingGameOverMessages[randomIndex];
      } else {
        const randomIndex = Math.floor(
          Math.random() * trashGameOverMessages.length
        );
        currentGameOverMessage = trashGameOverMessages[randomIndex];
      }
    }
    ctx.fillText(currentGameOverMessage, 400, 250);
    this.isRunning = false;
    this.gameOver = true;
  }

  showGameWon(ctx: CanvasRenderingContext2D) {
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "green";
    ctx.textAlign = "center";
    ctx.fillText("🏆 CONGRATULATIONS, YOU WON!!", 400, 200);
    ctx.fillText("Happy Birthdayyyyy!!!", 400, 250);
  }

  showHearts(ctx: CanvasRenderingContext2D) {
    const hearts = [];
    for (let i = 0; i < this.lives; i++) {
      hearts.push(
        new Sprite({
          resource: resources.images.heart,
          frame: 1,
          frameSize: new Vector2(256, 256),
          hFrames: 1,
          scale: 1.5,
          position: new Vector2(16 + i * 32, 32),
        })
      );
    }
    hearts.forEach((heart) =>
      heart.drawImage(ctx, heart.position.x, heart.position.y)
    );
  }

  checkCollisionBetweenPlayerAndItem(player: Character) {
    for (let i = 0; i < this.activeItems.length; i++) {
      let isCollidingY = false;
      let isCollidingX = false;
      if (
        player.position.x >= this.activeItems[i].position.x - 40 &&
        player.position.x <= this.activeItems[i].position.x + 40
      ) {
        isCollidingX = true;
      }
      if (
        player.position.y >= this.activeItems[i].position.y - 40 &&
        player.position.y <= this.activeItems[i].position.y + 40
      ) {
        isCollidingY = true;
      }
      if (isCollidingX && isCollidingY) {
        if (this.activeItems[i].type == "TRASH") {
          this.lives -= 1;
        } else {
          this.score += 1;
        }
        this.activeItems.splice(i, 1);
      }
    }
  }

  checkIfItemIsOffScreenAndRemove() {
    for (let i = 0; i < this.activeItems.length; i++) {
      if (this.activeItems[i].position.y > 500) {
        this.activeItems.splice(i, 1);
      }
    }
  }

  checkCollisionBetweenPlayerAndMap(map: TileMap, player: Character) {
    for (let i = 0; i < map.tiles.length; i++) {
      let isCollidingY = false;
      let isCollidingX = false;
      if (player.state != "jumping" && player.state != "double_jumping") {
        if (
          map.tiles[i].position.y - 90 >= player.position.y &&
          map.tiles[i].position.y - 100 <= player.position.y
        ) {
          isCollidingY = true;
        }
      }
      if (500 < player.position.y) {
        this.gameOver = true;
      }
      if (
        player.position.x <=
          map.tiles[i].position.x + map.tiles[i].frameSize.x * 2 &&
        player.position.x >= map.tiles[i].position.x - 64
      ) {
        isCollidingX = true;
      }
      let bothAxisColliding = isCollidingY && isCollidingX;
      if (bothAxisColliding) {
        return true;
      }
    }
    return false;
  }

  removeLogo() {
    const interval = setInterval(() => {
      if (this.logoPosition.y > -500) {
        this.logoPosition = new Vector2(
          this.logoPosition.x,
          this.logoPosition.y - 20
        );
      } else {
        this.logoRemoved = true;
        clearInterval(interval);
      }
    }, 25);
  }

  startGame() {
    song.play();
    this.score = 0;
    this.lives = 5;
    if (!this.logoRemoved) {
      this.removeLogo();
    }
    if (this.activeItems.length != 0) {
      this.activeItems = [];
    } else {
      this.spawnItem();
    }
    this.isRunning = true;
    this.gameOver = false;
    this.gameWon = false;
    heroSprite.position = new Vector2(0, 0);
  }

  updateGame(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    setInterval(() => {
      if (this.lives == 0) {
        this.gameOver = true;
      }
      if (this.score == 10) {
        this.isRunning = false;
        this.gameWon = true;
      }
      if (this.gameOver && heroSprite.position.y <= 500) {
        this.showGameOver(ctx, "trash");
      }

      this.draw(canvas, ctx);
      if (this.gameWon) {
        this.showGameWon(ctx);
      }
      if (this.isRunning) {
        this.checkIfItemIsOffScreenAndRemove();
        this.showHearts(ctx);
        this.showScore(ctx);
        this.activeItems.forEach((item) => item.fall());
        this.checkCollisionBetweenPlayerAndItem(heroSprite);
        if (!(this.heroSprite.position.x <= -32) && this.isMovingLeft) {
          heroSprite.move("left");
        } else if (
          !(this.heroSprite.position.x >= canvas.width - 32) &&
          this.isMovingRight
        ) {
          heroSprite.move("right");
        }
        if (
          this.heroSprite.state == "falling" &&
          this.checkCollisionBetweenPlayerAndMap(map1, heroSprite)
        ) {
          this.heroSprite.land();
        }
        if (
          heroSprite.state != "jumping" &&
          heroSprite.state != "double_jumping" &&
          !this.checkCollisionBetweenPlayerAndMap(map1, heroSprite)
        ) {
          heroSprite.fall();
        }
        if (this.isJumping && !this.isDoubleJumping) {
          if (this.checkCollisionBetweenPlayerAndMap(map1, heroSprite)) {
            this.jumpTimer = 0;
            this.jumpTimer += 1;
            heroSprite.jump();
          } else if (
            !this.checkCollisionBetweenPlayerAndMap(map1, heroSprite) &&
            this.jumpTimer < 8
          ) {
            this.jumpTimer += 1;
            heroSprite.jump();
          } else {
            this.isJumping = false;
            this.jumpTimer = 0;
            heroSprite.fall();
          }
        }
        if (
          !(this.heroSprite.position.x >= canvas.width - 32) &&
          !(this.heroSprite.position.x <= -32) &&
          this.isDoubleJumping
        ) {
          if (this.jumpTimer < 12) {
            this.jumpTimer += 1;
            heroSprite.doubleJump();
          } else {
            this.isDoubleJumping = false;
            this.isJumping = false;
            this.jumpTimer = 0;
            heroSprite.fall();
          }
        }
      }
    }, 50);
  }
}

export const game = new Game(heroSprite, map1, () => {});

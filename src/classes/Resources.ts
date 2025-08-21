class Resources {
  toLoad: Record<string, string>;
  images: Record<string, { image: HTMLImageElement; isLoaded: boolean }>;

  constructor() {
    this.toLoad = {
      hero_idle_right: "/src/assets/Characters/Maraki/Idle Right(32x32).png",
      hero_idle_left: "/src/assets/Characters/Maraki/Idle Left(32x32).png",
      hero_run_right: "/src/assets/Characters/Maraki/Run Right(32x32).png",
      hero_run_left: "/src/assets/Characters/Maraki/Run Left(32x32).png",
      terrain: "/src/assets/Terrain/Terrain (16x16).png",
      fall_right: "/src/assets/Characters/Maraki/Fall Right(32x32).png",
      fall_left: "/src/assets/Characters/Maraki/Fall Left(32x32).png",
      jump_right: "/src/assets/Characters/Maraki/Jump Right(32x32).png",
      jump_left: "/src/assets/Characters/Maraki/Jump Left(32x32).png",
      double_jump_right:
        "/src/assets/Characters/Maraki/Double Jump Right(32x32).png",
      double_jump_left:
        "/src/assets/Characters/Maraki/Double Jump Left(32x32).png",
      background: "/src/assets/Sky1.jpg",
      logo: "/src/assets/Logo_M.png",
      cakes: "/src/assets/Cakes.png",
      trash: "/src/assets/trash.png",
      heart: "/src/assets/heart.png",
    };

    this.images = {};

    Object.keys(this.toLoad).forEach((key: string) => {
      const img = new Image();
      img.src = this.toLoad[key];
      this.images[key] = {
        image: img,
        isLoaded: false,
      };

      img.onload = () => {
        this.images[key].isLoaded = true;
      };
    });
  }
}

export const resources = new Resources();

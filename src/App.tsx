import { useRef, useEffect } from "react";
import { game } from "./classes/Game";

function App() {
  game.initializeGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    game.updateGame(canvas, ctx);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  return (
    <>
      <div className="w-full focus:outline-none bg-gay-800 h-screen gap-5 flex flex-col items-center justify-center">
        <h2 className="font-bold text-gray-800 text-lg">
          HAPPY BIRTHDAYYYYY!!!🎉🎉
        </h2>
        <canvas
          className="rounded-lg"
          ref={canvasRef}
          width={800}
          height={500}
        />
        <p className="text-sm text-gray-500 w-1/3">
          Welcome to Maraki's Cake Quest, a fun and quirky platformer where your
          goal is to collect as many cakes as possible while avoiding piles of
          trash! Use the A and D keys to move left and right, and W to jump (or
          double-jump!) across platforms. Watch your step—falling off the map or
          eating too much trash will cost you a life, and losing all 5 lives
          ends the game. Collect 10 cakes to win, and try to survive the chaotic
          mix of obstacles, gravity, and flying junk. Can you dodge the trash
          and become the ultimate cake-collecting hero?
        </p>
        <button
          onClick={() => {
            game.startGame();
          }}
          className={`focus:outline-none py-2 text-white bg-emerald-700 font-bold rounded-md w-80`}
        >
          START / RESTART
        </button>
      </div>
    </>
  );
}

export default App;

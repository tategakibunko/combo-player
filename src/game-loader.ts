
import { GameEntry, GameLoader } from './types';

const DefaultGameId = "street-fighter5-jp";

const GameStub: { [gameId: string]: GameEntry } = {
  "tekken7-jp": {
    title: "鉄拳7",
    commands: [
      { name: "崩拳", combo: "rotateL(90, 0), circle" },
    ]
  },
  "pes2020-jp": {
    title: "ウイイレ2020",
    commands: [
      { name: "シュートフェイント", combo: `square { (touchL(), cross) }` },
      { name: "コントロールシュート", combo: `R2{ square }` },
    ],
  },
  "street-fighter5-jp": {
    title: "ストリートファイター5",
    commands: [
      { name: "波動拳", combo: `rotate(90, 0), circle` },
      { name: "真空波動拳", combo: `rotate(90, 0), rotate(90, 0), circle` },
      { name: "電刃波動拳", combo: `info("Ｖトリガー発動中に"), rotate(90, 0), rotate(90, 0), circle` },
      { name: "昇龍拳", combo: `"draw the Z!", setL(0), moveL(0,90), rotateL(90,45), triangle` },
    ],
  }
};

export class StubGameLoader implements GameLoader {
  load(gameId = DefaultGameId): Promise<GameEntry> {
    return Promise.resolve(GameStub[gameId]);
  }
}

export class CsGameLoader implements GameLoader {
  async load(gameId = DefaultGameId): Promise<GameEntry> {
    // return Promise.resolve(GameStub[gameId]);
    const res = await fetch(`games/${gameId}.json`);
    return res.json();
  }
}
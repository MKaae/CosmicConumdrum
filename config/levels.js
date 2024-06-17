import Tile from "../model/Tile.js";

export const level1 = {
  level: 1,
  emeneyCount: 1,
  enemies: [
      {enemyType: "ghost", x: 305, y: 60}
  ],
  item: {name: "item" , x: 80, y: 280},
  exit: {
    x: 560,
    y: 40
  },
  tileSet: [
      [new Tile("wallTLcorner"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallTRcorner")],
      [new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert"), new Tile("floor"), new Tile("exit"), new Tile("wallvert")],
      [new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("wallvert")],
      [new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert")],
      [new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert")],
      [new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallvert")],
      [new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert")],
      [new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert")],
      [new Tile("wallvert"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert")],
      [new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("wallhori"), new Tile("wallvert")],
      [new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert")],
      [new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("floor"), new Tile("floor"), new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert")],
      [new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert")],
      [new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("floor"), new Tile("wallvert")],
      [new Tile("wallTLcorner"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallhori"), new Tile("wallTRcorner")],
  ]
}

const COLORS = [
  "#80ffdb",
  "#e63946",
  "#fca311",
  "#0077b6",
  "#8ac926",
  "#8338ec",
];
const ITEMS = [
  "< title />",
  "< article />",
  "< div />",
  "< image />",
  "< link />",
];

const blocks0: BlockPosition[] = [
  ["5-10", 10],
  [5, "10-15"],
  [10, "10-15"],
  [0, 11],
  [1, "8-10"],
  [2, "5-7"],
  ["3-5", 4],
  [15, 11],
  [14, "8-10"],
  [13, "5-7"],
  ["10-12", 4],
  ["6-9", 1],
];
const level0: LevelConfig = {
  message: `Welcome to Guitecs Industries, your job here will be to create
  web pages and store them in our servers, you can see your pending tasks
  on the upper left corner`,
  items: ["< HelloWorld />"],
  colors: ["teal"],
  bugs: [],
  blocks: [...createArrayOfBlocks(blocks0)],
  providers: [[3, 12]],
  painters: [[12, 12]],
  servers: [[7.5, 3]],
};

const blocks1: BlockPosition[] = [
  [1, 14],
  [2, 13],
  [3, 12],
  ["4-5", 11],
  [14, 14],
  [13, 13],
  [12, 12],
  ["10-11", 11],
  [7.5, 10],
  ["1-14", 2],
  [5, "3-4"],
  [10, "3-4"],
  [7.5, 5],
];
const level1: LevelConfig = {
  message: `You passed the interview, congratulations! You will now be working
  on our production server. Just avoid making contact with the bugs,
  and everything should be just fine :D`,
  items: ITEMS.slice(0, 3),
  colors: COLORS.slice(0, 3),
  blocks: [...createArrayOfBlocks(blocks1)],
  bugs: [
    [3, 3],
    [13, 13],
  ],
  providers: [
    [2, 5],
    [2, 7],
    [2, 9],
  ],
  painters: [
    [13, 5],
    [13, 7],
    [13, 9],
  ],
  servers: [
    [5, 13],
    [7.5, 14],
    [10, 13],
  ],
};

const blocks2: BlockPosition[] = [
  ["5-10", 9],
  ["6-9", 4],
  ["7-8", 13],
  ["7-8", 14],
];
const level2: LevelConfig = {
  endless: true,
  message: `Incredible job! You are now a permanent part of the organization,
  remember to complete your tasks as fast as posible, otherwise
  the users may recieve an ugly 404 ERROR`,
  items: ITEMS.slice(2, 6),
  colors: COLORS,
  blocks: createArrayOfBlocks(blocks2),
  bugs: [
    [3, 3],
    [12, 12],
    [3, 12],
  ],
  providers: [
    [1, 11],
    [3, 12],
    [5, 13],
  ],
  painters: [
    [14, 4],
    [14, 6],
    [14, 8],
    [1, 4],
    [1, 6],
    [1, 8],
  ],
  servers: [
    [10, 13],
    [12, 12],
    [14, 11],
  ],
};

export default [level0, level1, level2];

/**
  convert from ["1-3", 5] to [[1, 5], [2, 5], [3, 5]]
*/
function createArrayOfBlocks(positions: BlockPosition[]): Vector[] {
  const result: Vector[] = [];

  positions.forEach(([x, y]) => {
    if (typeof x === "string") {
      let [start, end] = x.split("-").map((el) => parseInt(el));

      for (let i = start; i <= end; i++) {
        result.push([i, +y]);
      }
    } else if (typeof y == "string") {
      let [start, end] = y.split("-").map((el) => parseInt(el));

      for (let i = start; i <= end; i++) {
        result.push([+x, i]);
      }
    } else {
      result.push([x, y]);
    }
  });

  return result;
}

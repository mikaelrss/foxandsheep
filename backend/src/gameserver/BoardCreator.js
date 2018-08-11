// import { Game } from '../mongoose/mongooseConnector';
//
// const GRID_SIZE = 10;
//
// const getBoard = async uuid => {
//   let find = await Game.findOne({ catcherUuid: uuid }).exec();
//   console.log(find);
//   return find;
// };
//
// export const createBoardRows = () => {
//   const result = [];
//   const xCoordinates = Array.from({ length: 10 }, () => Math.floor(Math.random() * GRID_SIZE));
//   const yCoordinates = Array.from({ length: 10 }, () => Math.floor(Math.random() * GRID_SIZE));
//   for (let i = 0; i < GRID_SIZE; i++) {
//     const row = [];
//     for (let u = 0; u < GRID_SIZE; u++) {
//       row.push({
//         grass: false,
//       });
//     }
//     result.push(row);
//   }
//   for (let i = 0; i < GRID_SIZE; i++) {
//     const cell = result[xCoordinates[i]][yCoordinates[i]];
//     if (!cell.grass) {
//       cell.grass = true;
//     }
//   }
//   return result;
// };
//
// const createBoard = uuid => {
//   const result = new Game({
//     catcher: true,
//     catcherUuid: uuid,
//     opponentUuid: 'waiting',
//     rows: createBoardRows(),
//   });
//   console.log(result);
//   result
//     .save(result)
//     .then(res => console.log(res))
//     .catch(err => console.log('ERR', err));
//
//   return uuid;
// };
//
// const getOrCreateBoard = async uuid => {
//   const hasGame = await Game.find({ catcherUuid: uuid }).exec();
//   console.log('HAS', hasGame);
//   if (hasGame.length) return await getBoard(uuid);
//   return createBoard(uuid);
// };
//
// export default getOrCreateBoard;

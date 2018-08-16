import getOrCreateBoard, { createBoardRows } from "../game/boardCreator";
const projectSettings = require('../../package.json');

const resolvers = {
  Query: {
    version: () => {
      return projectSettings.version;
    },
    getOrCreateBoard: async (proxy, data) => {
      return 'test';
    },
  },
};

export default resolvers;

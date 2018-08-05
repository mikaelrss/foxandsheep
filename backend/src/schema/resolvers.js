const projectSettings = require("../../package.json");

const resolvers = {
  Query: {
    version: () => {
      return projectSettings.version;
    }
  }
};

export default resolvers;

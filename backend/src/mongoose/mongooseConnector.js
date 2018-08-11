import Mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_URL;
Mongoose.Promise = global.Promise;
Mongoose.connect(MONGO_URL);

const GameSchema = Mongoose.Schema({
  uuid: String,
  catcherUuid: String,
  opponentUuid: String,
  catcher: Boolean,
  rows: Mongoose.Schema.Types.Mixed,
});

const Game = Mongoose.model('games', GameSchema);

export { Game };

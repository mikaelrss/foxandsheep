const typeDefs = `
  type Test {
    message: String
  } 
  
  type PositionType {
    x: Float!
    y: Float!
  }
  
  type CellType {
    grass: Boolean
  }
  
  type BoardState {
    rows: [[CellType!]!]!
    playerPosition: PositionType! 
    opponentPosition: PositionType!
    catcher: Boolean!
    movementSize: Float! 
  }
  
  type Query {
    version: String!
    getOrCreateBoard(uuid: ID!): BoardState
  }
`;

export default typeDefs;

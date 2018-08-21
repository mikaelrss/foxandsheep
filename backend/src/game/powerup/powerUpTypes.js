export const STEP_SIZE_POWERUP = 'STEP_SIZE_POWERUP';
export const INVISIBILITY_POWERUP = 'INVISIBILITY_POWERUP';
export const TRAP_POWERUP = 'TRAP_POWERUP';

export const initializeRunnerPowerUps = () => [
  { type: STEP_SIZE_POWERUP, coolDown: 2, turnsSinceUse: 0 },
  { type: INVISIBILITY_POWERUP, coolDown: 3, turnsSinceUse: 0 },
  { type: TRAP_POWERUP, coolDown: 2, turnsSinceUse: 0 },
];

export const initializeCatcherPowerUps = () => [
  { type: STEP_SIZE_POWERUP, coolDown: 4, turnsSinceUse: 0 },
  { type: INVISIBILITY_POWERUP, coolDown: 5, turnsSinceUse: 0 },
];

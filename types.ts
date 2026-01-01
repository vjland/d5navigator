export enum Winner {
  PLAYER = 'Player',
  BANKER = 'Banker',
  TIE = 'Tie'
}

export enum Result {
  WIN = 'Win',
  LOSS = 'Loss',
  PUSH = 'Push',
  PENDING = 'Pending'
}

export interface Hand {
  id: number;
  playerScore: number;
  bankerScore: number;
  winner: Winner;
  prediction: Winner | null;
  result: Result;
  runningTotal: number;
  delta: number;
}
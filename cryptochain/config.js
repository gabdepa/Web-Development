const MINE_RATE = 1000;
const INITIAL_DIFFILCUTY = 3;

const GENESIS_DATA = {
  timestamp: 1,
  lastHash: "_______",
  hash: "hash-one",
  difficulty: INITIAL_DIFFILCUTY,
  nonce: 0,
  data: [],
};

const STARTING_BALANCE = 1000;

const REWARD_INPUT = {
  address: "*authorized-reward*",
};

const MINING_REWARD = 50;

module.exports = {
  GENESIS_DATA,
  MINE_RATE,
  STARTING_BALANCE,
  REWARD_INPUT,
  MINING_REWARD,
};

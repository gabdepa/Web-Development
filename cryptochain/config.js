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

module.exports = { GENESIS_DATA, MINE_RATE };

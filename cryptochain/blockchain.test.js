const Blockchain = require("./blockchain");
const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("./config");

describe("Blockchain", () => {
  let blockchain, newChain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originalChain = blockchain.chain;
  });

  it("cointains a `chain` Array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with the genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new `block` to the blockchain", () => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });
    const lastElement = blockchain.chain.length - 1;
    expect(blockchain.chain[lastElement].data).toEqual(newData);
  });

  describe("isValidChain(", () => {
    describe("When the chain does not start with the genesis block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "fake-genesis" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("When the chain starts with the genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Bears" });
        blockchain.addBlock({ data: "Beets" });
        blockchain.addBlock({ data: "Star Wars" });
      });
      describe("and a lastHash reference has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "broken-lastHash";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with an invalid field", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "malicious-data";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain does not contain any invalid blocks", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("replaceChain()", () => {
    let errorMock, logMock;

    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();

      global.console.error = errorMock;
      global.console.log = logMock;
    });

    describe("When the new chain is not longer", () => {
      beforeEach(() => {
        newChain.chain[0] = { new: "chain" };

        blockchain.replaceChain(newChain.chain);
      });

      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("When the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "Bears" });
        newChain.addBlock({ data: "Beets" });
        newChain.addBlock({ data: "Star Wars" });
      });
      describe("and the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "fake-hash";
          blockchain.replaceChain(newChain.chain);
        });
        it("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });
        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe("and the chain is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain);
        });
        it("replaces the chain", () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });
        it("logs about the chain replacement", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });
});

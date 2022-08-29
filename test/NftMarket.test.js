const NftMarket = artifacts.require('NftMarket');
const truffleAssert = require('truffle-assertions');
const { ethers } = require('ethers');

contract('NftMarket', (accounts) => {
  let _contract = null;
  let _nftPrice = ethers.utils.parseEther('0.3').toString();

  before(async () => {
    _contract = await NftMarket.deployed();
  });

  describe('Mint token', () => {
    const tokenURI = 'https://test.com';
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, { from: accounts[0] });
    });

    it('owner of first token should be address[0]', async () => {
      const owner = await _contract.ownerOf(1);
      assert.equal(
        owner,
        accounts[0],
        'Owner of token is not matching address[0]'
      );
    });

    it('first token should point to the correct tokenURI', async () => {
      const actualTokenURI = await _contract.tokenURI(1);
      assert.equal(actualTokenURI, tokenURI, 'TokenURI does not match');
    });

    it('tokenURI already used', async () => {
      await truffleAssert.fails(
        _contract.mintToken(tokenURI, _nftPrice, { from: accounts[0] }),
        truffleAssert.ErrorType.REVERT,
        'Token URI already exists'
      );
    });

    it('should have one listed item', async () => {
      const listedItemsCount = await _contract.listedItemsCount();
      assert.equal(listedItemsCount.toNumber(), 1, 'listedItemsCount is not 1');
    });
  });
});

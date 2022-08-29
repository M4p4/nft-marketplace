const NftMarket = artifacts.require('NftMarket');
const truffleAssert = require('truffle-assertions');

contract('NftMarket', (accounts) => {
  let _contract = null;
  before(async () => {
    _contract = await NftMarket.deployed();
  });

  describe('Mint token', () => {
    const tokenURI = 'https://test.com';
    const price = 5;
    before(async () => {
      await _contract.mintToken(tokenURI, price, { from: accounts[0] });
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
        _contract.mintToken(tokenURI, price, { from: accounts[0] }),
        truffleAssert.ErrorType.REVERT,
        'Token URI already exists'
      );
    });
  });
});

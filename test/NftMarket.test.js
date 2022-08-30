const NftMarket = artifacts.require('NftMarket');
const truffleAssert = require('truffle-assertions');
const { ethers } = require('ethers');

contract('NftMarket', (accounts) => {
  let _contract = null;
  let _nftPrice = ethers.utils.parseEther('0.3').toString();
  let _listingPrice = ethers.utils.parseEther('0.025').toString();

  before(async () => {
    _contract = await NftMarket.deployed();
  });

  describe('Mint token', () => {
    const tokenURI = 'https://test.com';
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
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
        _contract.mintToken(tokenURI, _nftPrice, {
          from: accounts[0],
          value: _listingPrice,
        }),
        truffleAssert.ErrorType.REVERT,
        'Token URI already exists'
      );
    });

    it('should have one listed item', async () => {
      const listedItemsCount = await _contract.listedItemsCount();
      assert.equal(listedItemsCount.toNumber(), 1, 'listedItemsCount is not 1');
    });

    it('should have create NftItem', async () => {
      const NftItem = await _contract.getNftItem(1);
      assert.equal(NftItem.tokenId, 1, 'tokenId is not 1');
      assert.equal(NftItem.price, _nftPrice, 'price is not correct');
      assert.equal(NftItem.creator, accounts[0], 'creator ist not accounts[0]');
      assert.equal(NftItem.isListed, true, 'isListed is not true');
    });
  });

  describe('Buy NFT', () => {
    const tokenURI = 'https://test.com';
    before(async () => {
      await _contract.buyNft(1, {
        from: accounts[1],
        value: _nftPrice,
      });
    });

    it('should unlist item', async () => {
      const listedItemsCount = await _contract.listedItemsCount();
      const listedItem = await _contract.getNftItem(1);
      assert.equal(listedItemsCount.toNumber(), 0, 'listedItemsCount is not 0');
      assert.equal(listedItem.isListed, false, 'isListed is not false');
    });

    it('should change owner', async () => {
      const currentOwner = await _contract.ownerOf(1);
      assert.equal(currentOwner, accounts[1], 'Current owner is wrong');
    });
  });

  describe('Token transfers', () => {
    const tokenURI = 'https://test-json.com';
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[0],
        value: _listingPrice,
      });
    });

    it('should be 2 tokens created', async () => {
      const totalSupply = await _contract.totalSupply();
      assert.equal(totalSupply, 2, 'Supply is not 2');
    });

    it('get token by index', async () => {
      const index0 = await _contract.tokenByIndex(0);
      const index1 = await _contract.tokenByIndex(1);
      assert.equal(index0, 1, 'index0 is not 1');
      assert.equal(index1, 2, 'index1 is not 2');
    });

    it('should be 1 token on sale', async () => {
      const items = await _contract.getAllNftsOnSale();
      assert.equal(items.length, 1, 'Should be 1 token on sale');
      assert.equal(items[0].tokenId, 2, 'Should be token id 2');
    });

    it('account[0] should own 1 token', async () => {
      const ntfs = await _contract.getOwnedNfts({
        from: accounts[0],
      });
      assert.equal(ntfs.length, 1, 'account[0] should be owning 1 token');
    });

    it('account[1] should own 1 token', async () => {
      const ntfs = await _contract.getOwnedNfts({
        from: accounts[1],
      });
      assert.equal(ntfs.length, 1, 'account[1] should be owning 1 token');
    });
  });

  describe('Token transfer to new owner', () => {
    before(async () => {
      await _contract.transferFrom(accounts[0], accounts[1], 2);
    });

    it('account[0] should own 0 token', async () => {
      const ntfs = await _contract.getOwnedNfts({
        from: accounts[0],
      });
      assert.equal(ntfs.length, 0, 'account[0] should be owning 0 token');
    });

    it('account[1] should own 2 token', async () => {
      const ntfs = await _contract.getOwnedNfts({
        from: accounts[1],
      });
      assert.equal(ntfs.length, 2, 'account[1] should be owning 2 token');
    });
  });

  describe('List an Token', () => {
    before(async () => {
      await _contract.placeNftOnSale(1, _nftPrice, {
        from: accounts[1],
        value: _listingPrice,
      });
    });

    it('should have 2 listed items', async () => {
      const items = await _contract.getAllNftsOnSale();
      console.log(items.length);
      assert.equal(items.length, 2, 'should be 2 token on sales');
    });

    it('should change listing price', async () => {
      await _contract.setListingPrice(_listingPrice, {
        from: accounts[0],
      });
      listingPrice = await _contract.listingPrice();
      assert.equal(
        listingPrice.toString(),
        _listingPrice,
        'listing price should match'
      );
    });
  });

  /*
  describe('Burn token', () => {
    const tokenURI = 'https://test-json-3.com';
    before(async () => {
      await _contract.mintToken(tokenURI, _nftPrice, {
        from: accounts[2],
        value: _listingPrice,
      });
    });

    it('account[2] should own 1 token', async () => {
      const ntfs = await _contract.getOwnedNfts({
        from: accounts[2],
      });
      assert.equal(ntfs.length, 1, 'account[2] should be owning 1 token');
    });

    it('account[2] burn his token', async () => {
      await _contract.burnToken(3, {
        from: accounts[2],
      });
      const ntfs = await _contract.getOwnedNfts({
        from: accounts[2],
      });
      assert.equal(ntfs.length, 0, 'account[2] should be owning 0 token');
    });
  });*/
});

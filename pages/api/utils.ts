import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session, withIronSession } from 'next-iron-session';
import contract from '../../public/contracts/NftMarket.json';
import { NftMarketContract } from '@_types/nftMarketContract';
import * as util from 'ethereumjs-util';

const NETWORKS = {
  '5777': 'GANACHE',
};

const abi = contract.abi;
const targetNetwork = process.env
  .NEXT_PUBLIC_NETWORK_ID as keyof typeof NETWORKS;
export const contractAddress = contract['networks'][targetNetwork]['address'];
export const pinataApiKey = process.env.PINATA_API_KEY as string;
export const pinataApiSecret = process.env.PINATA_API_SECRET as string;

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: 'auth-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production' ? true : false,
    },
  });
}

export const addressCheckMiddleware = async (
  req: NextApiRequest & { session: Session },
  res: NextApiResponse
) => {
  return new Promise(async (resolve, reject) => {
    const message = req.session.get('message-session');
    const provider = new ethers.providers.JsonRpcProvider(
      'http://127.0.0.1:7545'
    );
    const contract = new ethers.Contract(
      contractAddress,
      abi,
      provider
    ) as unknown as NftMarketContract;

    if (!message) {
      reject('Cannot read token');
    }

    let nonce: string | Buffer =
      '\x19Ethereum Signed Message:\n' +
      JSON.stringify(message).length +
      JSON.stringify(message);

    nonce = util.keccak(Buffer.from(nonce, 'utf-8'));
    const { v, r, s } = util.fromRpcSig(req.body.signature);
    const pubKey = util.ecrecover(util.toBuffer(nonce), v, r, s);
    const addrBuffer = util.pubToAddress(pubKey);
    const address = util.bufferToHex(addrBuffer);

    if (address === req.body.address) {
      resolve('Correct Address');
    }
    reject('Wrong Address');
  });
};

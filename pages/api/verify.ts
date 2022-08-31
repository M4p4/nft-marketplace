import { Session } from 'next-iron-session';
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  addressCheckMiddleware,
  contractAddress,
  pinataApiKey,
  pinataApiSecret,
  withSession,
} from './utils';
import { NftMeta } from '@_types/nft';
import axios from 'axios';

export default withSession(
  async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    if (req.method == 'POST') {
      try {
        const { body } = req;
        const nft = body.nft as NftMeta;

        if (!nft.attributes || !nft.name || !nft.description || !nft.image) {
          return res.status(422).send({ message: 'Data is not valid' });
        }

        await addressCheckMiddleware(req, res);

        const pinataRes = await axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          {
            pinataMetadata: {
              name: uuidv4(),
            },
            pinataContent: nft,
          },
          {
            headers: {
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataApiSecret,
            },
          }
        );

        res.status(200).send(pinataRes.data);
      } catch (e: any) {
        res.status(422).send({ message: 'Cannot create json' });
      }
    } else if (req.method == 'GET') {
      try {
        const message = { contractAddress, id: uuidv4() };
        req.session.set('message-session', message);
        await req.session.save();
        res.json(message);
      } catch (e: any) {
        res.status(422).send({ message: 'Cannot generate a message' });
      }
    } else {
      res.status(200).json({ message: 'invalid api route' });
    }
  }
);

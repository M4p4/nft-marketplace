import { Session } from 'next-iron-session';
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';
import { addressCheckMiddleware, contractAddress, withSession } from './utils';
import { NftMeta } from '@_types/nft';

export default withSession(
  async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    if (req.method == 'POST') {
      try {
        const { body } = req;
        const nft = body.nft as NftMeta;

        if (!nft.attributes || !nft.name || !nft.description) {
          return res.status(422).send({ message: 'Data is not valid' });
        }

        await addressCheckMiddleware(req, res);

        res.status(200).send({ message: 'Nft has been created' });
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

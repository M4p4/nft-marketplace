import { Session } from 'next-iron-session';
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';
import { contractAddress, withSession } from './utils';

export default withSession(
  async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    if (req.method == 'GET') {
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

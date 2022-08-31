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
import { FileReq } from '@_types/nft';
import axios from 'axios';
import FormData from 'form-data';

export default withSession(
  async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    if (req.method == 'POST') {
      try {
        const { bytes, contentType, fileName } = req.body as FileReq;

        if (!bytes || !contentType || !fileName) {
          return res.status(422).send({ message: 'Image is missing' });
        }

        await addressCheckMiddleware(req, res);

        const buffer = Buffer.from(Object.values(bytes));

        const formData = new FormData();
        formData.append('file', buffer, {
          contentType,
          filename: fileName + '-' + uuidv4(),
        });

        const pinataRes = await axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formData,
          {
            maxBodyLength: Infinity,
            headers: {
              'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
              pinata_api_key: pinataApiKey,
              pinata_secret_api_key: pinataApiSecret,
            },
          }
        );

        res.status(200).send(pinataRes.data);
      } catch (e: any) {
        res.status(422).send({ message: 'Failed to upload image into cloud' });
      }
    } else {
      res.status(200).json({ message: 'invalid api route' });
    }
  }
);

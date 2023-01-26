// game info by user id and game name
import {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({message: 'hello'});
}
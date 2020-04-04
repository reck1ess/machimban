import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import { KAKAO_MAP_URL } from "../../lib/utils/constant";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { term } = req.query;

  try {
    if (!term) {
      return;
    }
    const { data } = await axios.get(
      `${KAKAO_MAP_URL}?query=${encodeURIComponent(String(term))}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_MAP_API_KEY}`
        }
      }
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: `Search term "${term}" not found.` });
  }
};

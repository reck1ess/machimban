import fetch from "isomorphic-unfetch";

import { KAKAO_MAP_URL } from "../../lib/utils/constant";

export default async (req, res) => {
  const { term } = req.query;

  try {
    if (!term) {
      return;
    }
    const response = await fetch(
      `${KAKAO_MAP_URL}?query=${encodeURIComponent(term)}`,
      {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_MAP_API_KEY}`
        }
      }
    );
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: `Search term "${term}" not found.` });
  }
};

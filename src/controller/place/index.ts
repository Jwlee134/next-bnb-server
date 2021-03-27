import axios from "axios";
import { Request, Response } from "express";

export const getPlace = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;
    const {
      data: { predictions },
    } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?key=${
        process.env.GOOGLE_MAP_API_KEY
      }&language=ko&input=${encodeURI(keyword as string)}`
    );
    const data = predictions.map((prediction: any) => prediction.description);
    res.status(200).send(data);
  } catch (error) {
    res.status(404).send("오류가 발생했습니다. 다시 시도해 주세요.");
  }
};

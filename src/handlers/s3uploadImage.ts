import { Request, Response } from "express";
import { JwtAuthRequest } from "../auth/jwt";
import multer from 'multer'
import sharp from 'sharp'



class HandlerS3uploadService {

  async upLoadImage(
    req: Request,
    res: Response
  ):Promise<Response>{
    // const userId = req.payload.id
    // const body = { ...req.body, userId }
    if(!req.files){
        return res.status(400).json({ error: `no file send`})
    }

    const storage = multer.memoryStorage()
    const upload = multer({ storage: storage})

    upload.fields([
      {name : 'testUpload' , maxCount: 2}
    ])
  }
}

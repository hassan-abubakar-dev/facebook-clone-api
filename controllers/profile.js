import cloudinary from "../config/cloudinary.js";
import Profile from "../model/profile.js";
import AppError from "../utils/AppError.js"
import fs from 'fs'
import dotenv from 'dotenv';
import { dbConnection } from "../config/db.js";
dotenv.config();

export const createProfile = async (req, res, next) => {
  let t;
  try {
    t = await dbConnection.transaction();
    const userId = req.user.id;

    if (!req.file) {
      await t.rollback();
      return next(new AppError("file is not uploaded", 400));
    }

    const unDestroyProfiles = [
      process.env.AVATER_MALE_PROFILE,
      process.env.AVATER_FEMALE_PROFILE,
      process.env.AVATER_NEUTRAL_PROFILE,
    ];

    const profile = await Profile.findOne({
      where: { userId },
      transaction: t,
    });

    const oldPublicId = profile.publicId;

    cloudinary.uploader
      .upload_stream(
        { folder: "profile-images" },
        async (error, result) => {
          if (error || !result) {
            await t.rollback();
            return next(
              new AppError(
                "something went wrong or you are not connected",
                400
              )
            );
          }

          profile.image = result.secure_url;
          profile.publicId = result.public_id;
          await profile.save({ transaction: t });

          if (oldPublicId && !unDestroyProfiles.includes(oldPublicId)) {
            await cloudinary.uploader.destroy(oldPublicId);
          }

          await t.commit();
 
          res.status(201).json({
            status: "success",
            message: "profile image uploaded successfully",
            image: profile.image,
          });
        }
      )
      .end(req.file.buffer);
  } catch (error) {
    if (t) await t.rollback();
    console.error(error);
    next(new AppError(error.message, 500));
  }  
};


export const getProfileImage = async(req, res, next) => {
    try{
        const userId = req.user.id;
        const profile = await Profile.findOne({where: {userId}})
        if(!profile){
            return next(new AppError('no profile exist', 400));
        }

        res.status(200).json({
            status: 'success',
            message: 'profile fetched successfully',
            image: profile.image
        })
    }
    catch(error){
        console.error(error);
        next(new AppError(error.message, 500));
    }
}
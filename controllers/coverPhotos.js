import cloudinary from "../config/cloudinary.js";
import { dbConnection } from "../config/db.js";
import CoverPhoto from "../model/coverPhoto.js";
import AppError from "../utils/AppError.js";
import fs from 'fs';

export const createCoverPhoto = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return next(new AppError('you not upload cover photo, upload and try again', 400));
    }

    const existingCoverPhoto = await CoverPhoto.findOne({ where: { userId } });
    if (existingCoverPhoto) {
      return next(new AppError('you already have cover photo update it instead', 400));
    }

    cloudinary.uploader.upload_stream(
      { folder: 'cover-photos' },
      async (error, result) => {
        if (error) {
          console.error(error);
          return next(new AppError('upload failed', 500));
        }

        const coverPhoto = await CoverPhoto.create({
          userId,
          image: result.secure_url,
          publicId: result.public_id
        });

        res.status(201).json({
          status: 'success',
          message: 'cover photo created successfully',
          image: coverPhoto.image
        });
      }
    ).end(req.file.buffer);

  } catch (error) {
    console.error(error);
    next(new AppError(error.message, 500));
  }
};


export const getCoverPhoto = async(req, res, next) => {
    try{
        const userId = req.user.id;
        const coverPhoto = await CoverPhoto.findOne({where: {userId}});
        if(!coverPhoto){
            return next(new AppError('you not have cover photo yet', 400));
        }

        res.status(200).json({
            status: 'success',
            message: 'cover photo fetched successfully',
            image: coverPhoto.image
        });
    }
    catch(error){
        next(new AppError(error.message, 500));
    };
};

export const editeCoverPhoto = async (req, res, next) => {
  let t;

  try {
    if (!req.file) {
      return next(new AppError('no cover photo uploaded', 400));
    }

    const userId = req.user.id;
    t = await dbConnection.transaction();

    const coverPhoto = await CoverPhoto.findOne({
      where: { userId },
      transaction: t,
    });

    if (!coverPhoto) {
      await t.rollback();
      return next(new AppError('no cover photo available to update', 400));
    }

    const oldPublicId = coverPhoto.publicId;

    cloudinary.uploader.upload_stream(
      { folder: 'cover-photos' },
      async (error, result) => { 
        if (error) {
          console.error(error); 
          await t.rollback();
          return next(new AppError('upload failed', 500));
        }

        coverPhoto.image = result.secure_url;
        coverPhoto.publicId = result.public_id;
        await coverPhoto.save({ transaction: t });

        if (oldPublicId) {
          await cloudinary.uploader.destroy(oldPublicId);
        }

        await t.commit();

        res.status(200).json({
          status: 'success',
          message: 'cover photo updated successfully',
          image: result.secure_url,
        });
      }
    ).end(req.file.buffer);

  } catch (error) {
    if (t) await t.rollback();
    console.error(error);
    next(new AppError(error.message, 500));
  }
};


export const deleteCoverPhoto = async(req, res, next) => {
    let t;
    try{
        t = await dbConnection.transaction();
        const userId = req.user.id;
        const coverPhoto = await CoverPhoto.findOne({where: {userId}, transaction: t});
        if(!coverPhoto){
            await t.rollback();
            return next(new AppError('no cover photo yet so cant delete unknow value', 400));
        }
        const publicId = coverPhoto.publicId;
        await CoverPhoto.destroy({where:{userId}, transaction: t});
        await cloudinary.uploader.destroy(publicId);
        
       await t.commit();

        res.status(200).json({
            status: 'success',
            message: 'cover photo deleted successfully'
        })
    }
    catch(error){
        if(t) await t.rollback();
        next(new AppError(error.message, 500));
    };
};
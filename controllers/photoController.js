import Photo from "../models/photoModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";



const createPhoto = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "arunrest",
    }
  );

  try {
    await Photo.create({
      name: req.body.name,
      description: req.body.description,
      user: res.locals.user._id,
      url: result.secure_url,
      image_id: result.public_id,
      uploadedBy: res.locals.user.username,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    res.status(201).redirect("/users/dashboard");
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const getPhotoDetails = async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const photo = await Photo.findById(photoId).populate("user");

    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }

    const photoDetails = {
      url: photo.url,
      username: photo.user.username,
    };

    res.json(photoDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllPhotos = async (req, res) => {

  try {
    const photos = await Photo.find({});
    res.status(200).render("photos", {
      photos,
      link: "index",
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

const getAPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById({ _id: req.params.id }).populate("user");

    let isOwner = false;

    if (res.locals.user) {
      isOwner = photo.user.equals(res.locals.user._id);
    }

    res.status(200).render("photo", {
      photo,
      link: "photos",
      isOwner,
    });
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    const photoId = photo.image_id;

    await cloudinary.uploader.destroy(photoId);
    await Photo.findOneAndRemove({ _id: req.params.id });

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (req.files) {
      const photoId = photo.image_id;

      await cloudinary.uploader.destroy(photoId);

      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          use_filename: true,
          folder: "arunrest",
        }
      );

      photo.url = result.secure_url;
      photo.image_id = result.public_id;

      fs.unlinkSync(req.files.image.tempFilePath);
    }

    photo.name = req.body.name;
    photo.description = req.body.description;

    photo.save();

    res.status(200).redirect(`/photos/${req.params.id}`);
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

export {
  createPhoto,
  getAllPhotos,
  getAPhoto,
  deletePhoto,
  updatePhoto,
  getPhotoDetails,
};

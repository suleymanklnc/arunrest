import nodemailer from "nodemailer";
import Photo from "../models/photoModel.js";
import User from "../models/userModel.js";

const getIndexPage = async (req, res) => {
  const photos = await Photo.find().sort({ uploadedAt: -1 }).limit(6);

  const numOfUser = await User.countDocuments({});

  const numOfPhotos = await Photo.countDocuments({});

  

  res.render("photos", {
    link: "index",
    photos,
    numOfUser,
    numOfPhotos,
  });
};

const getAboutPage = async (req, res) => {
  const photos = await Photo.find().sort({ uploadedAt: -1 }).limit(3);

  const numOfUser = await User.countDocuments({});

  const numOfPhotos = await Photo.countDocuments({});

  res.render("about", {
    link: "about",
    photos,
    numOfUser,
    numOfPhotos,
  });
};

const getRegisterPage = (req, res) => {
  res.render("register", {
    link: "register",
  });
};

const getLoginPage = (req, res) => {
  res.render("login", {
    link: "login",
  });
};

const getLogout = (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
  });
  res.redirect("/");
};

const getContactPage = (req, res) => {
  res.render("contact", {
    link: "contact",
  });
};

const getProfilePage = async (req, res) => {
  const userId = res.locals.user._id;
  const user = await User.findById(userId);
  const numOfFollowers = await User.countDocuments({ followers: userId });
  const numOfFollowings = await User.countDocuments({ followings: userId });

  res.render("profile", {
    link: "profile",
    numOfFollowers,
    numOfFollowings,
    user,
  });
};

const getPostsPage = async (req, res) => {
  const photos = await Photo.find().sort({ uploadedAt: -1 });
  const numOfUser = await User.countDocuments({});
  const numOfPhotos = await Photo.countDocuments({});

  const userPhotoCount = await Photo.countDocuments({
    user: res.locals.user._id,
  });

  res.render("posts", {
    link: "posts",
    photos,
    numOfUser,
    numOfPhotos,
    userPhotoCount,
  });
};

const getFollowersPage = async (req, res) => {
  try {
    const userId = res.locals.user._id;
    const followers = await User.find({ followers: userId });

    const users = await User.find({ _id: { $ne: userId } });

    const photos = await Photo.find().sort({ uploadedAt: -1 });
    const numOfUser = await User.countDocuments({});
    const numOfPhotos = await Photo.countDocuments({});
    const numOfFollowers = await User.countDocuments({ followers: userId });
    const numOfFollowings = await User.countDocuments({ followings: userId });
    const userPhotoCount = await Photo.countDocuments({ user: userId });

    res.render("followers", {
      link: "followers",
      photos,
      numOfUser,
      numOfPhotos,
      userPhotoCount,
      users,
      numOfFollowers,
      numOfFollowings,
      followers,
    });
  } catch (error) {
    console.error("Error in getFollowersPage:", error);
    res.status(500).send("An error occurred.");
  }
};

const getFollowingsPage = async (req, res) => {
  try {
    const userId = res.locals.user._id;
    const followings = await User.find({ followings: userId });

    const users = await User.find({ _id: { $ne: userId } });

    const photos = await Photo.find().sort({ uploadedAt: -1 });
    const numOfUser = await User.countDocuments({});
    const numOfPhotos = await Photo.countDocuments({});
    const numOfFollowers = await User.countDocuments({ followers: userId });
    const numOfFollowings = await User.countDocuments({ followings: userId });
    const userPhotoCount = await Photo.countDocuments({ user: userId });

    res.render("followings", {
      link: "followings",
      photos,
      numOfUser,
      numOfPhotos,
      userPhotoCount,
      users,
      numOfFollowers,
      numOfFollowings,
      followings,
    });
  } catch (error) {
    console.error("Error in getFollowersPage:", error);
    res.status(500).send("An error occurred.");
  }
};

const sendMail = async (req, res) => {
  const htmlTemplate = `  <!DOCTYPE html>
  <html>
  <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Stilize Email</title>
      <style>
          /* Genel Resetler */
          img {
              border: none;
              -ms-interpolation-mode: bicubic;
              max-width: 100%;
          }
  
          body {
              background-color: #f5f5f5;
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              -ms-text-size-adjust: 100%;
              -webkit-text-size-adjust: 100%;
          }
  
          table {
              border-collapse: collapse;
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              width: 100%;
          }
  
          table td {
              vertical-align: top;
          }
  
          /* Ana İçerik Kutusu */
          .container {
              background-color: #ffffff;
              border-radius: 5px;
              padding: 20px;
          }
  
          /* Başlık */
          .header {
              text-align: center;
              padding: 20px 0;
          }
  
          /* İletişim Bilgileri */
          .contact-info {
              margin-top: 20px;
          }
  
          /* Mesaj İçeriği */
          .message-content {
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tr>
              <td>&nbsp;</td>
              <td class="container">
                 
                  <div class="contact-info">
               
                      <h2>İletişim Bilgileri</h2>
                      <p><strong>Username : </strong>${req.body.name}</p>
                      <p><strong>E-posta : </strong> ${req.body.email}</p>
                  </div>
                  <div class="message-content">
                      <h2>Mesaj</h2>
                      <p>${req.body.message}</p>
                  </div>
              </td>
              <td>&nbsp;</td>
          </tr>
      </table>
  </body>
  </html>
  
    `;

  try {
    let transporter = nodemailer.createTransport({
      host: `smtp.gmail.com`,
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAIL,
        pass: process.env.NODE_PASS,
      },
    });

    await transporter.sendMail({
      to: "wordsempiree@gmail.com",
      subject: `MAIL FROM ${req.body.email}`,
      html: htmlTemplate,
    });

    res.status(200).json({ succeeded: true });
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

export {
  getIndexPage,
  getAboutPage,
  getRegisterPage,
  getLoginPage,
  getLogout,
  getContactPage,
  sendMail,
  getProfilePage,
  getPostsPage,
  getFollowersPage,
  getFollowingsPage,
};

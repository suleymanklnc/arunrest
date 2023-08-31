import nodemailer from "nodemailer";
import Photo from "../models/photoModel.js";
import User from "../models/userModel.js";

const getIndexPage = async (req, res) => {
  const photos = await Photo.find().sort({ uploadedAt: -1 }).limit(6);

  const numOfUser = await User.countDocuments({});

  const numOfPhotos = await Photo.countDocuments({});

  res.render("index", {
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
  const htmlTemplate = `  <!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Simple Transactional Email</title>
        <style>
          /* -------------------------------------
              GLOBAL RESETS
          ------------------------------------- */
          
          /*All the styling goes here*/
          
          img {
            border: none;
            -ms-interpolation-mode: bicubic;
            max-width: 100%; 
          }
    
          body {
            background-color: red;
            font-family: sans-serif;
            -webkit-font-smoothing: antialiased;
            font-size: 18px;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%; 
          }
    
          table {
            border-collapse: separate;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            width: 100%; }
            table td {
              font-family: sans-serif;
              font-size: 14px;
              vertical-align: top; 
          }
    
          /* -------------------------------------
              BODY & CONTAINER
          ------------------------------------- */
    
          .body {
            background-color: blue;
            width: 100%; 
          }
    
          /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
          .container {
            display: block;
            margin: 0 auto !important;
            /* makes it centered */
            max-width: 580px;
            padding: 10px;
            width: 580px; 
          }
    
          /* This should also be a block element, so that it will fill 100% of the .container */
          .content {
            box-sizing: border-box;
            display: block;
            margin: 0 auto;
            max-width: 580px;
            padding: 10px; 
          }
    
          /* -------------------------------------
              HEADER, FOOTER, MAIN
          ------------------------------------- */
          .main {
            background: yellow;
            border-radius: 15px;
            width: 100%; 
          }
    
          .wrapper {
            box-sizing: border-box;
            padding: 20px; 
          }
    
          .content-block {
            padding-bottom: 10px;
            padding-top: 10px;
          }
    
    
        </style>
      </head>
      <body>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
          <tr>
            <td>&nbsp;</td>
            <td class="container">
              <div class="content">
    
                <!-- START CENTERED WHITE CONTAINER -->
                <table role="presentation" class="main">
    
                  <!-- START MAIN CONTENT AREA -->
                  <tr>
                    <td class="wrapper">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <p>Email: ${req.body.email}</p>
                            <p>Name: ${req.body.name}</p>
                            <p>Message: ${req.body.message}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
    
                <!-- END MAIN CONTENT AREA -->
                </table>
                <!-- END CENTERED WHITE CONTAINER -->
    
    
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

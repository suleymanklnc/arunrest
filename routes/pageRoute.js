import express from "express";
import * as pageController from "../controllers/pageController.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(pageController.getIndexPage);
router.route("/about").get(pageController.getAboutPage);
router.route("/register").get(pageController.getRegisterPage);
router.route("/login").get(pageController.getLoginPage);
router.route("/logout").get(pageController.getLogout);
router.route("/contact").get(pageController.getContactPage);
router.route("/contact").post(pageController.sendMail);

router
  .route("/posts")
  .get(
    authMiddleware.checkUser,
    authMiddleware.authenticateToken,
    pageController.getPostsPage
  );

router
  .route("/followers")
  .get(
    authMiddleware.checkUser,
    authMiddleware.authenticateToken,
    pageController.getFollowersPage
  );

router
  .route("/followings")
  .get(
    authMiddleware.checkUser,
    authMiddleware.authenticateToken,
    pageController.getFollowingsPage
  );

router
  .route("/profile")
  .get(
    authMiddleware.checkUser,
    authMiddleware.authenticateToken,
    pageController.getProfilePage
  );



  router
  .route("/settings")
  .get(
    authMiddleware.checkUser,
    authMiddleware.authenticateToken,
    pageController.getProfilePage,
  );




export default router;

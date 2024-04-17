const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");
const {
  authentication,
  authorization,
  uploader,
  errHandler,
} = require("../middlewares");

router.get("/", Controller.home);

router.get("/pub/cuisines", Controller.pubCuisine);
router.get("/pub/cuisines/:id", Controller.pubCuisineId);
router.post("/login", Controller.login);

router.use(authentication);
router.post("/add-user", authorization, Controller.addUser);

router.post("/cuisines", Controller.createCuisine);
router.get("/cuisines", Controller.readCuisine);
router.get("/cuisines/:id", Controller.readCuisineId);
router.put("/cuisines/:id", authorization, Controller.updateCuisineId);
router.delete("/cuisines/:id", authorization, Controller.deleteCuisineId);

router.post("/categories", Controller.createCategory);
router.get("/categories", Controller.readCategory);
router.put("/categories/:id", authorization, Controller.updateCategoryId);
router.delete("/categories/:id", authorization, Controller.deleteCategoryId);

router.patch(
  "/cuisines/:id/img-url",
  authorization,
  uploader.single("img"),
  Controller.updateImage
);

router.use(errHandler);
module.exports = router;

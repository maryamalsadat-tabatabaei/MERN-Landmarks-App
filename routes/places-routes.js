const express = require("express");
const { check } = require("express-validator");
const placesController = require("../controllers/places-controller");
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");
const router = express.Router();

router.get("/user/:uid", placesController.getPlacesByUserId);

router.get("/:pid", placesController.getPlaceById);

router.use(checkAuth); // from this point all the routes get authenticated

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesController.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesController.updatePlaceById
);

router.delete("/:pid", placesController.deletePlaceById);

module.exports = router;

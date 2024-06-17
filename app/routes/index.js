const express = require("express");
const controllers = require("../controllers");
const uploadOnMemory = require("../utils/multer");
const apiRouter = express.Router();

/** Mount GET / handler */
apiRouter.get("/", controllers.main.index);
/**
 * TODO: Implement your own API
 *       implementations
 */

apiRouter.post("/api/predict", uploadOnMemory.single("image_predict"), controllers.prediction.imgPredict)

/**
 * TODO: Delete this, this is just a demonstration of
 *       error handler
 */
apiRouter.get("/api/errors", () => {
    throw new Error("The Industrial Revolution and its consequences have been a disaster for the human race.");
});

apiRouter.use(controllers.main.onLost);
apiRouter.use(controllers.main.onError);

/**
 * TODO: Delete this, this is just a demonstration of
 *       error handler
 */
module.exports = apiRouter;
const router = require("express").Router();

router.use("/users", require("./User.routes").default);
router.use("/parkingLots", require("./Parking.routes").default);

export default router;

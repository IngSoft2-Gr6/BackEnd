const router = require("express").Router();

router.use("/users", require("./User.routes").default);
router.use("/parkingLots", require("./Parking.routes").default);
router.use("/vehicles", require("./Vehicle.routes").default);

export default router;

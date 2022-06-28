const router = require("express").Router();

router.use("/users", require("./User.routes").default);
// ...

export default router;

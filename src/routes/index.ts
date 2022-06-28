const router = require("express").Router();

router.use("/users", require("./User.routes").default);
// ...

export default router;

// import { Router } from "express";
// import UserRoute from "./User.routes";
// import OtherRoute from "./Other.routes";
// import OOtherRoute from "./OOther.routes";
// import OOOtherRoute from "./OOOther.routes";
// //......

// const router = Router();
// router.use("/users", UserRoute);
// router.use("/other", OtherRoute);
// router.use("/oother", OOtherRoute);
// router.use("/ooother", OOOtherRoute);
// //......

// export default router;

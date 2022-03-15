import express from "express";

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("GET Request in Places");
  res.status(200).json({
    message: "It works!",
  });
});

export default router;

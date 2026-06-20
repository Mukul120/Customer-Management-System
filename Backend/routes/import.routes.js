const express = require("express");
const { createImportJob, getImportJob } = require("../controllers/importJob.controller");

const router = express.Router();


router.post("/", createImportJob);
router.get("/:importJobId", getImportJob);


module.exports = router;

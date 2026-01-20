const express = require("express");
const router = express.Router();

router.use("/", require("./agentService.routes"));
router.use("/", require("./agentVersion.routes"));
router.use("/", require("./masterAgentdata.routes"));
router.use("/", require("./job.routes"));
router.use("/", require("./bulk.routes"));

module.exports = router;
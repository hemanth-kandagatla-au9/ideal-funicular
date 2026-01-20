const express = require("express");
const router = express.Router();
const jobsController = require("../../controllers/jobController");

// Job-related routes
router.post("/jobs", jobsController.jobs);
router.post("/jobs/start", jobsController.start);
router.post("/jobs/stop", jobsController.stopjob);
router.put("/jobs/restart", jobsController.restart);

router.post("/job", jobsController.getJobDetails);
router.post("/postjob", jobsController.postJob);
router.put("/updatejob", jobsController.updateJob);
router.delete("/deletejob", jobsController.deleteJob);
router.post("/joblogs", jobsController.getJobLogs);

module.exports = router;
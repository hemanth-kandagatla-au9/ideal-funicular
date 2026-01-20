const { getJobs, putStart, putStop, putRestart, getJobDetails, postJob, deleteJob, updateJob, getJobLogs } = require("../services/agentService");
const { handleApiResponse } = require("../utils/agentUtils");

module.exports = {
    jobs: (req, res) => handleApiResponse(req, res, getJobs),
    start: (req, res) => handleApiResponse(req, res, putStart),
    stopjob: (req, res) => handleApiResponse(req, res, putStop),
    restart: (req, res) => handleApiResponse(req, res, putRestart),
    getJobDetails: (req, res) => handleApiResponse(req, res, getJobDetails),
    postJob: (req, res) => handleApiResponse(req, res, postJob),
    deleteJob: (req, res) => handleApiResponse(req, res, deleteJob),
    updateJob: (req, res) => handleApiResponse(req, res, updateJob),
    getJobLogs: (req, res) => handleApiResponse(req, res, getJobLogs),
}
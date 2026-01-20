const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const cron = require('node-cron');
const bodyParser = require("body-parser");
const agentRoutes = require("./routes/agentRoutes/index");
const rustagentRoutes = require("./routes/rustAgentRoutes/rustAgent.routes");
const uiMonitoringRoutes = require("./routes/uiMonitoringRoutes/uiMonitoring.routes");
const versionManagementRoutes = require("./routes/versionManagementRoutes/versionManagement.routes")
const authRoutes = require("./auth/routes/auth.routes");
// const {validateTokenEndpoint} = require("./auth/controllers/tokenController");
const agentController = require("./cron/agentInfo");
const versionSyncController = require("./cron/versionSync");
const { validate, validatewithBasicAuth } = require('./middlewares/agentMiddleware');
const { APP_CONFIG } = require("../config");
const db = require("./database/connection");
const app = express();
const cookieParser =  require('cookie-parser')
// const authMiddleware =  require('./middlewares/authMiddleware')

db.InitiateMongoServer()
// Allowed domains for CORS
const allowlist = process.env.ALLOWED_ORIGIN.split(',');

// Middleware
app.use(cookieParser())
app.use(cors()); // Allows all origins by default

// app.use(cors(corsOptionsDelegate));
// app.use(authMiddleware)
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

app.set("view engine", "pug");


// Routes
app.use("/auth", authRoutes);
app.use("/uiMonitoring", validate, uiMonitoringRoutes);
app.use("/agents",validate , agentRoutes);
app.use("/rustagent", validatewithBasicAuth, rustagentRoutes);
app.use("/versionManagement", validate, versionManagementRoutes);
// app.get('/initDB', validatewithBasicAuth, async (req, res) => {
//   try {
//     const createdCollections = await db.createDB();
//     res.status(200).json({ message: "Database initialized successfully", createdCollections });
//   } catch (error) {
//     console.error("Error initializing database:", error);
//     res.status(500).send("Failed to initialize database");
//   }
// });
app.get('/', (req, res) => res.send({ 'ENV': process.env.NODE_ENV, "Allowed domains": allowlist }));

if (process.env.NODE_ENV === "local") {
  app.listen(process.env.port, (err) => {
    if (err) {
      console.log("Error in server setup");
    } else {
      console.log("Server listening on Port", process.env.port);
    }
  });
}

cron.schedule(APP_CONFIG.ACTIVE_AGENTINFO_CRON, () => {
  agentController.syncAgentStatus();
});
cron.schedule(APP_CONFIG.FAILED_AGENTINFO_CRON, () => {
  agentController.updateFailedAgentStatus();
});
cron.schedule(APP_CONFIG.VERSION_SYNC_CRON, () => {
  versionSyncController.syncVersionData();
});

module.exports = app;
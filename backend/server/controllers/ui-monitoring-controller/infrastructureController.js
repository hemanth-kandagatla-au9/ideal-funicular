const { infrastructureMonitoring } = require("./uiMonitoringConfigs");

const fetchInfrastructureMonitoringData = async (req, res) => {
    try {
        // const licenceData = await getLicenseData(req);
        res.status(200).json({
            status: 'success',
            statusCode: 200,
            message: 'Data fetched successfully',
            data: infrastructureMonitoring
        });
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

module.exports = { fetchInfrastructureMonitoringData };
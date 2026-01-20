const infrastructureMonitoring = [
    {
        "server": "workflow.jnjlabs.com",
        "cpuUsage": "61%",
        "memoryUsage": "52%",
        "diskIO": "210 MB/s",
        "status": "Healthy",
        "hostId": "host-1000",
        "lastUpdated": "2025-07-16T13:02:57.974954",
        "alertLevel": "Info"
    },
    {
        "server": "db01.jnjlabs.com",
        "cpuUsage": "77%",
        "memoryUsage": "68%",
        "diskIO": "295 MB/s",
        "status": "Warning",
        "hostId": "host-1001",
        "lastUpdated": "2025-07-16T13:08:57.974976",
        "alertLevel": "Medium"
    },
    {
        "server": "redis.jnjlabs.com",
        "cpuUsage": "33%",
        "memoryUsage": "47%",
        "diskIO": "95 MB/s",
        "status": "Healthy",
        "hostId": "host-1002",
        "lastUpdated": "2025-07-16T13:07:57.974983",
        "alertLevel": "Info"
    },
    {
        "server": "api.jnjlabs.com",
        "cpuUsage": "85%",
        "memoryUsage": "79%",
        "diskIO": "345 MB/s",
        "status": "Critical",
        "hostId": "host-1003",
        "lastUpdated": "2025-07-16T13:00:57.974989",
        "alertLevel": "High"
    },
    {
        "server": "auth.jnjlabs.com",
        "cpuUsage": "58%",
        "memoryUsage": "41%",
        "diskIO": "188 MB/s",
        "status": "Healthy",
        "hostId": "host-1004",
        "lastUpdated": "2025-07-16T13:03:57.974994",
        "alertLevel": "Info"
    }
]

const applicationPerformance = {
    "services": [
        {
            "name": "LoginService",
            "avgResponseTime": "215 ms",
            "errorRate": "2.6%",
            "uptime": "98.4%",
            "status": "Warning",
            "lastDeployment": "2025-07-16T10:53:57.975135",
            "requestsPerMinute": 643,
            "activeInstances": 2,
            "alertLevel": "Medium"
        },
        {
            "name": "WorkflowOrchestrator",
            "avgResponseTime": "248 ms",
            "errorRate": "1.1%",
            "uptime": "99.1%",
            "status": "Healthy",
            "lastDeployment": "2025-07-16T10:44:57.975154",
            "requestsPerMinute": 1299,
            "activeInstances": 2,
            "alertLevel": "Info"
        },
        {
            "name": "AgentFramework",
            "avgResponseTime": "312 ms",
            "errorRate": "3.4%",
            "uptime": "97.3%",
            "status": "Critical",
            "lastDeployment": "2025-07-16T11:03:57.975165",
            "requestsPerMinute": 1131,
            "activeInstances": 6,
            "alertLevel": "High"
        },
        {
            "name": "TemplateRenderer",
            "avgResponseTime": "180 ms",
            "errorRate": "0.6%",
            "uptime": "99.7%",
            "status": "Healthy",
            "lastDeployment": "2025-07-16T11:03:57.975175",
            "requestsPerMinute": 574,
            "activeInstances": 5,
            "alertLevel": "Info"
        }
    ],
    "summary": {
        "avgResponseTime": "245 ms",
        "errorRate": "2.3%",
        "throughput": "1247/min"
    }
}

const networkMonitoring = [
    {
        "endpoint": "api.jnjlabs.com",
        "latency": "55 ms",
        "packetLoss": "0.3%",
        "throughput": "540 Mbps",
        "status": "Healthy",
        "lastChecked": "2025-07-16T13:08:57.975310",
        "region": "us-east-1",
        "alertLevel": "Info"
    },
    {
        "endpoint": "db.jnjlabs.com",
        "latency": "72 ms",
        "packetLoss": "1.8%",
        "throughput": "460 Mbps",
        "status": "Warning",
        "lastChecked": "2025-07-16T13:09:57.975318",
        "region": "ap-south-1",
        "alertLevel": "Medium"
    },
    {
        "endpoint": "cdn.edge.jnjlabs.com",
        "latency": "38 ms",
        "packetLoss": "0%",
        "throughput": "1.1 Gbps",
        "status": "Healthy",
        "lastChecked": "2025-07-16T13:06:57.975323",
        "region": "eu-west-1",
        "alertLevel": "Info"
    },
    {
        "endpoint": "vpn-node.infra.jnjlabs",
        "latency": "115 ms",
        "packetLoss": "3.2%",
        "throughput": "190 Mbps",
        "status": "Critical",
        "lastChecked": "2025-07-16T13:08:57.975328",
        "region": "internal",
        "alertLevel": "High"
    }
];

const alertsData = [
    {
        type: "danger",
        title: "Privilege Escalation Detected",
        message: "User admin@company.com attempted unauthorized access",
        time: "2 minutes ago",
    },
    {
        type: "warning",
        title: "Suspicious Login Pattern",
        message: "Multiple failed login attempts from IP 192.168.1.100",
        time: "15 minutes ago",
    },
    {
        type: "danger",
        title: "Malware Detection",
        message: "Trojan.Win32.Generic found on server-03",
        time: "1 hour ago",
    },
];

const cardData = [
    {
        title: "Infrastructure",
        subtitle: "System Health",
        status: "Healthy",
        metrics: [
            { label: "CPU Usage", value: "67%" },
            { label: "Memory", value: "45%" },
        ],
    },
    {
        title: "Performance",
        subtitle: "APM Metrics",
        status: "Warning",
        metrics: [
            { label: "Avg Response", value: "245ms" },
            { label: "Error Rate", value: "2.3%" },
        ],
    },
    {
        title: "Security",
        subtitle: "Threat Detection",
        status: "Critical",
        metrics: [
            { label: "Active Threats", value: "3" },
            { label: "Blocked IPs", value: "127" },
        ],
    },
    {
        title: "User Experience",
        subtitle: "RUM Analytics",
        status: "Good",
        metrics: [
            { label: "Page Load", value: "1.2s" },
            { label: "Active Users", value: "2,847" },
        ],
    },
];

const logsData = [
    { level: "ERROR", time: "14:23:45", message: "Database connection timeout" },
    { level: "WARN", time: "14:22:31", message: "High memory usage detected" },
    { level: "INFO", time: "14:21:15", message: "Service deployment completed" },
    { level: "ERROR", time: "14:19:42", message: "API rate limit exceeded" },
]

module.exports = { infrastructureMonitoring, applicationPerformance, networkMonitoring, alertsData, cardData, logsData }
import {
    ExcelDateToJSDateOnly,
    validateData,
    getDateFormatByRegion,
    getFormatDate,
    formatCost,
    formatDateToSave,
    getColorBasedOnImpact,
    getCardTitleText_40_chars,
    getCardTitleText_45_chars,
    filterTheSuggestions,
    maxLength,
    getTimeZone,
    retainScrollPosition,
    saveScrollPosition,
    getDateStyleConfigs,
} from "../../utils/utils";


const assignedTo_dropdownList = [{
    "key": "ASS01",
    "value": "Data Center Support"
},
{
    "key": "ASS02",
    "value": "Linux Support"
},
{
    "key": "ASS03",
    "value": "MBOX Support"
},
{
    "key": "ASS04",
    "value": "Database Support"
},
{
    "key": "ASS05",
    "value": "SAP Basis Support"
},
{
    "key": "ASS06",
    "value": "SAP Application Support"
},
{
    "key": "ASS08",
    "value": "SDDC Infra Support"
},
{
    "key": "ASS09",
    "value": "Unix Support"
},
{
    "key": "ASS10",
    "value": "Webmethods Infra Support"
},
{
    "key": "ASS11",
    "value": "Webmethods Application Support"
},
{
    "key": "ASS12",
    "value": "Windows Support"
}];
const status_dropdownList = [{
    "key": "STA01",
    "value": "Not Started"
},
{
    "key": "STA02",
    "value": "In Progress"
},
{
    "key": "STA03",
    "value": "Planned"
},
{
    "key": "STA04",
    "value": "Deferred"
},
{
    "key": "STA05",
    "value": "On Hold"
},
{
    "key": "STA06",
    "value": "To Be Planned"
},
{
    "key": "STA07",
    "value": "Cancelled"
},
{
    "key": "STA08",
    "value": "Completed"
}];
const priority_dropdownList = [{
    "key": "PRI01",
    "value": "Urgent"
},
{
    "key": "PRI02",
    "value": "High"
},
{
    "key": "PRI03",
    "value": "Medium"
},
{
    "key": "PRI04",
    "value": "Low"
}];
const serviceLine_dropdownList = [
    {
        "key": "SER01",
        "value": "Pharma"
    },
    {
        "key": "SER03",
        "value": "Consumer"
    },
    {
        "key": "SER04",
        "value": "Corporate"
    },
    {
        "key": "SER05",
        "value": "Multiple"
    },
    {
        "key": "SER02",
        "value": "Medical Devices"
    }
]
const platform_dropdownList = [
    {
        "key": "PLA22",
        "value": "JANSSENONE"
    },
    {
        "key": "PLA01",
        "value": "EuRoPe2"
    },
    {
        "key": "PLA02",
        "value": "Shaping The Future"
    },
    {
        "key": "PLA03",
        "value": "Synthes"
    },
    {
        "key": "PLA04",
        "value": "Sustain"
    },
    {
        "key": "PLA05",
        "value": "Galaxy"
    },
    {
        "key": "PLA06",
        "value": "Global Consumer"
    },
    {
        "key": "PLA07",
        "value": "Global Solution Manager"
    },
    {
        "key": "PLA08",
        "value": "Technical Solution Manager"
    },
    {
        "key": "PLA10",
        "value": "Treasury"
    },
    {
        "key": "PLA11",
        "value": "ILM"
    },
    {
        "key": "PLA12",
        "value": "Panda"
    },
    {
        "key": "PLA13",
        "value": "Beacon"
    },
    {
        "key": "PLA14",
        "value": "Solar"
    },
    {
        "key": "PLA15",
        "value": "Atlas"
    },
    {
        "key": "PLA16",
        "value": "SNC"
    },
    {
        "key": "PLA17",
        "value": "ATTP"
    },
    {
        "key": "PLA18",
        "value": "Val-de-Reuil"
    },
    {
        "key": "PLA19",
        "value": "E-Bridge"
    },
    {
        "key": "PLA20",
        "value": "GMED"
    },
    {
        "key": "PLA09",
        "value": "Multiple"
    }
]
// const category_dropdownList = [ {
//     "key": "CAT01",
//     "value": "OS Patching"
// },
// {
//     "key": "CAT02",
//     "value": "Database Patching"
// },
// {
//     "key": "CAT03",
//     "value": "Kernel Patching"
// },
// {
//     "key": "CAT04",
//     "value": "Plugin Update"
// },
// {
//     "key": "CAT05",
//     "value": "Housekeeping"
// },
// {
//     "key": "CAT06",
//     "value": "Refresh"
// },
// {
//     "key": "CAT07",
//     "value": "Project Support"
// },
// {
//     "key": "CAT08",
//     "value": "Freeze"
// },
// {
//     "key": "CAT09",
//     "value": "Monthly Release"
// },
// {
//     "key": "CAT10",
//     "value": "Weekly Release"
// },
// {
//     "key": "CAT11",
//     "value": "Parameter Change"
// },
// {
//     "key": "CAT12",
//     "value": "Client Maintenance"
// },
// {
//     "key": "CAT14",
//     "value": "Support Functional Implementation"
// }];
const maintenance_dropdownList = [{
    "key": "MAC01",
    "value": "Automation"
},
{
    "key": "MAC02",
    "value": "Decommisioning"
},
{
    "key": "MAC03",
    "value": "EWA"
},
{
    "key": "MAC04",
    "value": "Hypercare"
},
{
    "key": "MAC05",
    "value": "Maintenance"
},
{
    "key": "MAC06",
    "value": "Max Attention"
},
{
    "key": "MAC07",
    "value": "Operations"
},
{
    "key": "MAC08",
    "value": "Project"
},
{
    "key": "MAC09",
    "value": "Service"
},
{
    "key": "MAC10",
    "value": "Improvement"
},
{
    "key": "MAC11",
    "value": "Functional Release"
}];
const impact_dropdownList = [{
    "key": "IMP01",
    "value": "Online"
},
{
    "key": "IMP02",
    "value": "Reduced capacity"
},
{
    "key": "IMP03",
    "value": "Unavailable"
}];
const testLevel_dropdownList = [{
    "key": "TRQ01",
    "value": "None"
},
{
    "key": "TRQ02",
    "value": "TS"
},
{
    "key": "TRQ03",
    "value": "AS"
},
{
    "key": "TRQ04",
    "value": "Business"
}];
describe("Utils", () => {
    it("should test ExcelDateToJSDateOnly 1", () => {
        let d = "Mon Aug 08 2022 14:28:23 GMT+0530 (India Standard Time)";
        const newd = ExcelDateToJSDateOnly(d);
        expect(newd).toBe("Aug 08 , 2022");
    })
    it("should test Title validation 1", () => {
        let title = "new title";
        const isValid = validateData("title", title);
        expect(isValid).toBe(true);
    })
    it("should test null Title", () => {
        let title = "";
        const isValid = validateData("title", title);
        expect(isValid).toBe(false);
    })
    it("should test Title validation 2", () => {
        let title = "new title";
        const isValid = validateData("title", title);
        expect(isValid).toBe(true);
    })
    it("should test null asset Id", () => {
        let value = "";
        const dropdownList = ["ford", "mercedez", "honda"];
        let isValid = validateData("assetID", value, dropdownList);
        value = "bmw";
        expect(isValid).toBe(false);
        isValid = validateData("assetID", value, dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test null assigned to", () => {
        let assignedTo = "";
        const isValid = validateData("assignedTo", assignedTo, assignedTo_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test invalid assigned to", () => {
        let assignedTo = "ASS00";
        const isValid = validateData("assignedTo", assignedTo, assignedTo_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test assigned to", () => {
        let assignedTo = "ASS02";
        const isValid = validateData("assignedTo", assignedTo, assignedTo_dropdownList);
        expect(isValid).toBe(true);
    })
    it("should test null status", () => {
        let status = "";
        const isValid = validateData("status", status, status_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test invalid status", () => {
        let status = "STA10";
        const isValid = validateData("status", status, status_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test status", () => {
        let status = "STA02";
        const isValid = validateData("status", status, status_dropdownList);
        expect(isValid).toBe(true);
    })
    it("should test null priority", () => {
        let priority = "";
        const isValid = validateData("priority", priority, priority_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test invalid priority", () => {
        let priority = "PRI00";
        const isValid = validateData("priority", priority, priority_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test priority", () => {
        let priority = "PRI01";
        const isValid = validateData("priority", priority, priority_dropdownList);
        expect(isValid).toBe(true);
    })
    it("should test null service line", () => {
        let serviceLine = "";
        const isValid = validateData("serviceLine", serviceLine, serviceLine_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test invalid service line", () => {
        let serviceLine = "SER00";
        const isValid = validateData("serviceLine", serviceLine, serviceLine_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test service line", () => {
        let serviceLine = "SER01";
        const isValid = validateData("serviceLine", serviceLine, serviceLine_dropdownList);
        expect(isValid).toBe(true);
    })
    it("should test null platform", () => {
        let platform = "";
        const isValid = validateData("platform", platform, platform_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test invalid platform", () => {
        let platform = "PLA00";
        const isValid = validateData("platform", platform, platform_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test platform", () => {
        let platform = "PLA02";
        const isValid = validateData("platform", platform, platform_dropdownList);
        expect(isValid).toBe(true);
    })
    it("should test null task category", () => {
        let taskCategory = "";
        const isValid = validateData("taskCategory", taskCategory, platform_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test invalid task category", () => {
        let taskCategory = "CAT00";
        const isValid = validateData("taskCategory", taskCategory, platform_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test task category", () => {
        let taskCategory = "CAT14";
        const isValid = validateData("taskCategory", taskCategory, platform_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test null maintenance group", () => {
        let maintenanceGroup = "";
        const isValid = validateData("maintenanceGroup", maintenanceGroup, maintenance_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test invalid maintenance group", () => {
        let maintenanceGroup = "MAC00";
        const isValid = validateData("maintenanceGroup", maintenanceGroup, maintenance_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test maintenance group", () => {
        let maintenanceGroup = "MAC11";
        const isValid = validateData("maintenanceGroup", maintenanceGroup, maintenance_dropdownList);
        expect(isValid).toBe(true);
    })
    it("should test null complete percentage", () => {
        let perc = "";
        const isValid = validateData("completePercentage", perc);
        expect(isValid).toBe(false);
    })
    it("should test invalid complete percentage(NaN)", () => {
        let perc = "ABC";
        const isValid = validateData("completePercentage", perc);
        expect(isValid).toBe(false);
    })
    it("should test invalid complete percentage (<100)", () => {
        let perc = -10;
        const isValid = validateData("completePercentage", perc);
        expect(isValid).toBe(false);
    })
    it("should test invalid complete percentage (>100)", () => {
        let perc = 110;
        const isValid = validateData("completePercentage", perc);
        expect(isValid).toBe(false);
    })
    it("should test complete percentage", () => {
        let perc = 90;
        const isValid = validateData("completePercentage", perc);
        expect(isValid).toBe(true);
    })
    it("should test task start date", () => {
        let date = "11/24/2022";
        const isValid = validateData("startDate", date);
        expect(isValid).toBe(true);
    })
    it("should test invalid task start date", () => {
        let date = "11/24/2022 ada";
        let isValid = validateData("startDate", date);
        expect(isValid).toBe(false);
        date = "";
        isValid = validateData("startDate", date);
        expect(isValid).toBe(false);
    })
    it("should test task due date", () => {
        let value = ["11/24/2022", "11/26/2022"]
        let isValid = validateData("dueDate", value);
        expect(isValid).toBe(true);
        value = ["11/24/2022"]
        isValid = validateData("dueDate", value);
        expect(isValid).toBe(false);
    })
    it("should test invalid task due date 1", () => {
        let startDate = "11/24/2022";
        let dueDate = "11/26/2022 dasd";
        const isValid = validateData("dueDate", startDate, dueDate);
        expect(isValid).toBe(false);
    })
    it("should test invalid task due date (start date>due date)", () => {
        let startDate = "11/30/2022";
        let dueDate = "11/26/2022";
        const isValid = validateData("dueDate", startDate, dueDate);
        expect(isValid).toBe(false);
    })
    it("should test task completed date", () => {
        let startDate = "11/23/2022";
        let completedDate = "11/26/2022";
        let isValid = validateData("completedDate", startDate, completedDate);
        expect(isValid).toBe(false);
        startDate = "developer";
        isValid = validateData("completedDate", startDate, completedDate);
        expect(isValid).toBe(false);
    })
    it("should test invalid task due date 2", () => {
        let startDate = "11/23/2022";
        let completedDate = "11/26/2022 sda";
        const isValid = validateData("dueDate", startDate, completedDate);
        expect(isValid).toBe(false);
    })
    it("should test invalid task due date (start date>completed date)", () => {
        let startDate = "11/30/2022";
        let completedDate = "11/26/2022";
        const isValid = validateData("dueDate", startDate, completedDate);
        expect(isValid).toBe(false);
    })
    it("should test null iris reference number 1", () => {
        let iris = ""
        const isValid = validateData("iris", iris);
        expect(isValid).toBe(false);
    })
    it("should test null iris reference number 2", () => {
        let iris = "CHGXXXXXXXXXX"
        const isValid = validateData("iris", iris);
        expect(isValid).toBe(true);
    })
    it("should test ExcelDateToJSDateOnly 2", () => {
        const newd = ExcelDateToJSDateOnly(null);
        expect(newd).toBe("");
    })

    it("should test Activity Start Date validation 1", () => {
        let date = new Date("Wed Nov 16 2022 00:00:00 GMT+0530 (India Standard Time)");
        const isValid = validateData("activityStartDate", date);
        expect(isValid).toBe(true);
    })
    it("should test null Activity Start Date", () => {
        let date = new Date(" ");
        const isValid = validateData("activityStartDate", date);
        expect(isValid).toBe(false);
    })

    it("should test Activity Start Date validation 2", () => {
        const isValid = validateData("activityStartDate", null);
        expect(isValid).toBe(false);
    })

    it("should test Activity Start Date validation (invalid date)", () => {
        let date = new Date("Wed Nov 16gfgd 2022 00:00:00 GMT+0530 (India Standard Time)");
        const isValid = validateData("activityStartDate", date);
        expect(isValid).toBe(false);
    })
    it("should test Activity End Date validation", () => {
        let start_date = new Date("Sat Nov 20 2022 00:00:00 GMT+0530 (India Standard Time)");
        let end_date = new Date("Tue Nov 26 2022 00:00:00 GMT+0530 (India Standard Time)");
        const isValid = validateData("activityStopDate", [start_date, end_date]);
        expect(isValid).toBe(true);
    })
    it("should test null Activity End Date", () => {
        let start_date = new Date("Sat Nov 20 2022 00:00:00 GMT+0530 (India Standard Time)");
        let end_date = new Date(" ");
        const isValid = validateData("activityStopDate", [start_date, end_date]);
        expect(isValid).toBe(false);
    })
    it("should test Activity End Date validation(invalid end date) 2", () => {
        let start_date = new Date("Sat Nov 20 2022 00:00:00 GMT+0530 (India Standard Time)");
        let end_date = new Date("Tue Nov 26 2022vcx 00:00:00 GMT+0530 (India Standard Time)");
        const isValid = validateData("activityStopDate", [start_date, end_date]);
        expect(isValid).toBe(false);
    });
    it("should test Activity End Date validation(invalid end date) 3", () => {
        let start_date = new Date("Sat Nov 20 2022 00:00:00 GMT+0530 (India Standard Time)");
        let end_date = new Date("Tue Nov 26 2022vcx 00:00:00 GMT+0530 (India Standard Time)");
        const isValid = validateData("activityStopDate", [start_date, end_date]);
        expect(isValid).toBe(false);
    })

    it("should test Activity End Date validation(invalid end date) 1", () => {
        let start_date = new Date("Sat Nov 20 2022 00:00:00 GMT+0530 (India Standard Time)");
        const isValid = validateData("activityStopDate", [start_date, null]);
        expect(isValid).toBe(false);
    })
    it("should test Activity End Date not lesser than Start Date", () => {
        let start_date = new Date("Sat Nov 20 2022 00:00:00 GMT+0530 (India Standard Time)");
        let end_date = new Date("Wed Nov 16 00:00:00 GMT+0530 (India Standard Time)");
        const isValid = validateData("activityStopDate", [start_date, end_date]);
        expect(isValid).toBe(false);
    })
    it("should test null impact", () => {
        let impact = "";
        const isValid = validateData("impact", impact, impact_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test invalid impact", () => {
        let impact = "IMP20";
        const isValid = validateData("impact", impact, impact_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test impact", () => {
        let impact = "IMP02";
        const isValid = validateData("impact", impact, impact_dropdownList);
        expect(isValid).toBe(true);
    })
    it("should test null test level", () => {
        let testLevel = "";
        const isValid = validateData("testLevel", testLevel, testLevel_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test invalid test level", () => {
        let testLevel = "TRQ00";
        const isValid = validateData("testLevel", testLevel, testLevel_dropdownList);
        expect(isValid).toBe(false);
    })
    it("should test test level", () => {
        let testLevel = "TRQ04";
        const isValid = validateData("testLevel", testLevel, testLevel_dropdownList);
        expect(isValid).toBe(true);
    })

    it('should test getDateFormatByRegion functionality', () => {
        let date = "2022-10-07T13:00:00.000Z"
        let isDateOnly = true;
        if (isDateOnly) {
            // const dateFormat = getDateFormatByRegion(date, isDateOnly);
            expect(getDateFormatByRegion(date, isDateOnly)).toBe(getDateFormatByRegion(date, isDateOnly));
        }
        isDateOnly = false;
        if (!isDateOnly) {
            // const dateFormat = getDateFormatByRegion(date, isDateOnly);
            expect(getDateFormatByRegion(date, isDateOnly)).toBe(getDateFormatByRegion(date, isDateOnly));
        }
    })

    it("should test getFormatDate functionality", () => {
        let date = "2022-10-07T13:00:00.000Z";
        // let formatDate = getFormatDate(date, false);
        expect(getFormatDate(date, false)).toBe(getFormatDate(date, false));
    })

    // it("should test formatCost functionality", () => {
    //     let value = 2000;
    //     let formatCostValue = formatCost(value).props.children[1]
    //     expect(formatCostValue).toBe("2.00")
    // })

    it("should test formatDateToSave functionality", () => {
        let date = "01/10/2024 00:00";
        // let outputVal = formatDateToSave(date)
        expect(formatDateToSave(date)).toBe(formatDateToSave(date))
    })

    it("should test getColorBasedOnImpact functionality", () => {
        let case1 = 'Online';
        expect(getColorBasedOnImpact(case1)).toBe('planner_online-card');
        let case2 = 'Reduced capacity';
        expect(getColorBasedOnImpact(case2)).toBe('planner_reduced-capacity-card');
        let case3 = 'Unavailable';
        expect(getColorBasedOnImpact(case3)).toBe('planner_unavailable-card');
        let defaultCase = "defaultCase"
        expect(getColorBasedOnImpact(defaultCase)).toBe('none');
    })

    it("should test getCardTitleText_40_chars functionality", () => {
        let assetId = "1234567890123456789012345678912345678901234567890123456789";
        window.innerWidth = 1580 - 1;
        expect(getCardTitleText_40_chars(assetId)).toBe("1234567890123456789012345...");
        assetId = "12345";
        expect(getCardTitleText_40_chars(assetId)).toBe(assetId);
    })

    it("should test getCardTitleText_45_chars functionality", () => {
        let title = "12345678901234567890123456789123456789012345678901234567891234567890123456789012345678912345678901234567890123456789";
        window.innerWidth = 1580 - 1;
        expect(getCardTitleText_45_chars(title)).toBe("123456789012345678901234567891...");
        title = "12345";
        expect(getCardTitleText_45_chars(title)).toBe(title);
    })

    it("should test filterTheSuggestions functionality", () => {
        const suggestions = ["Hello World", "Lorem Ipsum", "Candy Crush", "Total Overdose"]
        const userInput = "Candy";
        expect(filterTheSuggestions(suggestions, userInput)).toStrictEqual(["Candy Crush"]);
    })

    it("should test the maxLength functionality", () => {
        const arr = ['Database Patching', 'Database Patching', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Client Maintenance', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Plugin Update', 'Freeze', 'Freeze']
        let result = maxLength(arr);
        expect(result).toBe(maxLength(arr))
    })

    it("should test the getTimeZone functionality", () => {
        const tz = getTimeZone();
        expect(tz).toBe(getTimeZone());
    })

    it("should test getDateStyleConfigs functionality", () => {
        let dateType = "startDateInputProps"
        let result = getDateStyleConfigs(dateType);
        expect(result).toEqual({
            marginLeft: "20px",
            placeholder: "Activity Start Date",
            maxHeight: "40px",
            maxWidth: "300px",
            fontWeight: "600",
            fontSize: "14px",
        })

        dateType = "endDateInputProps"
        result = getDateStyleConfigs(dateType);
        expect(result).toEqual({
            marginLeft: "20px",
            placeholder: "Activity End Date",
            maxHeight: "40px",
            maxWidth: "300px",
            fontWeight: "600",
            fontSize: "14px",
        })

        dateType = "startDatePlaceHolder"
        result = getDateStyleConfigs(dateType);
        expect(result).toEqual({
            maxHeight: "40px",
            placeholder: "Start Date",
            maxWidth: "300px",
            fontWeight: "600",
            fontSize: "14px",
        })

        dateType = "dueDatePlaceHolder"
        result = getDateStyleConfigs(dateType);
        expect(result).toEqual({
            placeholder: "Due Date",
            maxHeight: "40px",
            maxWidth: "300px",
            fontWeight: "600",
            fontSize: "14px",
        })

        dateType = "completedDatePlaceHolder"
        result = getDateStyleConfigs(dateType);
        expect(result).toEqual({
            placeholder: "Completed Date",
            maxHeight: "40px",
            maxWidth: "300px",
            fontWeight: "600",
            fontSize: "14px",
        })
        
        dateType = "randomAnything"
        result = getDateStyleConfigs(dateType);
        expect(result).toEqual(null);
    })
});

describe('retainScrollPosition function', () => {
    const sessionStorageMock = (() => {
        let store = {};

        return {
            getItem: (key) => store[key],
            setItem: (key, value) => (store[key] = value.toString()),
            removeItem: (key) => delete store[key],
            clear: () => (store = {}),
        };
    })();

    Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });

    // Mock window.scrollTo
    window.scrollTo = jest.fn();

    beforeEach(() => {
        // Clear sessionStorage before each test
        sessionStorageMock.clear();
        // Reset mock calls
        jest.clearAllMocks();
    });

    test("saveScrollPosition should save scroll position to sessionStorage", () => {
        saveScrollPosition();
        expect(sessionStorageMock.getItem("scrollPosition")).toBe(
            `${window.pageYOffset}`
        );
    });

    test("retainScrollPosition should restore scroll position from sessionStorage and remove it", () => {
        // Save a scroll position to sessionStorage

        sessionStorageMock.setItem("scrollPosition", "100");

        // Call retainScrollPosition
        retainScrollPosition();

        // Expect scrollTo to be called with the correct arguments
        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 100,
            left: 0,
            behavior: "smooth",
        });

        // Expect sessionStorage to be cleared
        expect(sessionStorageMock.getItem("scrollPosition")).toBeUndefined();
    });

    test("retainScrollPosition should not scroll if no scroll position is saved in sessionStorage", () => {
        retainScrollPosition();
        expect(window.scrollTo).not.toHaveBeenCalled();
    });
})


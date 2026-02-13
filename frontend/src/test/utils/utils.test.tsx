/* eslint-disable prefer-const */
import Utils, { ExcelDateToJSDateOnly, formatTimestamp, bytesToMB, toPercentage, getDateFormatByRegion } from "../../utils/utils";

describe("Utils", () => {
    it("should test ExcelDateToJSDateOnly", () => {
        let d = "Mon Aug 08 2022 14:28:23 GMT+0530 (India Standard Time)";
        const newd = ExcelDateToJSDateOnly(d);
        expect(newd).toBe("Aug 08 , 2022");
    })

    it("should test ExcelDateToJSDateOnly with null", () => {
        const newd = ExcelDateToJSDateOnly(null);
        expect(newd).toBe("");
    })

    it("should test formatTimestamp", () => {
        const newd = formatTimestamp("Mon Aug 08 2022 14:28:23 GMT+0530 (India Standard Time)");
        expect(newd).not.toBe(null);
    })

    it("should test bytesToMB", () => {
        const newd = bytesToMB(50000000);
        expect(newd).toBe("47.68 MB");
    })

    it("should test bytesToMB with invalid input", () => {
        const newd = bytesToMB("apple");
        expect(newd).toBe("Invalid input");
    })

    it("should test toPercentage", () => {
        const newd = toPercentage(50.58585);
        expect(newd).toBe("50.586%");
    })

    it("should test getDateFormatByRegion with date only", () => {
        const date = "2022-08-08T14:28:23Z";
        const formattedDate = getDateFormatByRegion(date, true);
        expect(formattedDate).toMatch(/\d+/); // Should contain numbers
    })

    it("should test getDateFormatByRegion with date and time", () => {
        const date = "2022-08-08T14:28:23Z";
        const formattedDate = getDateFormatByRegion(date);
        expect(formattedDate).toMatch(/\d+/); // Should contain numbers
    })

    it("should test Utils default export", () => {
        expect(Utils.history).toBeDefined();
        expect(Utils.cookies).toBeDefined();
        expect(Utils.ExcelDateToJSDateOnly).toBeDefined();
        expect(Utils.getDateFormatByRegion).toBeDefined();
        expect(Utils.formatTimestamp).toBeDefined();
        expect(Utils.bytesToMB).toBeDefined();
        expect(Utils.toPercentage).toBeDefined();
    })
});
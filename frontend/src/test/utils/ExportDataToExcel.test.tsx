import ExcelUtils from "../../utils/ExportDataToExcel";

const jsonData = [
    {
        "name": "John Doe",
        "age": 30,
        "email": "johndoe@example.com",
        "isVerified": true
    },
    {
        "name": "Jane Smith",
        "age": 25,
        "email": "janesmith@example.com",
        "isVerified": false
    },
    {
        "name": "Alice Johnson",
        "age": 28,
        "email": "alicejohnson@example.com",
        "isVerified": true
    },
    {
        "name": "Bob Brown",
        "age": 35,
        "email": "bobbrown@example.com",
        "isVerified": false
    }
]

describe('ExportDataToExcel utils', () => {
    it('ExportDataToExcel - download data to excel', () => {
        ExcelUtils.exportDataToExcel(jsonData, 'datadownload')
    })
})




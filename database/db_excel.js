const DBFunction = require("./db_function");
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const os = require('os');

class DBExcel extends DBFunction {
    EXCEL_PATH = path.join(os.tmpdir(), 'mock_server_db.xlsx');
    
    constructor() {
        super();
        // Create temp Excel file if not exists, with a dummy sheet
        if (!fs.existsSync(this.EXCEL_PATH)) {
            const wb = XLSX.utils.book_new();
            // Add a dummy sheet to avoid "Workbook is empty" error
            const ws = XLSX.utils.json_to_sheet([]);
            XLSX.utils.book_append_sheet(wb, ws, 'Init');
            XLSX.writeFile(wb, this.EXCEL_PATH);
        }
    }

    onCreateTable(tableName) {
        try {
            const wb = XLSX.readFile(this.EXCEL_PATH);
            if (!wb.SheetNames.includes(tableName)) {
                const ws = XLSX.utils.json_to_sheet([]);
                XLSX.utils.book_append_sheet(wb, ws, tableName);
                XLSX.writeFile(wb, this.EXCEL_PATH);
            }
        } catch (e) {
            console.error(e);
        }
    }

    onSaveData(tableName, data) {
        try {
            const wb = XLSX.readFile(this.EXCEL_PATH);
            let ws = wb.Sheets[tableName];
            let rows = ws ? XLSX.utils.sheet_to_json(ws) : [];
            rows.push(data);
            wb.Sheets[tableName] = XLSX.utils.json_to_sheet(rows);
            if (!wb.SheetNames.includes(tableName)) {
                wb.SheetNames.push(tableName);
            }
            XLSX.writeFile(wb, this.EXCEL_PATH);
        } catch (e) {
            console.error(e);
        }
    }

    onGetData(tableName) {
        try {
            const wb = XLSX.readFile(this.EXCEL_PATH);
            const ws = wb.Sheets[tableName];
            if (ws) {
                return XLSX.utils.sheet_to_json(ws);
            }
        } catch (e) {
            console.error(e);
        }
        return undefined;
    }

    onDeleteData(tableName, id) {
        try {
            const wb = XLSX.readFile(this.EXCEL_PATH);
            let ws = wb.Sheets[tableName];
            if (ws) {
                let rows = XLSX.utils.sheet_to_json(ws);
                const idx = rows.findIndex(row => row.id == id);
                if (idx !== -1) {
                    rows.splice(idx, 1);
                    wb.Sheets[tableName] = XLSX.utils.json_to_sheet(rows);
                    XLSX.writeFile(wb, this.EXCEL_PATH);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    checkTableExist(tableName) {
        try {
            const wb = XLSX.readFile(this.EXCEL_PATH);
            return wb.SheetNames.includes(tableName);
        } catch {
            return false;
        }
    }

    isSeeded(tableName) {
        try {
            const wb = XLSX.readFile(this.EXCEL_PATH);
            const ws = wb.Sheets[tableName];
            if (ws) {
                const rows = XLSX.utils.sheet_to_json(ws);
                return rows.length > 0;
            }
        } catch {}
        return false;
    }

    purge(tableName) {
        try {
            if (tableName) {
                const wb = XLSX.readFile(this.EXCEL_PATH);
                if (wb.SheetNames.includes(tableName)) {
                    delete wb.Sheets[tableName];
                    wb.SheetNames = wb.SheetNames.filter(n => n !== tableName);
                    XLSX.writeFile(wb, this.EXCEL_PATH);
                }
            } else if (fs.existsSync(this.EXCEL_PATH)) {
                fs.unlinkSync(this.EXCEL_PATH);
            }
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = DBExcel;
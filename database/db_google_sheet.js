// filepath: /Users/prajyot/Documents/Work/Plugins/MockServer/dev/database/db_google_sheet.js
const { google } = require('googleapis');
const DBFunction = require("./db_function");

class DBGoogleSheet extends DBFunction
{
    constructor({ spreadsheetId, credentials })
    {
        super();
        this.spreadsheetId = spreadsheetId;

        const { client_email, private_key } = credentials;
        this.jwtClient = new google.auth.JWT(
            client_email,
            null,
            private_key,
            ['https://www.googleapis.com/auth/spreadsheets']
        );
        this.sheets = google.sheets({ version: 'v4', auth: this.jwtClient });
    }

    async onCreateTable(tableName)
    {
        try {
            const sheets = await this.sheets.spreadsheets.get({
                spreadsheetId: this.spreadsheetId,
            });
            const exists = sheets.data.sheets.some(
                sheet => sheet.properties.title === tableName
            );
            if (!exists) {
                await this.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: this.spreadsheetId,
                    requestBody: {
                        requests: [
                            {
                                addSheet: {
                                    properties: { title: tableName }
                                }
                            }
                        ]
                    }
                });
                // Add header row
                await this.sheets.spreadsheets.values.update({
                    spreadsheetId: this.spreadsheetId,
                    range: `${tableName}!A1`,
                    valueInputOption: 'RAW',
                    requestBody: { values: [['id', 'data']] }
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    async onSaveData(tableName, data)
    {
        try {
            await this.onCreateTable(tableName);
            const id = data.id || Date.now().toString();
            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: `${tableName}!A1`,
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                requestBody: {
                    values: [[id, JSON.stringify(data)]]
                }
            });
        } catch (e) {
            console.error(e);
        }
    }

    async onGetData(tableName)
    {
        try {
            const res = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: `${tableName}!A2:B`,
            });
            if (res.data.values) {
                return res.data.values.map(row => JSON.parse(row[1]));
            }
        } catch (e) {
            console.error(e);
        }
        return undefined;
    }

    async onDeleteData(tableName, id)
    {
        try {
            const res = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: `${tableName}!A2:B`,
            });
            if (!res.data.values) return;
            const rows = res.data.values;
            let rowIndex = -1;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i][0] == id) {
                    rowIndex = i + 2; // +2 because A1 is header, and index is 0-based
                    break;
                }
            }
            if (rowIndex !== -1) {
                await this.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: this.spreadsheetId,
                    requestBody: {
                        requests: [
                            {
                                deleteDimension: {
                                    range: {
                                        sheetId: await this._getSheetId(tableName),
                                        dimension: "ROWS",
                                        startIndex: rowIndex - 1,
                                        endIndex: rowIndex
                                    }
                                }
                            }
                        ]
                    }
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    async getTablePath(tableName)
    {
        return tableName;
    }

    async checkTableExist(tableName)
    {
        try {
            const sheets = await this.sheets.spreadsheets.get({
                spreadsheetId: this.spreadsheetId,
            });
            return sheets.data.sheets.some(
                sheet => sheet.properties.title === tableName
            );
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async isSeeded(tableName)
    {
        try {
            const res = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: `${tableName}!A2:B`,
            });
            return res.data.values && res.data.values.length > 0;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async purge(tableName)
    {
        try {
            if (tableName) {
                const sheetId = await this._getSheetId(tableName);
                if (sheetId !== null) {
                    await this.sheets.spreadsheets.batchUpdate({
                        spreadsheetId: this.spreadsheetId,
                        requestBody: {
                            requests: [
                                {
                                    deleteSheet: { sheetId }
                                }
                            ]
                        }
                    });
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    async _getSheetId(tableName)
    {
        const sheets = await this.sheets.spreadsheets.get({
            spreadsheetId: this.spreadsheetId,
        });
        const sheet = sheets.data.sheets.find(
            s => s.properties.title === tableName
        );
        return sheet ? sheet.properties.sheetId : null;
    }
}

module.exports = DBGoogleSheet;
const DBRam = require("./database/db_ram");
const DBFile = require("./database/db_file");
const DBFunction = require("./database/db_function");

class SimpleMockServer
{
    app;
    PORT;
    
    constructor(app, port)
    {
        if(!app)
        {
            const express = require("express");
            const cors = require('cors');
            this.app = express();
            this.app.use(cors());
            this.app.use(express.json());
        }
        
        this.PORT = port || 2000;
    }

    DBInstance;
    setTables(tables, dbInstance)
    {
        this.DBInstance = dbInstance;
        this.initDefaultAPI(tables);
    }
    
    customAPI(method, url, func)
    {
        this.app[method](url, func);
    }
    
    initDefaultAPI(tables)
    {
        for(let i in tables)
        {
            let table = tables[i]
            const tableName = table.name;
            this.DBInstance.createTable(tableName)
    
            if(table.seed && !this.DBInstance.isSeeded(tableName))
            {
                for(let i in table.seed)
                {
                    const seedData = table.seed[i]
                    this.DBInstance.saveData(tableName, seedData);    
                }
            }
    
            this.app.get(`/${table.name}`, (req, res) => 
            {
                const data = this.DBInstance.getData(tableName);
                if(data && data.length > 0)
                {
                    res.status(200).json({ data : data });
                }
                else
                {
                    res.status(200).json({ data : "No data found!" });
                }
            });
    
            this.app.post(`/${tableName}`, (req, res) => 
            {
                const receivedData = req.body
                this.DBInstance.saveData(tableName, receivedData);
                res.status(200).json({ success : true , id : receivedData.id});
            });
    
            this.app.put(`/${tableName}/:id`, (req, res) => 
            {
                const { id } = req.params;
                const data = req.body;

                this.DBInstance.editData(tableName, id, data);
                res.status(200).json({ success : true });
            });
    
            this.app.delete(`/${tableName}/:id`, (req, res) => 
            {
                const { id } = req.params;
                this.DBInstance.deleteData(tableName, id);
                res.status(200).json({ success : true });
            });

            this.app.get(`/${tableName}/seed`, (req, res) => 
            {
                this.DBInstance.purge(tableName);
                if(table.seed)
                {
                    for(let i in table.seed)
                    {
                        const seedData = table.seed[i]
                        DBInstance.saveData(tableName, seedData);    
                    }
                    res.status(200).json({ success : true });
                    return;
                }

                res.status(200).json({ success : false, message : "Table seed not found!" });
            });

            this.app.get(`/${tableName}/purge`, (req, res) => 
            {
                this.DBInstance.purge(tableName);
                res.status(200).json({ success : true });
            });

            this.app.get(`/${tableName}/:id`, (req, res) => 
            {
                const { id } = req.params;
                const dataList = this.DBInstance.getData(tableName);
                for(let i in dataList)
                {
                    const data = dataList[i];
                    console.log(data);
                    
                    if(data.id == id)
                    {
                        res.status(200).json({ success : true , data : data});
                        return;
                    }
                }
    
                res.status(200).json({ success : false , data : "No data found!"});
            });
        }
    }
    
    start()
    {
        this.app.listen(this.PORT, () => 
        {
            console.log("Server running");
        });
    }
}

module.exports = 
{
    SimpleMockServer,
    DBFile,
    DBRam,
    DBFunction
}


const myTables = 
[
    { 
        name : "Users",
        seed : 
        [
            {
                id : 1,
                first_name : "Jhon",
                last_name : "Dantas",
                company_name : null
            },
            {
                id : 2,
                first_name : "Jilly",
                last_name : "Jonson",
                company_name : null
            },
            {
                id : 3,
                first_name : "Peter",
                last_name : "Mathuse",
                company_name : null
            },
            {
                id : 4,
                first_name : "Nolan",
                last_name : "Recko",
                company_name : "Recko Rock Inc."
            },
            {
                id : 5,
                first_name : "Jhon",
                last_name : "Longbottom",
                company_name : null
            },
            {
                id : 6,
                first_name : "Misto",
                last_name : "Mekka",
                company_name : "Mekka Traders"
            }
        ] 
    }
]

const server = new SimpleMockServer();
const ram_instance = new DBRam();
server.setTables(myTables, ram_instance);
server.customAPI("get", "/custom", (req, resp) => 
{
    ram_instance.query("Users");
    ram_instance.and("last_name", "Longbottom", DBFunction.QUERY_OPERATION.EQUALS);
    
    const result = ram_instance.execute();
    resp.status(200).json({ data :result });
});


server.customAPI("get", "/list/real/:id", (req, resp) => {
    const data = {
        "metaData": {
            "columns": [
                {
                    "name": "BillId",
                    "filter": {
                        "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                        "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
                    },
                    "enumValues": [],
                    "displayName": "Bill Id"
                },
                {
                    "name": "Date",
                    "filter": {
                        "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                        "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
                    },
                    "enumValues": [],
                    "displayName": "Date"
                },
                {
                    "name": "ContactNo",
                    "filter": {
                        "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                        "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
                    },
                    "enumValues": [],
                    "displayName": "Contact No."
                },
                {
                    "name": "EmailId",
                    "filter": {
                        "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                        "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
                    },
                    "enumValues": [],
                    "displayName": "Email Id"
                },
                {
                    "name": "Amount",
                    "filter": {
                        "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                        "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
                    },
                    "enumValues": [],
                    "displayName": "Amount"
                },
                {
                    "name": "BillStatus",
                    "filter": {
                        "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                        "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
                    },
                    "enumValues": [
                        {
                            "transactionStatus": {
                                "Pending": "0",
                                "Success": "1"
                            }
                        }
                    ],
                    "displayName": "Bill Status"
                },
                {
                    "name": "Utility",
                    "filter": {
                        "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                        "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
                    },
                    "enumValues": [],
                    "displayName": "Utility"
                }
            ]
        },
        "data": [
            [
                "3115WYE1TW-dummy",
                null,
                "9930022575",
                "dineshjethva@gmail.com",
                "84999.68",
                null,
                "Electricity"
            ],
            [
                "NJ0O08IC5W-dummy",
                null,
                "9686178474",
                "praanesh.s@cashfree.com",
                "97098.84",
                null,
                "Electricity"
            ],
            [
                "5IZ9P0BURA-dummy",
                "17-10-2024 16:38:24 IST",
                "9999999999",
                "amul@mailinator.com",
                "10357.47",
                "Success",
                "Electricity"
            ],
            [
                "VFGFXXL3FW-dummy",
                null,
                "9686178474",
                "praanesh.s@cashfree.com",
                "4389.79",
                null,
                "Electricity"
            ],
            [
                "WIT8IEIDCV-dummy",
                "17-10-2024 16:11:39 IST",
                "9999999999",
                "amul@mailinator.com",
                "25558.53",
                "Success",
                "Electricity"
            ],
            [
                "HRGVAWPJ37-dummy",
                "17-10-2024 15:28:59 IST",
                "9999999999",
                "amul@mailinator.com",
                "23034.85",
                "Success",
                "Electricity"
            ],
            [
                "2N0PN6RQRA-dummy",
                "17-10-2024 15:24:13 IST",
                "9999999999",
                "amul@mailinator.com",
                "90907.64",
                "Success",
                "Electricity"
            ],
            [
                "BGNXYGOHU2-dummy",
                "17-10-2024 15:22:08 IST",
                "9999999999",
                "amul@mailinator.com",
                "12835.51",
                "Success",
                "Electricity"
            ],
            [
                "6717FVSQQU-dummy",
                "17-10-2024 15:20:19 IST",
                "9999999999",
                "qwqwqw@mailinator.com",
                "27994.8",
                "Success",
                "Electricity"
            ],
            [
                "KDV49KKXX3-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "qwqwqw@mailinator.com",
                "26783.94",
                "Pending",
                "Electricity"
            ],
            [
                "2OV9FGWU5L-dummy",
                "17-10-2024 15:13:33 IST",
                "9999999999",
                "amul@mailinator.com",
                "56230.08",
                "Success",
                "Electricity"
            ],
            [
                "IRH5IBS316-dummy",
                "17-10-2024 14:13:01 IST",
                "1223345566",
                "suresh.hande@aurionpro.com",
                "13329.61",
                "Success",
                "Electricity"
            ],
            [
                "T5HXWGO6XP-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "qwqwqw@mailinator.com",
                "14336.8",
                "Pending",
                "Electricity"
            ],
            [
                "7B2MX3UK8G-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "amul@mailinator.com",
                "3565.58",
                "Pending",
                "Electricity"
            ],
            [
                "LTO57RWP3H-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "amul@mailinator.com",
                "47217.62",
                "Pending",
                "Electricity"
            ],
            [
                "Z7JJD95XQ3-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "amul@mailinator.com",
                "2707.12",
                "Pending",
                "Electricity"
            ],
            [
                "JKA65B13RQ-dummy",
                "17-10-2024 12:14:30 IST",
                "9999999999",
                "amul@mailinator.com",
                "45710.75",
                "Success",
                "Electricity"
            ],
            [
                "J2FVML8ES1-dummy",
                "17-10-2024 12:12:30 IST",
                "9999999999",
                "amul@mailinator.com",
                "78779.18",
                "Success",
                "Electricity"
            ],
            [
                "4DM0ZGQ5O6-dummy",
                "17-10-2024 12:10:05 IST",
                "9999999999",
                "amul@mailinator.com",
                "86278.37",
                "Success",
                "Electricity"
            ],
            [
                "TRYPVLOUXV-dummy",
                "17-10-2024 12:07:50 IST",
                "9999999999",
                "amul@mailinator.com",
                "86298.37",
                "Success",
                "Electricity"
            ],
            [
                "7R7XZNOS8T-dummy",
                "17-10-2024 11:54:49 IST",
                "9999999999",
                "amul@mailinator.com",
                "37104.91",
                "Success",
                "Electricity"
            ],
            [
                "K7CXJQLK7S-dummy",
                "17-10-2024 11:50:19 IST",
                "9999999999",
                "amul@mailinator.com",
                "83201",
                "Success",
                "Electricity"
            ],
            [
                "3SEQSZ2GMV-dummy",
                "17-10-2024 11:48:42 IST",
                "9999999999",
                "amul@mailinator.com",
                "43231.04",
                "Success",
                "Electricity"
            ],
            [
                "NWREB2WQZS-dummy",
                "17-10-2024 11:41:50 IST",
                "9999999999",
                "amul@mailinator.com",
                "91321.46",
                "Success",
                "Electricity"
            ],
            [
                "RTY5YBH96Y-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "amul@mailinator.com",
                "16495.29",
                "Pending",
                "Electricity"
            ],
            [
                "MIQOHQR2BV-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "27089.58",
                null,
                "Electricity"
            ],
            [
                "9URXQT1OMN-dummy",
                null,
                "8605508066",
                "suresh@yopmail.com",
                "35659.21",
                null,
                "Electricity"
            ],
            [
                "KOXZT2B0ST-dummy",
                null,
                "8605508066",
                "hande@yopmail.com",
                "2279.43",
                null,
                "Electricity"
            ],
            [
                "S0R53U2TT5-dummy",
                "16-10-2024 14:20:55 IST",
                "8605508066",
                "suresh@yopmail.com",
                "28712.76",
                "Success",
                "Electricity"
            ],
            [
                "B6YFI5EQQM-dummy",
                "16-10-2024 14:15:34 IST",
                "8605508066",
                "suresh.hande@aurionpro.com",
                "6999.01",
                "Success",
                "Electricity"
            ],
            [
                "72X7VTHW7N-dummy",
                "01-01-0001 05:53:00 IST",
                "8605508066",
                "suresh.hande@aurionpro.com",
                "81995.65",
                "Pending",
                "Electricity"
            ],
            [
                "M9I2C9JYZH-dummy",
                "16-10-2024 11:35:39 IST",
                "0860550806",
                "suresh.hande@aurionpro.com",
                "29158.99",
                "Success",
                "Electricity"
            ],
            [
                "IGD1V4PI00-dummy",
                "15-10-2024 09:41:25 IST",
                "2222222222",
                "abc@mailinator.com",
                "24505.94",
                "Success",
                "Electricity"
            ],
            [
                "MK9BWVWVCX-dummy",
                "15-10-2024 09:39:56 IST",
                "2222222222",
                "abc@mailinator.com",
                "63659.44",
                "Success",
                "Electricity"
            ],
            [
                "0VQ6Q2XAQ1-dummy",
                "14-10-2024 17:48:57 IST",
                "9999999999",
                "amul@mailinator.com",
                "84319.96",
                "Success",
                "Electricity"
            ],
            [
                "4K4P15AK9O-dummy",
                "14-10-2024 17:45:35 IST",
                "9999999999",
                "amul@mailinator.com",
                "81835.04",
                "Success",
                "Electricity"
            ],
            [
                "08W31MDFGO-dummy",
                "14-10-2024 17:34:33 IST",
                "9999999999",
                "amul@mailinator.com",
                "67720.58",
                "Success",
                "Electricity"
            ],
            [
                "QHLXCWW8ST-dummy",
                "14-10-2024 17:28:30 IST",
                "9999999999",
                "amul@mailinator.com",
                "13799.11",
                "Success",
                "Electricity"
            ],
            [
                "UKDGQQOU95-dummy",
                "14-10-2024 17:14:52 IST",
                "9999999999",
                "amul@mailinator.com",
                "97959.53",
                "Success",
                "Electricity"
            ],
            [
                "H3W5PYEO71-dummy",
                "14-10-2024 17:07:30 IST",
                "9999999999",
                "amul@mailinator.com",
                "61922.19",
                "Success",
                "Electricity"
            ],
            [
                "DT0O61DADY-dummy",
                "14-10-2024 17:04:43 IST",
                "9999999999",
                "amul@mailinator.com",
                "63166.88",
                "Success",
                "Electricity"
            ],
            [
                "NIEVQRNDIA-dummy",
                "14-10-2024 17:01:50 IST",
                "9999999999",
                "amul@mailinator.com",
                "84175.63",
                "Success",
                "Electricity"
            ],
            [
                "RQADBA34OL-dummy",
                "14-10-2024 16:54:57 IST",
                "9999999999",
                "amul@mailinator.com",
                "51722.47",
                "Success",
                "Electricity"
            ],
            [
                "A8UMG9HM2M-dummy",
                "14-10-2024 16:50:28 IST",
                "9999999999",
                "amul@mailinator.com",
                "13388.07",
                "Success",
                "Electricity"
            ],
            [
                "8VNXOSSHY3-dummy",
                "14-10-2024 16:48:11 IST",
                "9999999999",
                "amul@mailinator.com",
                "25643.86",
                "Success",
                "Electricity"
            ],
            [
                "YF6ZKB5WR4-dummy",
                "14-10-2024 16:42:01 IST",
                "9999999999",
                "amul@mailinator.com",
                "28640.43",
                "Failure",
                "Electricity"
            ],
            [
                "GRR9ARE010-dummy",
                "14-10-2024 16:29:31 IST",
                "9999999999",
                "amul@mailinator.com",
                "27330.14",
                "Success",
                "Electricity"
            ],
            [
                "6JW1ZAWR7C-dummy",
                "14-10-2024 16:18:38 IST",
                "1234567891",
                "aaa@mailinator.com",
                "43632.33",
                "Success",
                "Electricity"
            ],
            [
                "LOY5F8WOFH-dummy",
                null,
                "1234567891",
                "aaa@mailinator.com",
                "63663.14",
                null,
                "Electricity"
            ],
            [
                "E8YZRO7H8Z-dummy",
                null,
                "1234567891",
                "aaa@mailinator.com",
                "30328.67",
                null,
                "Electricity"
            ],
            [
                "B7IWY9S868-dummy",
                "14-10-2024 15:47:08 IST",
                "9999999999",
                "amul@mailinator.com",
                "51527.71",
                "Success",
                "Electricity"
            ],
            [
                "ZF1PP8F26O-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "39209.31",
                null,
                "Electricity"
            ],
            [
                "RX50JYJBYR-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "73516.86",
                null,
                "Electricity"
            ],
            [
                "6PWMCPF0XW-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "10240.51",
                null,
                "Electricity"
            ],
            [
                "VX5WIQW8E9-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "6746.98",
                null,
                "Electricity"
            ],
            [
                "S28BVVYYD3-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "97294.83",
                null,
                "Electricity"
            ],
            [
                "HIA9G3UMEW-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "287.17",
                null,
                "Electricity"
            ],
            [
                "W9XESYB2Q9-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "69755.7",
                null,
                "Electricity"
            ],
            [
                "K7U7CD43MD-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "56075.68",
                null,
                "Electricity"
            ],
            [
                "XOGYSAZTIH-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "4372.41",
                null,
                "Electricity"
            ],
            [
                "C7T4SL0NYL-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "98865.62",
                null,
                "Electricity"
            ],
            [
                "TMZ13CYEUE-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "4760.47",
                null,
                "Electricity"
            ],
            [
                "KFQVM9A5BG-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "86285.67",
                null,
                "Electricity"
            ],
            [
                "84ZFXDFV21-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "41876.75",
                null,
                "Electricity"
            ],
            [
                "UCU34GXWX2-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "1054.23",
                null,
                "Electricity"
            ],
            [
                "FC5CLA7IK6-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "93371.51",
                null,
                "Electricity"
            ],
            [
                "28A56KMO0A-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "11713",
                null,
                "Electricity"
            ],
            [
                "V4CSU9G0T5-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "97414.94",
                null,
                "Electricity"
            ],
            [
                "QQHCJ4XGI0-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "74135.18",
                null,
                "Electricity"
            ],
            [
                "DL779YYF67-dummy",
                null,
                "1234567891",
                "aaa@mailinator.com",
                "29305.67",
                null,
                "Electricity"
            ],
            [
                "ZVH1PVA6JM-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "34370.91",
                null,
                "Electricity"
            ],
            [
                "YV8G0O2IMX-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "26806.74",
                null,
                "Electricity"
            ],
            [
                "6JVZFESHBV-dummy",
                "11-10-2024 17:10:28 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "70898.21",
                "Success",
                "Electricity"
            ],
            [
                "LTYR3DPXUZ-dummy",
                "11-10-2024 16:25:32 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "33136.57",
                "Success",
                "Electricity"
            ],
            [
                "D7ZI5Z6OV2-dummy",
                null,
                "1111111111",
                "neeraj.kasar@mailinator.com",
                "87499.36",
                null,
                "Electricity"
            ],
            [
                "7CKRMZZYW2-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "1102.35",
                null,
                "Electricity"
            ],
            [
                "2GQXBUA7FG-dummy",
                null,
                "1111111111",
                "neeraj.kasar@mailinator.com",
                "30093.15",
                null,
                "Electricity"
            ],
            [
                "MYTVUHL0LJ-dummy",
                null,
                "1111111111",
                "neeraj.kasar@mailinator.com",
                "64538.52",
                null,
                "Electricity"
            ],
            [
                "ZZKYO19RZC-dummy",
                null,
                "1111111111",
                "neeraj.kasar@mailinator.com",
                "11303.36",
                null,
                "Electricity"
            ],
            [
                "3RGUNR6XTA-dummy",
                "11-10-2024 12:39:12 IST",
                "1111111111",
                "neeraj@mailinator.com",
                "97763.05",
                "Success",
                "Electricity"
            ],
            [
                "N0QK9USRHC-dummy",
                "01-01-0001 05:53:00 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "44220.57",
                "Pending",
                "Electricity"
            ],
            [
                "XMWZEOX1OQ-dummy",
                "11-10-2024 12:20:04 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "15871.58",
                "Success",
                "Electricity"
            ],
            [
                "B64HQ3AA0Y-dummy",
                "01-01-0001 05:53:00 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "4313.13",
                "Pending",
                "Electricity"
            ],
            [
                "W2134DOHV6-dummy",
                "11-10-2024 11:32:09 IST",
                "8989898989",
                "suresh.hande@mailinator.com",
                "96334.19",
                "Success",
                "Electricity"
            ],
            [
                "WI7ZCD9542-dummy",
                null,
                "8989898989",
                "suresh.hande@mailinator.com",
                "2518.77",
                null,
                "Electricity"
            ],
            [
                "8XRWDQK60I-dummy",
                "10-10-2024 17:40:29 IST",
                "8989898989",
                "suresh.hande@mailinator.com",
                "2257.18",
                "Success",
                "Electricity"
            ],
            [
                "RICZ4VF1U3-dummy",
                "01-01-0001 05:53:00 IST",
                "8989898989",
                "suresh.hande@mailinator.com",
                "25901.46",
                "Pending",
                "Electricity"
            ],
            [
                "9XCXWJAZGH-dummy",
                "10-10-2024 16:54:59 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "92747.36",
                "Success",
                "Electricity"
            ],
            [
                "KEDAQ7KTJM-dummy",
                "01-01-0001 05:53:00 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "51613.21",
                "Pending",
                "Electricity"
            ],
            [
                "KVQZ4VMFAK-dummy",
                "10-10-2024 12:53:50 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "57323.34",
                "Success",
                "Electricity"
            ],
            [
                "KGXBSJD3O4-dummy",
                "10-10-2024 12:41:40 IST",
                "8989898989",
                "suresh.hande@mailinator.com",
                "95661.67",
                "Success",
                "Electricity"
            ],
            [
                "EP2N9DEERW-dummy",
                "01-01-0001 05:53:00 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "65119.02",
                "Pending",
                "Electricity"
            ],
            [
                "NSPZ1SOHXI-dummy",
                "10-10-2024 12:10:17 IST",
                "8989898989",
                "suresh.hande@mailinator.com",
                "27662.65",
                "Success",
                "Electricity"
            ],
            [
                "YC84TDUS7U-dummy",
                "10-10-2024 11:53:40 IST",
                "8989898989",
                "suresh.hande@mailinator.com",
                "17255.05",
                "Success",
                "Electricity"
            ],
            [
                "TFFI6AL6MF-dummy",
                "10-10-2024 11:37:07 IST",
                "8989898989",
                "suresh.hande@mailinator.com",
                "28543.17",
                "Success",
                "Electricity"
            ],
            [
                "Z5OFRZHE0Y-dummy",
                "10-10-2024 11:10:16 IST",
                "8989898989",
                "suresh.hande@mailinator.com",
                "60325.5",
                "Success",
                "Electricity"
            ],
            [
                "PPP9XX40EF-dummy",
                "10-10-2024 10:50:35 IST",
                "8989898989",
                "suresh.hande@mailinator.com",
                "45599.67",
                "Success",
                "Electricity"
            ],
            [
                "7673UZ2NMN-dummy",
                "10-10-2024 10:25:13 IST",
                "8989898989",
                "suresh.hande@mailinator.com",
                "23521.74",
                "Success",
                "Electricity"
            ],
            [
                "SUZQG0TYR7-dummy",
                "09-10-2024 17:39:35 IST",
                "8989898989",
                "suresh.hande@mailinator.com",
                "27842.29",
                "Success",
                "Electricity"
            ],
            [
                "1JGBME6EJL-dummy",
                "09-10-2024 17:15:31 IST",
                "8989898989",
                "suresh.hande@mailinator.com",
                "63513.35",
                "Success",
                "Electricity"
            ],
            [
                "FBR8A1L0VA-dummy",
                "09-10-2024 16:55:29 IST",
                "8989898989",
                "suresh.hande@mailinator.com",
                "12448.27",
                "Success",
                "Electricity"
            ],
            [
                "8XNC0YXQGC-dummy",
                "01-01-0001 05:53:00 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "30282.37",
                "Pending",
                "Electricity"
            ],
            [
                "OVHLL2F6M7-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "hande@mailinator.com",
                "80011.13",
                "Pending",
                "Electricity"
            ],
            [
                "9MFYBBL2NR-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "hande@mailinator.com",
                "54669.19",
                "Pending",
                "Electricity"
            ],
            [
                "2R3PXO51YN-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "77780.05",
                null,
                "Electricity"
            ],
            [
                "S1HAESIUHA-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "75664.25",
                null,
                "Electricity"
            ],
            [
                "AJ7ZY9LPDG-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "82991.67",
                null,
                "Electricity"
            ],
            [
                "9V2A0VE440-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "95202.66",
                null,
                "Electricity"
            ],
            [
                "H1MW9PTWEA-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "7573.26",
                null,
                "Electricity"
            ],
            [
                "LH2UC4309D-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "34485.46",
                null,
                "Electricity"
            ],
            [
                "JJ39YRK8QW-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "3740.94",
                null,
                "Electricity"
            ],
            [
                "9IJ2BYAT7H-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "50994.12",
                null,
                "Electricity"
            ],
            [
                "DQVI6787WR-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "96619.37",
                null,
                "Electricity"
            ],
            [
                "WW7L4U6MR2-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "96749.3",
                null,
                "Electricity"
            ],
            [
                "QRLC8RZESA-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "16594.61",
                null,
                "Electricity"
            ],
            [
                "6MYH1PML9K-dummy",
                "03-10-2024 14:36:23 IST",
                "9999999999",
                "amul@mailinator.com",
                "33576.37",
                "Failure",
                "Electricity"
            ],
            [
                "ISLYRLOU4O-dummy",
                "03-10-2024 14:19:25 IST",
                "9999999999",
                "amul@mailinator.com",
                "49386.4",
                "Success",
                "Electricity"
            ],
            [
                "GMTJP0KAKE-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "81810.61",
                null,
                "Electricity"
            ],
            [
                "KQC6RDKFE7-dummy",
                "03-10-2024 12:59:25 IST",
                "8888888888",
                "hande@yopmail.com",
                "61547.72",
                "Success",
                "Electricity"
            ],
            [
                "YL8665LL3M-dummy",
                "01-01-0001 05:53:00 IST",
                "8888888888",
                "hande@yopmail.com",
                "11608.99",
                "Pending",
                "Electricity"
            ],
            [
                "1C4OPKL4XQ-dummy",
                null,
                "8888888888",
                "hande@yopmail.com",
                "29516.96",
                null,
                "Electricity"
            ],
            [
                "AGNUFIBW6K-dummy",
                "01-10-2024 15:14:35 IST",
                "8888888888",
                "hande@mailinator.com",
                "60234.8",
                "Success",
                "Electricity"
            ],
            [
                "HOZC6KKF65-dummy",
                "01-10-2024 14:41:47 IST",
                "8888888888",
                "hande@mailinator.com",
                "62226.3",
                "Success",
                "Electricity"
            ],
            [
                "6BTK5TFQZS-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "12557.9",
                null,
                "Electricity"
            ],
            [
                "NSYDCH0QVB-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "99038.94",
                null,
                "Electricity"
            ],
            [
                "MSR8SZTFYZ-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "98412.05",
                null,
                "Electricity"
            ],
            [
                "1T5MG0WPL7-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "88872.54",
                null,
                "Electricity"
            ],
            [
                "B3CIAU9PDO-dummy",
                null,
                "1111111111",
                "neeraj.kasar@mailinator.com",
                "89249.32",
                null,
                "Electricity"
            ],
            [
                "M6LDHFAPKS-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "85283.81",
                null,
                "Electricity"
            ],
            [
                "KZYDEE2BWZ-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "26151.33",
                null,
                "Electricity"
            ],
            [
                "MBEAJOU4JN-dummy",
                "01-10-2024 12:56:24 IST",
                "8888888888",
                "hande@mailinator.com",
                "29494.75",
                "Success",
                "Electricity"
            ],
            [
                "UQC29Y1HWM-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "75538.49",
                null,
                "Electricity"
            ],
            [
                "QRM0I0IAL8-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "70469.27",
                null,
                "Electricity"
            ],
            [
                "WEUJM8GIRM-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "52750.26",
                null,
                "Electricity"
            ],
            [
                "FPOQCOWXP5-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "33167.87",
                null,
                "Electricity"
            ],
            [
                "VVI1XUKY0W-dummy",
                "01-10-2024 12:54:26 IST",
                "8888888888",
                "hande@mailinator.com",
                "80017.42",
                "Success",
                "Electricity"
            ],
            [
                "HF6N3JN6NT-dummy",
                "01-10-2024 12:34:19 IST",
                "8888888888",
                "hande@mailinator.com",
                "35174.85",
                "Success",
                "Electricity"
            ],
            [
                "26RILH4JL1-dummy",
                "01-10-2024 12:31:52 IST",
                "8888888888",
                "hande@mailinator.com",
                "13440.79",
                "Success",
                "Electricity"
            ],
            [
                "52S3ADZAKF-dummy",
                "01-01-0001 05:53:00 IST",
                "8888888888",
                "hande@mailinator.com",
                "12232.6",
                "Pending",
                "Electricity"
            ],
            [
                "LUJ3J6HM09-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "37940.35",
                null,
                "Electricity"
            ],
            [
                "UK0ONIAUV2-dummy",
                null,
                "1111111111",
                "neeraj.kasar@mailinator.com",
                "48375.12",
                null,
                "Electricity"
            ],
            [
                "FF1Z8NB8P0-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "2071.13",
                null,
                "Electricity"
            ],
            [
                "YBU3LUJRVD-dummy",
                "01-01-0001 05:53:00 IST",
                "8888888888",
                "hande@mailinator.com",
                "56166.51",
                "Pending",
                "Electricity"
            ],
            [
                "CXZGHILFOC-dummy",
                "01-01-0001 05:53:00 IST",
                "8888888888",
                "hande@mailinator.com",
                "56062.15",
                "Pending",
                "Electricity"
            ],
            [
                "L57CZE7GPX-dummy",
                "01-01-0001 05:53:00 IST",
                "8888888888",
                "hande@mailinator.com",
                "11734.9",
                "Pending",
                "Electricity"
            ],
            [
                "ZHCEYUIA2K-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "67165.81",
                null,
                "Electricity"
            ],
            [
                "4P1CRPSOUL-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "hande@mailinator.com",
                "64314.62",
                "Pending",
                "Electricity"
            ],
            [
                "OQNBY066YU-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "hande@mailinator.com",
                "98101.47",
                "Pending",
                "Electricity"
            ],
            [
                "QF3U69XAY7-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "hande@mailinator.com",
                "26316.05",
                "Pending",
                "Electricity"
            ],
            [
                "NM6SRKXPK2-dummy",
                "30-09-2024 18:15:16 IST",
                "9999999999",
                "hande@mailinator.com",
                "11328.54",
                "Success",
                "Electricity"
            ],
            [
                "HEZEJHUGNE-dummy",
                "30-09-2024 18:09:05 IST",
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "1712.28",
                "Success",
                "Electricity"
            ],
            [
                "WZNEYU9C5T-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "hande@mailinator.com",
                "55325.21",
                "Pending",
                "Electricity"
            ],
            [
                "POCFAFPHWY-dummy",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "64202.18",
                null,
                "Electricity"
            ],
            [
                "OAEJAIK03R-dummy",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "20714.87",
                null,
                "Electricity"
            ],
            [
                "53FOJMVHR0-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "hande@mailinator.com",
                "3917.89",
                "Pending",
                "Electricity"
            ],
            [
                "Z52AAJ6C6K-dummy",
                null,
                "9999999999",
                "hande@mailinator.com",
                "56280.71",
                null,
                "Electricity"
            ],
            [
                "3ZBS2HM8WS-dummy",
                null,
                "9999999999",
                "hande@mailinator.com",
                "87825.59",
                null,
                "Electricity"
            ],
            [
                "BW6RVSPMS5-dummy",
                null,
                "9999999999",
                "hande@mailinator.com",
                "91855.38",
                null,
                "Electricity"
            ],
            [
                "8RR4MA9EB7-dummy",
                null,
                "9999999999",
                "hande@mailinator.com",
                "54725.69",
                null,
                "Electricity"
            ],
            [
                "7KO0ZM1QAK-dummy",
                null,
                "9999999999",
                "hande@mailinator.com",
                "95643.05",
                null,
                "Electricity"
            ],
            [
                "V2FNO7NFBB-dummy",
                "30-09-2024 16:09:39 IST",
                "9999999999",
                "hande@mailinator.com",
                "89384.92",
                "Success",
                "Electricity"
            ],
            [
                "7UPB1IAZWV-dummy",
                "30-09-2024 16:08:26 IST",
                "9999999999",
                "hande@mailinator.com",
                "29439.61",
                "Success",
                "Electricity"
            ],
            [
                "QGV4ATIHII-dummy",
                "30-09-2024 16:07:27 IST",
                "9999999999",
                "hande@mailinator.com",
                "80199.9",
                "Success",
                "Electricity"
            ],
            [
                "UIG3SU9LEV-dummy",
                "30-09-2024 15:54:41 IST",
                "9999999999",
                "hande@mailinator.com",
                "556.41",
                "Success",
                "Electricity"
            ],
            [
                "HU73ZHA5L2-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "hande@mailinator.com",
                "42794.16",
                "Pending",
                "Electricity"
            ],
            [
                "03LH0Z56UE-dummy",
                "30-09-2024 15:37:40 IST",
                "9999999999",
                "hande@mailinator.com",
                "35982.58",
                "Success",
                "Electricity"
            ],
            [
                "243H4X1FFA-dummy",
                "30-09-2024 14:35:43 IST",
                "9999999999",
                "hande@mailinator.com",
                "35111.78",
                "Success",
                "Electricity"
            ],
            [
                "N2AFIO7ORM-dummy",
                "30-09-2024 14:03:01 IST",
                "9999999999",
                "hande@mailinator.com",
                "46522.7",
                "Success",
                "Electricity"
            ],
            [
                "MCWM823QBW-dummy",
                "30-09-2024 12:13:41 IST",
                "9999999999",
                "hande@mailinator.com",
                "15035.76",
                "Success",
                "Electricity"
            ],
            [
                "A127JSTYR0-dummy",
                "30-09-2024 11:30:21 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "81651.31",
                "Success",
                "Electricity"
            ],
            [
                "ZPFF0HPU79-dummy",
                "01-01-0001 05:53:00 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "58336.18",
                "Pending",
                "Electricity"
            ],
            [
                "XN1UWYCYN2-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "82970.25",
                null,
                "Electricity"
            ],
            [
                "HL8RRGL0GZ-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "71480.5",
                null,
                "Electricity"
            ],
            [
                "CAGZUIZM0B-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "15133.81",
                null,
                "Electricity"
            ],
            [
                "GRSJPBRAJ4-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "63440.71",
                null,
                "Electricity"
            ],
            [
                "XSXAF244T2-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "21625.06",
                null,
                "Electricity"
            ],
            [
                "2TF02NG7FW-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "45556.4",
                null,
                "Electricity"
            ],
            [
                "1LG67S9J28-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "43664.47",
                null,
                "Electricity"
            ],
            [
                "SLZBI5ND10-dummy",
                "27-09-2024 17:25:57 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "10961.98",
                "Success",
                "Electricity"
            ],
            [
                "3UW83IM6CD-dummy",
                "27-09-2024 17:30:36 IST",
                "8888888888",
                "hande@mailinator.com",
                "53855.73",
                "Success",
                "Electricity"
            ],
            [
                "2YKO9TDCDM-dummy",
                "27-09-2024 17:21:44 IST",
                "8888888888",
                "hande@mailinator.com",
                "77739.99",
                "Success",
                "Electricity"
            ],
            [
                "794JBFTY4R-dummy",
                "27-09-2024 17:10:40 IST",
                "8888888888",
                "hande@mailinator.com",
                "12951.21",
                "Success",
                "Electricity"
            ],
            [
                "25NCEE2Q2U-dummy",
                null,
                "9829382839",
                "aditi.kharat@aurionpro.com",
                "75243.89",
                null,
                "Electricity"
            ],
            [
                "U8GVO5LTH7-dummy",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "87466.55",
                null,
                "Electricity"
            ],
            [
                "XKZRTXEJUA-dummy",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "71799.02",
                null,
                "Electricity"
            ],
            [
                "MI1GJZF1TO-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "87255.24",
                null,
                "Electricity"
            ],
            [
                "11NAEX2VMG-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "76684.61",
                null,
                "Electricity"
            ],
            [
                "HFKP95S545-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "82809.41",
                null,
                "Electricity"
            ],
            [
                "FU57R3ZAIE-dummy",
                "27-09-2024 15:34:32 IST",
                "8888888888",
                "hande@mailinator.com",
                "30604.83",
                "Success",
                "Electricity"
            ],
            [
                "WPUOCBSBM3-dummy",
                "27-09-2024 15:17:06 IST",
                "8888888888",
                "hande@mailinator.com",
                "96523.12",
                "Success",
                "Electricity"
            ],
            [
                "9D9XS1I2P0-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "82441.2",
                null,
                "Electricity"
            ],
            [
                "3XWHAQWII7-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "52249.05",
                null,
                "Electricity"
            ],
            [
                "R42URHVLB5-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "42579.14",
                null,
                "Electricity"
            ],
            [
                "A31KYCOFYA-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "56206.51",
                null,
                "Electricity"
            ],
            [
                "ICHTEWN38G-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "8642.37",
                null,
                "Electricity"
            ],
            [
                "YPA9022G0Q-dummy",
                "26-09-2024 15:55:48 IST",
                "8888888888",
                "hande@mailinator.com",
                "84403.6",
                "Success",
                "Electricity"
            ],
            [
                "RKIUUS1HKX-dummy",
                "26-09-2024 15:53:36 IST",
                "8888888888",
                "hande@mailinator.com",
                "60220.88",
                "Success",
                "Electricity"
            ],
            [
                "2FR71ZY13X-dummy",
                "01-01-0001 05:53:00 IST",
                "8888888888",
                "hande@mailinator.com",
                "34435.61",
                "Pending",
                "Electricity"
            ],
            [
                "615L7Z04S0-dummy",
                "26-09-2024 14:18:38 IST",
                "8888888888",
                "hande@mailinator.com",
                "96562.64",
                "Success",
                "Electricity"
            ],
            [
                "KULG7BNKG4-dummy",
                "26-09-2024 14:03:38 IST",
                "8888888888",
                "hande@mailinator.com",
                "4056.24",
                "Success",
                "Electricity"
            ],
            [
                "6EJDZOS0VH-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "74152.77",
                null,
                "Electricity"
            ],
            [
                "P18825OZEQ-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "76113.19",
                null,
                "Electricity"
            ],
            [
                "HISYZN072X-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "90384.15",
                null,
                "Electricity"
            ],
            [
                "ERUV6C6XAN-dummy",
                null,
                "8888888888",
                "hande@mailinator.com",
                "21335.34",
                null,
                "Electricity"
            ],
            [
                "GMN01204G4-dummy",
                null,
                "0999999999",
                "hande@mailinator.com",
                "82144.59",
                null,
                "Electricity"
            ],
            [
                "GWVVDOOCSF-dummy",
                null,
                "0999999999",
                "hande@mailinator.com",
                "81363.94",
                null,
                "Electricity"
            ],
            [
                "689SF598NR-dummy",
                null,
                "0999999999",
                "hande@mailinator.com",
                "65117.17",
                null,
                "Electricity"
            ],
            [
                "HP0OZOXJRP-dummy",
                null,
                "0999999999",
                "hande@mailinator.com",
                "24992.25",
                null,
                "Electricity"
            ],
            [
                "GFTFVNT490-dummy",
                "26-09-2024 12:46:03 IST",
                "0999999999",
                "hande@mailinator.com",
                "8022.06",
                "Success",
                "Electricity"
            ],
            [
                "IX1KSCJFJE-dummy",
                "26-09-2024 12:36:44 IST",
                "0999999999",
                "hande@mailinator.com",
                "42539.51",
                "Success",
                "Electricity"
            ],
            [
                "ANPV1GWS7E-dummy",
                "26-09-2024 12:20:08 IST",
                "0999999999",
                "hande@mailinator.com",
                "67725.96",
                "Success",
                "Electricity"
            ],
            [
                "O55A73IVLH-dummy",
                "25-09-2024 15:11:02 IST",
                "0999999999",
                "hande@mailinator.com",
                "59577.91",
                "Success",
                "Electricity"
            ],
            [
                "LZ3Q0OC7F2-dummy",
                "24-09-2024 14:41:15 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "95227.72",
                "Success",
                "Electricity"
            ],
            [
                "3FLG41S86T-dummy",
                "24-09-2024 14:39:17 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "98891.49",
                "Success",
                "Electricity"
            ],
            [
                "2DAUA8T615-dummy",
                "24-09-2024 11:42:47 IST",
                "1111111111",
                "neeraj.kasar@mailinator.com",
                "53596.74",
                "Success",
                "Electricity"
            ],
            [
                "3LGQFA8QBO-dummy",
                "24-09-2024 11:13:43 IST",
                "9999999999",
                "amul@mailinator.com",
                "35427.24",
                "Success",
                "Electricity"
            ],
            [
                "000UPOKGEK-dummy",
                "24-09-2024 10:06:40 IST",
                "0123456789",
                "suresh@mailinator.com",
                "71639.43",
                "Success",
                "Electricity"
            ],
            [
                "5Q3HD24S1C-dummy",
                "24-09-2024 09:43:08 IST",
                "0123456789",
                "suresh@mailinator.com",
                "7426.53",
                "Success",
                "Electricity"
            ],
            [
                "6UZFTBPJD8-dummy",
                "23-09-2024 18:12:47 IST",
                "9999999999",
                "hande@mailinator.com",
                "36381.38",
                "Success",
                "Electricity"
            ],
            [
                "XS36Q47RBM-dummy",
                "23-09-2024 18:06:45 IST",
                "9999999999",
                "hande@mailinator.com",
                "38165.7",
                "Success",
                "Electricity"
            ],
            [
                "UETRZU1TUQ-dummy",
                "23-09-2024 18:03:53 IST",
                "9999999999",
                "hande@mailinator.com",
                "3020.43",
                "Success",
                "Electricity"
            ],
            [
                "S7CIVDDACR-dummy",
                "23-09-2024 17:57:11 IST",
                "9999999999",
                "hande@mailinator.com",
                "80093.31",
                "Success",
                "Electricity"
            ],
            [
                "QFFZ1NQZCV-dummy",
                "23-09-2024 15:56:36 IST",
                "9999999999",
                "hande@mailinator.com",
                "78388.24",
                "Failure",
                "Electricity"
            ],
            [
                "QQDSO93QTG-dummy",
                "23-09-2024 15:28:40 IST",
                "9819289182",
                "aditi.kharat@aurionpro.com",
                "91596.2",
                "Success",
                "Electricity"
            ],
            [
                "42SIN3XPO5-dummy",
                "23-09-2024 10:52:46 IST",
                "1234567890",
                "suresh@mailinator.com",
                "24004.9",
                "Success",
                "Electricity"
            ],
            [
                "1WY48XXEXN-dummy",
                null,
                "9876543322",
                "hande@mailinator.com",
                "46518.7",
                null,
                "Electricity"
            ],
            [
                "PCETABL9X3-dummy",
                "20-09-2024 15:52:07 IST",
                "9876543322",
                "hande@mailinator.com",
                "90651.09",
                "Success",
                "Electricity"
            ],
            [
                "52KS3PGERX-dummy",
                "19-09-2024 21:40:53 IST",
                "7012345012",
                "pratik.kanani@aurionpro.com",
                "5627.59",
                "Success",
                "Electricity"
            ],
            [
                "L5KOG4JZ5P-dummy",
                "19-09-2024 21:39:22 IST",
                "7012345012",
                "pratik.kanani@aurionpro.com",
                "67146.58",
                "Success",
                "Electricity"
            ],
            [
                "98S3NRGCR2-dummy",
                "19-09-2024 21:29:14 IST",
                "7012345012",
                "pratik.kanani@aurionpro.com",
                "63359.13",
                "Success",
                "Electricity"
            ],
            [
                "NB0II9R12D-dummy",
                "01-01-0001 05:53:00 IST",
                "7012345012",
                "pratik.kanani@aurionpro.com",
                "69301.44",
                "Pending",
                "Electricity"
            ],
            [
                "NB0II9R12D-dummy",
                "01-01-0001 05:53:00 IST",
                "7012345012",
                "pratik.kanani@aurionpro.com",
                "69301.44",
                "Pending",
                "Electricity"
            ],
            [
                "M0QKXQBZCF-dummy",
                null,
                "9876543322",
                "hande@mailinator.com",
                "79652.62",
                null,
                "Electricity"
            ],
            [
                "ORH5NAZLCA-dummy",
                "19-09-2024 15:40:35 IST",
                "9876543322",
                "hande@mailinator.com",
                "34569.89",
                "Success",
                "Electricity"
            ],
            [
                "RUNCDVQO94-dummy",
                null,
                "9876543322",
                "hande@mailinator.com",
                "40867.56",
                null,
                "Electricity"
            ],
            [
                "FRJVRZN8TO-dummy",
                "19-09-2024 14:24:14 IST",
                "9876543322",
                "hande@mailinator.com",
                "96848.27",
                "Success",
                "Electricity"
            ],
            [
                "7CTN5YGSAX-dummy",
                "18-09-2024 14:16:17 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "21024.97",
                "Success",
                "Electricity"
            ],
            [
                "TO1SMHKLV1-dummy",
                "18-09-2024 12:58:56 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "33249.66",
                "Success",
                "Electricity"
            ],
            [
                "YB0ACSTMKN-dummy",
                "01-01-0001 05:53:00 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "80190.1",
                "Pending",
                "Electricity"
            ],
            [
                "X6HED82780-dummy",
                "18-09-2024 12:43:06 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "33133.53",
                "Success",
                "Electricity"
            ],
            [
                "8JGML9CN1U-dummy",
                "18-09-2024 12:39:06 IST",
                "0123456789",
                "suresh@mailinator.com",
                "31480.19",
                "Success",
                "Electricity"
            ],
            [
                "XVRPFBUMA2-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "35337.95",
                null,
                "Electricity"
            ],
            [
                "P1O7HJQWMK-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "28833.07",
                null,
                "Electricity"
            ],
            [
                "5IFU6FQ3TM-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "51169.7",
                null,
                "Electricity"
            ],
            [
                "CD1GRPVB7S-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "23516.58",
                null,
                "Electricity"
            ],
            [
                "5N0IUJ2A0K-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "70516.28",
                null,
                "Electricity"
            ],
            [
                "331H568TUR-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "67454.89",
                null,
                "Electricity"
            ],
            [
                "AARJ8A0NM7-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "78698.7",
                null,
                "Electricity"
            ],
            [
                "HQ3BC2OLVG-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "8131.76",
                null,
                "Electricity"
            ],
            [
                "LDHK1NG62J-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "60443.8",
                null,
                "Electricity"
            ],
            [
                "5T1O07QU3A-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "60472.92",
                null,
                "Electricity"
            ],
            [
                "IVWJ098V7N-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "74733.28",
                null,
                "Electricity"
            ],
            [
                "EMT3ENPWA8-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "22915.67",
                null,
                "Electricity"
            ],
            [
                "WK5NK6GMHP-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "8679.91",
                null,
                "Electricity"
            ],
            [
                "YB5B4DCBNJ-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "95663.02",
                null,
                "Electricity"
            ],
            [
                "68TS4EQ7CX-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "96132.47",
                null,
                "Electricity"
            ],
            [
                "MIN3OJ4HR9-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "49816.88",
                null,
                "Electricity"
            ],
            [
                "WV8IVT32Q6-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "18652.75",
                null,
                "Electricity"
            ],
            [
                "03K2AEOPP2-dummy",
                "18-09-2024 12:23:15 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "25095.06",
                "Success",
                "Electricity"
            ],
            [
                "LLI6XJTN7R-dummy",
                "18-09-2024 11:44:55 IST",
                "0123456789",
                "suresh@mailinator.com",
                "79642.62",
                "Success",
                "Electricity"
            ],
            [
                "ZMG9NVKRO2-dummy",
                "18-09-2024 11:42:56 IST",
                "0123456789",
                "suresh@mailinator.com",
                "5919.44",
                "Pending",
                "Electricity"
            ],
            [
                "SI1KSLO55E-dummy",
                "18-09-2024 11:41:08 IST",
                "0123456789",
                "suresh@mailinator.com",
                "18539.37",
                "Failure",
                "Electricity"
            ],
            [
                "5W5SB4SK3I-dummy",
                "01-01-0001 05:53:00 IST",
                "0123456789",
                "suresh@mailinator.com",
                "9462.99",
                "Pending",
                "Electricity"
            ],
            [
                "D4DJMTQKBE-dummy",
                "17-09-2024 18:00:09 IST",
                "0123456789",
                "suresh@mailinator.com",
                "22956.24",
                "Success",
                "Electricity"
            ],
            [
                "ZZ4TF24K1V-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "72922.44",
                null,
                "Electricity"
            ],
            [
                "OIPWM6OU01-dummy",
                null,
                "0123456789",
                "suresh@mailinator.com",
                "88268.67",
                null,
                "Electricity"
            ],
            [
                "E88P04HYQ3-dummy",
                "17-09-2024 17:55:00 IST",
                "0123456789",
                "suresh@mailinator.com",
                "5858.66",
                "Success",
                "Electricity"
            ],
            [
                "6N4VYD5STI-dummy",
                "17-09-2024 17:49:14 IST",
                "0123456789",
                "suresh@mailinator.com",
                "79029.38",
                "Success",
                "Electricity"
            ],
            [
                "7JWVO12J0Y-dummy",
                "17-09-2024 17:34:57 IST",
                "0123456789",
                "suresh@mailinator.com",
                "16515.38",
                "Success",
                "Electricity"
            ],
            [
                "XH0T1LZVIN-dummy",
                "17-09-2024 12:50:12 IST",
                "0123456789",
                "suresh@mailinator.com",
                "5984.32",
                "Success",
                "Electricity"
            ],
            [
                "6BQXKJXRGE-dummy",
                "17-09-2024 11:47:19 IST",
                "0123456789",
                "suresh@mailinator.com",
                "92544",
                "Success",
                "Electricity"
            ],
            [
                "YXG1P24A0H-dummy",
                "01-01-0001 05:53:00 IST",
                "0123456789",
                "suresh@mailinator.com",
                "36199.86",
                "Pending",
                "Electricity"
            ],
            [
                "90I90T2P84-dummy",
                "01-01-0001 05:53:00 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "47486.31",
                "Pending",
                "Electricity"
            ],
            [
                "3L69IHXNYU-dummy",
                "16-09-2024 17:06:14 IST",
                "0123456789",
                "hande@yopmail.com",
                "34421.71",
                "Success",
                "Electricity"
            ],
            [
                "KY8RDAE9OX-dummy",
                "16-09-2024 16:59:38 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "20023.92",
                "Failure",
                "Electricity"
            ],
            [
                "96M38F6HGH-dummy",
                "16-09-2024 16:58:25 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "37618.58",
                "Success",
                "Electricity"
            ],
            [
                "YQ5LSIE5TB-dummy",
                "01-01-0001 05:53:00 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "30254.8",
                "Pending",
                "Electricity"
            ],
            [
                "13KCJFP48A-dummy",
                null,
                "0111111111",
                "neeraj.kasar@mailinator.com",
                "44065.7",
                null,
                "Electricity"
            ],
            [
                "VAI2HYLUXT-dummy",
                "16-09-2024 13:19:51 IST",
                "0123456789",
                "hande@yopmail.com",
                "55317.08",
                "Success",
                "Electricity"
            ],
            [
                "2IT84EGSJK-dummy",
                "16-09-2024 12:05:33 IST",
                "0123456789",
                "hande@yopmail.com",
                "28689.45",
                "Success",
                "Electricity"
            ],
            [
                "9NY2KUBHB9-dummy",
                null,
                "0123456789",
                "hande@yopmail.com",
                "46306.68",
                null,
                "Electricity"
            ],
            [
                "GA964NTVXZ-dummy",
                "16-09-2024 10:28:13 IST",
                "7123456789",
                "hande@yopmail.com",
                "70854.83",
                "Success",
                "Electricity"
            ],
            [
                "6BNG3OY4LX-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "30746.15",
                null,
                "Electricity"
            ],
            [
                "K0JNBZPE5T-dummy",
                "01-01-0001 05:53:00 IST",
                "1234567890",
                "hande@yopmail.com",
                "83318.6",
                "Pending",
                "Electricity"
            ],
            [
                "G6ZC5OU6M8-dummy",
                "01-01-0001 05:53:00 IST",
                "1234567890",
                "hande@yopmail.com",
                "77499.55",
                "Pending",
                "Electricity"
            ],
            [
                "29VLQBDSJ1-dummy",
                "14-09-2024 14:08:16 IST",
                "1234567890",
                "hande@yopmail.com",
                "59624.61",
                "Success",
                "Electricity"
            ],
            [
                "CJKIAWXISB-dummy",
                "14-09-2024 13:55:57 IST",
                "1234567890",
                "hande@yopmail.com",
                "26865.98",
                "Success",
                "Electricity"
            ],
            [
                "GSOBNK0B04-dummy",
                "14-09-2024 12:39:02 IST",
                "1234567890",
                "hande@yopmail.com",
                "93647.93",
                "Success",
                "Electricity"
            ],
            [
                "HD3OFEFI4X-dummy",
                "14-09-2024 12:27:31 IST",
                "1234567890",
                "hande@yopmail.com",
                "32347.86",
                "Success",
                "Electricity"
            ],
            [
                "6HPNRPFDBT-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "48302.26",
                null,
                "Electricity"
            ],
            [
                "LDWI404KRJ-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "51702.12",
                null,
                "Electricity"
            ],
            [
                "TQZV5G2FGL-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "37959.79",
                null,
                "Electricity"
            ],
            [
                "MIQBNDZNKH-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "35922.74",
                null,
                "Electricity"
            ],
            [
                "G2RSJDHWI5-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "27899.62",
                null,
                "Electricity"
            ],
            [
                "WDRKTFEP1I-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "27786.59",
                null,
                "Electricity"
            ],
            [
                "MPHZD36SZJ-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "45165.4",
                null,
                "Electricity"
            ],
            [
                "2ODKZG65OV-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "57955.83",
                null,
                "Electricity"
            ],
            [
                "EJB5RHYTFZ-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "6276.31",
                null,
                "Electricity"
            ],
            [
                "F0IAUNQZVB-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "96485.68",
                null,
                "Electricity"
            ],
            [
                "EBFSCL52VV-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "81452.43",
                null,
                "Electricity"
            ],
            [
                "C7EXZSCBWE-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "85101.1",
                null,
                "Electricity"
            ],
            [
                "LFE3LNG8QD-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "47826.23",
                null,
                "Electricity"
            ],
            [
                "AN7UX0WVM2-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "45904.9",
                null,
                "Electricity"
            ],
            [
                "OWFC6GGCDJ-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "22189.12",
                null,
                "Electricity"
            ],
            [
                "C2QCLW0DSX-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "23272.02",
                null,
                "Electricity"
            ],
            [
                "0BZN96IJKK-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "86858.8",
                null,
                "Electricity"
            ],
            [
                "BOECUNUGRO-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "30930.78",
                null,
                "Electricity"
            ],
            [
                "N3IIM1OCKL-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "78783.78",
                null,
                "Electricity"
            ],
            [
                "BM9KDVDJDH-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "20115.15",
                null,
                "Electricity"
            ],
            [
                "TE1YQK9PGQ-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "90391.93",
                null,
                "Electricity"
            ],
            [
                "MAU621OMVK-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "56132.7",
                null,
                "Electricity"
            ],
            [
                "QQM1YX09BR-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "91041.52",
                null,
                "Electricity"
            ],
            [
                "0URR267SMT-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "81916.1",
                null,
                "Electricity"
            ],
            [
                "IJW3D4QTMP-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "6234.3",
                null,
                "Electricity"
            ],
            [
                "9LQLD4BHQK-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "61012.84",
                null,
                "Electricity"
            ],
            [
                "98MI5JKPRW-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "54501.01",
                null,
                "Electricity"
            ],
            [
                "617DNMCHEQ-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "63774.86",
                null,
                "Electricity"
            ],
            [
                "TR6T7XENK4-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "42359.85",
                null,
                "Electricity"
            ],
            [
                "3IPAVQEC8M-dummy",
                null,
                "1234567890",
                "hande@yopmail.com",
                "34312.67",
                null,
                "Electricity"
            ],
            [
                "LDB65SBCYM-dummy",
                "14-09-2024 10:42:25 IST",
                "1234567890",
                "hande@yopmail.com",
                "25949.33",
                "Success",
                "Electricity"
            ],
            [
                "9B5D8H4466-dummy",
                "13-09-2024 19:24:27 IST",
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "31035.46",
                "Success",
                "Electricity"
            ],
            [
                "9A47GCX6I1-dummy",
                "13-09-2024 17:50:38 IST",
                "9877234567",
                "suresh@mailinator.com",
                "23824.98",
                "Success",
                "Electricity"
            ],
            [
                "SHHST47ELQ-dummy",
                "13-09-2024 17:47:46 IST",
                "9877234567",
                "suresh@mailinator.com",
                "9644.86",
                "Success",
                "Electricity"
            ],
            [
                "ARKB6OU5BJ-dummy",
                "13-09-2024 17:44:22 IST",
                "9877234567",
                "suresh@mailinator.com",
                "16547.39",
                "Success",
                "Electricity"
            ],
            [
                "YBZH8LGI0F-dummy",
                "13-09-2024 15:26:35 IST",
                "9877234567",
                "suresh@mailinator.com",
                "26218.21",
                "Success",
                "Electricity"
            ],
            [
                "8MRUOYSCGN-dummy",
                "13-09-2024 15:19:48 IST",
                "234567899",
                "suresh@mailinator.com",
                "91708.29",
                "Success",
                "Electricity"
            ],
            [
                "HB938IXM2N-dummy",
                "13-09-2024 12:16:04 IST",
                "999999999",
                "amul@mailinator.com",
                "67782.32",
                "Success",
                "Electricity"
            ],
            [
                "HVYY6S1Z43-dummy",
                "13-09-2024 10:43:09 IST",
                "999999999",
                "amul@mailinator.com",
                "90478.04",
                "Success",
                "Electricity"
            ],
            [
                "287M9MX5CN-dummy",
                "13-09-2024 10:37:56 IST",
                "1234567899",
                "suresh@mailinator.com",
                "89148.32",
                "Success",
                "Electricity"
            ],
            [
                "3WHJIRFB6Z-dummy",
                "01-01-0001 05:53:00 IST",
                "1234567899",
                "suresh@mailinator.com",
                "22298.84",
                "Pending",
                "Electricity"
            ],
            [
                "9EHZ4TOH0L-dummy",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "10981.35",
                null,
                "Electricity"
            ],
            [
                "QD7BPIWOUL-dummy",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "43069.21",
                null,
                "Electricity"
            ],
            [
                "QSIO98OVFL-dummy",
                "11-09-2024 11:20:35 IST",
                "9999999999",
                "amul@mailinator.com",
                "84683.15",
                "Success",
                "Electricity"
            ],
            [
                "FUMH9X7NBS-dummy",
                "10-09-2024 17:48:39 IST",
                "9999999999",
                "amul@mailinator.com",
                "42532.7",
                "Success",
                "Electricity"
            ],
            [
                "6A0VCKMY2L-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "30379.44",
                null,
                "Electricity"
            ],
            [
                "KTZ93RJ6GR-dummy",
                null,
                "1234567890",
                "suresh.hande@aurionpro.com",
                "75242.2",
                null,
                "Electricity"
            ],
            [
                "S1MQ6CMC83-dummy",
                null,
                "1234567890",
                "suresh.hande@aurionpro.com",
                "37553.68",
                null,
                "Electricity"
            ],
            [
                "7VVAPSHR2G-dummy",
                "10-09-2024 16:11:57 IST",
                "1234567890",
                "suresh.hande@aurionpro.com",
                "32366.15",
                "Success",
                "Electricity"
            ],
            [
                "BXZTLU8EJ9-dummy",
                "10-09-2024 16:08:15 IST",
                "1234567890",
                "suresh.hande@aurionpro.com",
                "39723.99",
                "Success",
                "Electricity"
            ],
            [
                "4LQZJO14S4-dummy",
                "01-01-0001 05:53:00 IST",
                "1234567890",
                "suresh.hande@aurionpro.com",
                "79011.8",
                "Pending",
                "Electricity"
            ],
            [
                "S4QAWRPE0I-dummy",
                "01-01-0001 05:53:00 IST",
                "1234567890",
                "suresh.hande@aurionpro.com",
                "66642.58",
                "Pending",
                "Electricity"
            ],
            [
                "QZZ7BMVR7U-dummy",
                "10-09-2024 15:54:44 IST",
                "1234567890",
                "hande@yopmail.com",
                "91989.5",
                "Success",
                "Electricity"
            ],
            [
                "HZG2XRHDI1-dummy",
                "10-09-2024 15:51:54 IST",
                "7777777777",
                "amul@mailinator.com",
                "66954.68",
                "Success",
                "Electricity"
            ],
            [
                "QY01DFZ1YZ-dummy",
                "10-09-2024 15:49:56 IST",
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "40946.09",
                "Success",
                "Electricity"
            ],
            [
                "0ITY57X500-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "3993.25",
                null,
                "Electricity"
            ],
            [
                "H4ZDKOMQ16-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "87518.87",
                null,
                "Electricity"
            ],
            [
                "ZACWF167JD-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "97697.71",
                null,
                "Electricity"
            ],
            [
                "5FKQVZ6N2T-dummy",
                "01-01-0001 05:53:00 IST",
                "1234567890",
                "hande@yopmail.com",
                "28788.07",
                "Pending",
                "Electricity"
            ],
            [
                "8FLAY22Q9L-dummy",
                "10-09-2024 15:10:54 IST",
                "9999999999",
                "amul@mailinator.com",
                "1226.33",
                "Success",
                "Electricity"
            ],
            [
                "8CLLECT4ND-dummy",
                "10-09-2024 15:01:56 IST",
                "9999999999",
                "amul@mailinator.com",
                "75596.67",
                "Success",
                "Electricity"
            ],
            [
                "G3YSXUM0GG-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "55443.43",
                null,
                "Electricity"
            ],
            [
                "Y8IBY0952Y-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "65202.11",
                null,
                "Electricity"
            ],
            [
                "IQDI2Q4N76-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "amul@mailinator.com",
                "36934.75",
                "Pending",
                "Electricity"
            ],
            [
                "4MLWNEKDGV-dummy",
                "10-09-2024 13:02:38 IST",
                "9999999999",
                "amul@mailinator.com",
                "55215.91",
                "Success",
                "Electricity"
            ],
            [
                "CRINZEB7VM-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "46027.72",
                null,
                "Electricity"
            ],
            [
                "7Q6XD1NMBF-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "6958.13",
                null,
                "Electricity"
            ],
            [
                "96SM0VZREY-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "41120.79",
                null,
                "Electricity"
            ],
            [
                "HPSUCN1A4D-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "48046.68",
                null,
                "Electricity"
            ],
            [
                "TPHHX907J3-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "15925.16",
                null,
                "Electricity"
            ],
            [
                "QKIDVMNF81-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "32136.53",
                null,
                "Electricity"
            ],
            [
                "HG4KJRII5V-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "10825.8",
                null,
                "Electricity"
            ],
            [
                "7Y3DMUEM7I-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "17925.75",
                null,
                "Electricity"
            ],
            [
                "JFHOVN400J-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "88793.8",
                null,
                "Electricity"
            ],
            [
                "4Q052XHR1F-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "37139.6",
                null,
                "Electricity"
            ],
            [
                "3S2VM7LK81-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "76784.26",
                null,
                "Electricity"
            ],
            [
                "8JNX5XPODB-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "4658.08",
                null,
                "Electricity"
            ],
            [
                "9703ZZQGYK-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "34655.69",
                null,
                "Electricity"
            ],
            [
                "RNQVWUW7HL-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "61091.71",
                null,
                "Electricity"
            ],
            [
                "W4RNUBA61E-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "6472.6",
                null,
                "Electricity"
            ],
            [
                "4R0OZ9STJC-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "45291.66",
                null,
                "Electricity"
            ],
            [
                "U9QQG908S5-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "13951.51",
                null,
                "Electricity"
            ],
            [
                "RG1U9P4PHP-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "88588.66",
                null,
                "Electricity"
            ],
            [
                "UTK00FGNR3-dummy",
                "09-09-2024 11:25:57 IST",
                "1234567890",
                "suresh@mailinator.com",
                "54247.19",
                "Success",
                "Electricity"
            ],
            [
                "E4C62A2CVA-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "53555.17",
                null,
                "Electricity"
            ],
            [
                "U8O93BED0J-dummy",
                "08-09-2024 21:47:23 IST",
                "1234567890",
                "suresh@mailinator.com",
                "25038.44",
                "Success",
                "Electricity"
            ],
            [
                "OJJ0BAH9BD-dummy",
                null,
                "7012345012",
                "pratik.kanani@aurionpro.com",
                "68015.55",
                null,
                "Electricity"
            ],
            [
                "Y5GEAKESCF-dummy",
                "01-01-0001 05:53:00 IST",
                "1234567890",
                "suresh@mailinator.com",
                "33407.89",
                "Pending",
                "Electricity"
            ],
            [
                "X17MJTW4S1-dummy",
                null,
                "7012345012",
                "pratik.kanani@aurionpro.com",
                "77175.21",
                null,
                "Electricity"
            ],
            [
                "C9MYC386LZ-dummy",
                null,
                "7012345012",
                "pratik.kanani@aurionpro.com",
                "10323.88",
                null,
                "Electricity"
            ],
            [
                "31ZWKLMA2I-dummy",
                null,
                "7012345012",
                "pratik.kanani@aurionpro.com",
                "42455.4",
                null,
                "Electricity"
            ],
            [
                "LHOX9P5LUR-dummy",
                null,
                "7012345012",
                "pratik.kanani@aurionpro.com",
                "35522.06",
                null,
                "Electricity"
            ],
            [
                "OQLAN1IZDA-dummy",
                "01-01-0001 05:53:00 IST",
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "86938.4",
                "Pending",
                "Electricity"
            ],
            [
                "24QTIKH931-dummy",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "55965.45",
                null,
                "Electricity"
            ],
            [
                "6L7LS0VWNA-dummy",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "26750.57",
                null,
                "Electricity"
            ],
            [
                "PPQ0F44XTM-dummy",
                "06-09-2024 13:08:59 IST",
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "35353.59",
                "Success",
                "Electricity"
            ],
            [
                "VZEG4Z5QLD-dummy",
                "06-09-2024 10:27:23 IST",
                "4567777778",
                "suresh@mailinator.com",
                "33331.22",
                "Success",
                "Electricity"
            ],
            [
                "SWY3JZ4HED-dummy",
                "05-09-2024 17:36:54 IST",
                "1234567890",
                "suresh@mailinator.com",
                "57210.13",
                "Success",
                "Electricity"
            ],
            [
                "MUK1OTLPXS-dummy",
                "05-09-2024 17:31:39 IST",
                "1234567890",
                "suresh@mailinator.com",
                "65102.75",
                "Success",
                "Electricity"
            ],
            [
                "8CGIKDYMOT-dummy",
                "05-09-2024 17:23:55 IST",
                "1234567890",
                "suresh@mailinator.com",
                "825.43",
                "Success",
                "Electricity"
            ],
            [
                "OBIS1AUC4I-dummy",
                "05-09-2024 12:52:37 IST",
                "1234567890",
                "suresh@mailinator.com",
                "10257.91",
                "Success",
                "Electricity"
            ],
            [
                "Z6AWO7HQX1-dummy",
                "01-01-0001 05:53:00 IST",
                "1234567890",
                "suresh@mailinator.com",
                "10703.22",
                "Pending",
                "Electricity"
            ],
            [
                "U1JSGH6HA2-dummy",
                "01-01-0001 05:53:00 IST",
                "1234567890",
                "suresh@mailinator.com",
                "54866.21",
                "Pending",
                "Electricity"
            ],
            [
                "9Z47G80UD3-dummy",
                "05-09-2024 12:35:43 IST",
                "1234567890",
                "suresh@mailinator.com",
                "67117.62",
                "Success",
                "Electricity"
            ],
            [
                "JC8HSM9NBT-dummy",
                "05-09-2024 12:31:15 IST",
                "1234567890",
                "suresh@mailinator.com",
                "40601.05",
                "Success",
                "Electricity"
            ],
            [
                "3IFWDLVGW1-dummy",
                "05-09-2024 11:58:01 IST",
                "1234567890",
                "suresh@mailinator.com",
                "46726.05",
                "Success",
                "Electricity"
            ],
            [
                "9G8MEHIGTU-dummy",
                "05-09-2024 11:53:37 IST",
                "1234567890",
                "suresh@mailinator.com",
                "72631.92",
                "Success",
                "Electricity"
            ],
            [
                "HEI0ZVMBUP-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "94440.39",
                null,
                "Electricity"
            ],
            [
                "JXOQDM1MDE-dummy",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "86428.83",
                null,
                "Electricity"
            ],
            [
                "RO5BXSNDHK-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "80152.99",
                null,
                "Electricity"
            ],
            [
                "IWC6PAP5HI-dummy",
                null,
                "1234567890",
                "suresh@mailinator.com",
                "53847.21",
                null,
                "Electricity"
            ],
            [
                "LHHQRSP6VD-dummy",
                "04-09-2024 15:21:27 IST",
                "1234567890",
                "suresh@mailinator.com",
                "71026.91",
                "Success",
                "Electricity"
            ],
            [
                "K9GPZIW5FC-dummy",
                "04-09-2024 13:00:19 IST",
                "1234567890",
                "suresh@mailinator.com",
                "10080.77",
                "Success",
                "Electricity"
            ],
            [
                "8A7CM94PJ1-dummy",
                "04-09-2024 12:53:03 IST",
                "123456789",
                "suresh@mailinator.com",
                "82965.66",
                "Success",
                "Electricity"
            ],
            [
                "WPQT4CZXLU-dummy",
                null,
                "123456789",
                "suresh@mailinator.com",
                "78170.5",
                null,
                "Electricity"
            ],
            [
                "UNRB3E7LDZ-dummy",
                null,
                "123456789",
                "suresh@mailinator.com",
                "68158.76",
                null,
                "Electricity"
            ],
            [
                "R6WC2PZYSM-dummy",
                "01-01-0001 05:53:00 IST",
                "123456789",
                "hande@yopmail.com",
                "12506.8",
                "Pending",
                "Electricity"
            ],
            [
                "EBQEPMX8LX-dummy",
                "03-09-2024 17:25:08 IST",
                "123456789",
                "hande@yopmail.com",
                "37772.54",
                "Success",
                "Electricity"
            ],
            [
                "V52AAI3FPB-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "9281.93",
                null,
                "Electricity"
            ],
            [
                "EYGQD47C32-dummy",
                "03-09-2024 11:23:25 IST",
                "123456789",
                "hande@yopmail.com",
                "79278.26",
                "Success",
                "Electricity"
            ],
            [
                "0JVDFU1ANE-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "28412.23",
                null,
                "Electricity"
            ],
            [
                "MN7XV5DZM8-dummy",
                "02-09-2024 13:22:52 IST",
                "8605508066",
                "suresh.hande@aurionpro.com",
                "48471.02",
                "Success",
                "Electricity"
            ],
            [
                "SIUJGXQ9ZZ-dummy",
                null,
                "8605508066",
                "suresh.hande@aurionpro.com",
                "39838.75",
                null,
                "Electricity"
            ],
            [
                "00KK2ETCTE-dummy",
                null,
                "8605508066",
                "suresh.hande@aurionpro.com",
                "45515.37",
                null,
                "Electricity"
            ],
            [
                "F7FJBXYETS-dummy",
                null,
                "8605508066",
                "suresh.hande@aurionpro.com",
                "58982.44",
                null,
                "Electricity"
            ],
            [
                "AMFGWL5MYN-dummy",
                null,
                "8605508066",
                "suresh.hande@aurionpro.com",
                "17744.35",
                null,
                "Electricity"
            ],
            [
                "ZXQOBLT1FJ-dummy",
                null,
                "8605508066",
                "suresh.hande@aurionpro.com",
                "64562.49",
                null,
                "Electricity"
            ],
            [
                "FUXD2VRUMW-dummy",
                null,
                "8605508066",
                "suresh.hande@aurionpro.com",
                "45698.01",
                null,
                "Electricity"
            ],
            [
                "C1H85EFG6C-dummy",
                "02-09-2024 12:24:17 IST",
                "8605508066",
                "suresh.hande@aurionpro.com",
                "72969.01",
                "Success",
                "Electricity"
            ],
            [
                "J77SMX8RUD-dummy",
                "01-01-0001 05:53:00 IST",
                "9586906940",
                "kapil.panchal@aurionpro.com",
                "33616.28",
                "Pending",
                "Electricity"
            ],
            [
                "PRSYB7G6RX-dummy",
                "01-01-0001 05:53:00 IST",
                "9586906940",
                "kapil.panchal@aurionpro.com",
                "82272.08",
                "Pending",
                "Electricity"
            ],
            [
                "RR78DWSTM6-dummy",
                "30-08-2024 16:07:07 IST",
                "9619688251",
                "aditi.kharat@aurionpro.com",
                "69288.44",
                "Success",
                "Electricity"
            ],
            [
                "81MN1H98YN-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "amul@mailinator.com",
                "29002.69",
                "Pending",
                "Electricity"
            ],
            [
                "VJ5O9DBIT0-dummy",
                "01-01-0001 05:53:00 IST",
                "9999999999",
                "amul@mailinator.com",
                "56795.54",
                "Pending",
                "Electricity"
            ],
            [
                "A2KA6MU3UU-dummy",
                "30-08-2024 15:28:13 IST",
                "9999999999",
                "amul@mailinator.com",
                "88824.66",
                "Success",
                "Electricity"
            ],
            [
                "S7Q205XLTN-dummy",
                "30-08-2024 15:27:24 IST",
                "9619688251",
                "aditi.kharat@aurionpro.com",
                "3324.81",
                "Success",
                "Electricity"
            ],
            [
                "3THZVU8ZCX-dummy",
                "30-08-2024 14:43:03 IST",
                "9586906940",
                "kapil.panchal@aurionpro.com",
                "73732.21",
                "Success",
                "Electricity"
            ],
            [
                "ATAM3000F3-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "97020.11",
                null,
                "Electricity"
            ],
            [
                "EULSGXDHZS-dummy",
                "01-01-0001 05:53:00 IST",
                "9820268087",
                "akshita.minocha@aurionpro.com",
                "2398.98",
                "Pending",
                "Electricity"
            ],
            [
                "BMJJJ408AP-dummy",
                null,
                "9223399506",
                "tejas.pilankar@aurionpro.com",
                "28394.06",
                null,
                "Electricity"
            ],
            [
                "9S5OZN2Z90-dummy",
                "29-08-2024 13:02:32 IST",
                "9223399506",
                "purnima.chhabria@aurionpro.com",
                "11176.74",
                "Success",
                "Electricity"
            ],
            [
                "A0OS7SQTVB-dummy",
                "01-01-0001 05:53:00 IST",
                "9223399506",
                "purnima.chhabria@aurionpro.com",
                "24066.59",
                "Pending",
                "Electricity"
            ],
            [
                "VYU4GK1ZT2-dummy",
                "01-01-0001 05:53:00 IST",
                "9223399506",
                "purnima.chhabria@aurionpro.com",
                "81660.31",
                "Pending",
                "Electricity"
            ],
            [
                "IA0RIRBUIP-dummy",
                "29-08-2024 11:42:23 IST",
                "9223399506",
                "purnima.chhabria@aurionpro.com",
                "98087.36",
                "Success",
                "Electricity"
            ],
            [
                "JUO8WNJT9C-dummy",
                "29-08-2024 10:52:29 IST",
                "9223399506",
                "purnima.chhabria@aurionpro.com",
                "46035.4",
                "Success",
                "Electricity"
            ],
            [
                "L4FD2ZLYNB-dummy",
                "29-08-2024 10:47:14 IST",
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "28646.69",
                "Success",
                "Electricity"
            ],
            [
                "AL0QNPVBOX-dummy",
                "29-08-2024 10:15:11 IST",
                "9586906940",
                "kapil.panchal@aurionpro.com",
                "95325.58",
                "Success",
                "Electricity"
            ],
            [
                "EO8XMWTES5-dummy",
                "29-08-2024 10:12:40 IST",
                "9586906940",
                "kapil.panchal@aurionpro.com",
                "27692.13",
                "Success",
                "Electricity"
            ],
            [
                "JFV99KB71P-dummy",
                "01-01-0001 05:53:00 IST",
                "9586906940",
                "kapil.panchal@aurionpro.com",
                "28608.02",
                "Pending",
                "Electricity"
            ],
            [
                "MFXVB4CF0O-dummy",
                "29-08-2024 10:03:15 IST",
                "9586906940",
                "kapil.panchal@aurionpro.com",
                "89536.46",
                "Success",
                "Electricity"
            ],
            [
                "R2LTYPMAC1-dummy",
                null,
                "9586906940",
                "kapil.panchal@aurionpro.com",
                "43756.34",
                null,
                "Electricity"
            ],
            [
                "DISHMKORY1-dummy",
                "29-08-2024 09:52:51 IST",
                "9586906940",
                "kapil.panchal@aurionpro.com",
                "71971.94",
                "Success",
                "Electricity"
            ],
            [
                "RUB9CUGO5N-dummy",
                "29-08-2024 09:46:31 IST",
                "1111111111",
                "bhavik.solanki@aurionpro.com",
                "72573.65",
                "Success",
                "Electricity"
            ],
            [
                "KIW88NKAZH-dummy",
                "29-08-2024 09:46:38 IST",
                "9586906940",
                "kapil.panchal@aurionpro.com",
                "40216.88",
                "Success",
                "Electricity"
            ],
            [
                "0KE46GHSKQ-dummy",
                null,
                "9586906940",
                "kapil.panchal@aurionpro.com",
                "30261.29",
                null,
                "Electricity"
            ],
            [
                "IT1GCCJ6JJ-dummy",
                null,
                "1111111111",
                "bhavik.solanki@aurionpro.com",
                "60984.21",
                null,
                "Electricity"
            ],
            [
                "AATVBYZD8C-dummy",
                null,
                "1111111111",
                "bhavik.solanki@aurionpro.com",
                "65171.19",
                null,
                "Electricity"
            ],
            [
                "VMYMR1AWVJ-dummy",
                "01-01-0001 05:53:00 IST",
                "9586906940",
                "kapil.panchal@aurionpro.com",
                "956.18",
                "Pending",
                "Electricity"
            ],
            [
                "MR3G3IHELE-dummy",
                null,
                "922339950",
                "prajakta.gurav@aurionpro.com",
                "76330.45",
                null,
                "Electricity"
            ],
            [
                "P0PRRRV4VR-dummy",
                null,
                "1111111111",
                "bhavik.solanki@aurionpro.com",
                "77881.04",
                null,
                "Electricity"
            ],
            [
                "F5LSW824KQ-dummy",
                "28-08-2024 09:40:24 IST",
                "8605508066",
                "suresh.hande@aurionpro.com",
                "34348.96",
                "Success",
                "Electricity"
            ],
            [
                "TWXF488ASQ-dummy",
                "01-01-0001 05:53:00 IST",
                "8605508066",
                "suresh.hande@aurionpro.com",
                "3006.97",
                "Pending",
                "Electricity"
            ],
            [
                "5D4EFZ1PL3-dummy",
                "01-01-0001 05:53:00 IST",
                "8605508066",
                "suresh.hande@aurionpro.com",
                "33651",
                "Pending",
                "Electricity"
            ],
            [
                "Q96OHGC37S-dummy",
                "27-08-2024 20:06:46 IST",
                "8605508066",
                "suresh.hande@aurionpro.com",
                "19806.78",
                "Success",
                "Electricity"
            ],
            [
                "WRGNTFWVT2-dummy",
                "27-08-2024 19:52:19 IST",
                "8605508066",
                "suresh.hande@aurionpro.com",
                "9462.44",
                "Success",
                "Electricity"
            ],
            [
                "OHAZ6GAOYP-dummy",
                "27-08-2024 19:47:39 IST",
                "8605508066",
                "suresh.hande@aurionpro.com",
                "61546.6",
                "Success",
                "Electricity"
            ],
            [
                "3KIMDO21OJ-dummy",
                "27-08-2024 19:20:24 IST",
                "8605508066",
                "suresh.hande@aurionpro.com",
                "55660.93",
                "Success",
                "Electricity"
            ],
            [
                "WGTCZJQ4SI-dummy",
                null,
                "8605508066",
                "suresh.hande@aurionpro.com",
                "72514.79",
                null,
                "Electricity"
            ],
            [
                "88A0E9FGUH-dummy",
                null,
                "8605508066",
                "suresh.hande@aurionpro.com",
                "16875.91",
                null,
                "Electricity"
            ],
            [
                "GMFT9RQZFM-dummy",
                null,
                "8605508066",
                "suresh.hande@aurionpro.com",
                "92615.08",
                null,
                "Electricity"
            ],
            [
                "8F7ULQ680H-dummy",
                null,
                "8605508066",
                "suresh.hande@aurionpro.com",
                "29798.65",
                null,
                "Electricity"
            ],
            [
                "X368P9FKFF-dummy",
                null,
                "8605508066",
                "suresh.hande@aurionpro.com",
                "94409.2",
                null,
                "Electricity"
            ],
            [
                "OAYJK36VVW-dummy",
                "27-08-2024 18:24:45 IST",
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "33312.46",
                "Success",
                "Electricity"
            ],
            [
                "PQIOG4PXRV-dummy",
                null,
                "9999999999",
                "amul.patil@aurionpro.com",
                "75788.99",
                null,
                "Electricity"
            ],
            [
                "N82HPVGGTN-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "21965.5",
                null,
                "Electricity"
            ],
            [
                "GY1I1QMMKK-dummy",
                "27-08-2024 14:45:42 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "10904.7",
                "Success",
                "Electricity"
            ],
            [
                "2NCE7E5C4K-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "25931.1",
                null,
                "Electricity"
            ],
            [
                "IAI2I0ITRQ-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "32247.24",
                null,
                "Electricity"
            ],
            [
                "TA28MTAW28-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "55270.55",
                null,
                "Electricity"
            ],
            [
                "SVD1DN71JZ-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "93307.41",
                null,
                "Electricity"
            ],
            [
                "G58WS26M9T-dummy",
                null,
                "9999999999",
                "amul.patil@mailinator.com",
                "64483.82",
                null,
                "Electricity"
            ],
            [
                "0FCBPADRKV-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "55478.75",
                null,
                "Electricity"
            ],
            [
                "88RM2RU1DR-dummy",
                "27-08-2024 13:49:51 IST",
                "9999999999",
                "amul@mailinator.com",
                "28473.14",
                "Success",
                "Electricity"
            ],
            [
                "7E8ADCDNZM-dummy",
                "27-08-2024 12:37:20 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "46218.43",
                "Success",
                "Electricity"
            ],
            [
                "IFKAISX6NA-dummy",
                "27-08-2024 12:25:21 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "74670.06",
                "Success",
                "Electricity"
            ],
            [
                "ZQ7FOQ9NKF-dummy",
                "27-08-2024 11:52:37 IST",
                "9999999999",
                "amul@mailinator.com",
                "89147.51",
                "Success",
                "Electricity"
            ],
            [
                "TU11CO2WDZ-dummy",
                "27-08-2024 10:16:21 IST",
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "47927.84",
                "Success",
                "Electricity"
            ],
            [
                "X100734RIA-dummy",
                "27-08-2024 10:13:45 IST",
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "14230.58",
                "Success",
                "Electricity"
            ],
            [
                "B739TU8DAS-dummy",
                "01-01-0001 05:53:00 IST",
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "17721.42",
                "Pending",
                "Electricity"
            ],
            [
                "9HSQCSDC3T-dummy",
                "26-08-2024 20:28:29 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "59766.17",
                "Success",
                "Electricity"
            ],
            [
                "JGZLGRFDC3-dummy",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "28924.19",
                null,
                "Electricity"
            ],
            [
                "84JTMA9KKZ-dummy",
                "26-08-2024 20:06:00 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "25278.17",
                "Success",
                "Electricity"
            ],
            [
                "1A94D3A2IN-dummy",
                "01-01-0001 05:53:00 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "23695.63",
                "Pending",
                "Electricity"
            ],
            [
                "5Q0JEC11GB-dummy",
                "01-01-0001 05:53:00 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "9501.47",
                "Pending",
                "Electricity"
            ],
            [
                "9PN97I6JK1-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "74894.47",
                null,
                "Electricity"
            ],
            [
                "C8FJ5ZY1GG-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "91975.06",
                null,
                "Electricity"
            ],
            [
                "D3GESDW3SD-dummy",
                null,
                "9999999999",
                "amul@mailinator.com",
                "93020.7",
                null,
                "Electricity"
            ],
            [
                "EVZAN40PT8-dummy",
                "24-08-2024 11:38:28 IST",
                "9619688251",
                "aditi.kharat@aurionpro.com",
                "53408.11",
                "Success",
                "Electricity"
            ],
            [
                "3ERVVW6H1Y-dummy",
                "24-08-2024 11:35:40 IST",
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "94543.46",
                "Success",
                "Electricity"
            ],
            [
                "1PZP7JD1UL-dummy",
                "01-01-0001 05:53:00 IST",
                "9619688251",
                "aditi.kharat@aurionpro.com",
                "42620.24",
                "Pending",
                "Electricity"
            ],
            [
                "W1EGBPCQ8U-dummy",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "13586.2",
                null,
                "Electricity"
            ],
            [
                "0HSEIELI5X-dummy",
                "01-01-0001 05:53:00 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "43770.53",
                "Pending",
                "Electricity"
            ],
            [
                "Y5V3EB77QR-dummy",
                null,
                "9999999999",
                "amul.patil@aurionpro.com",
                "12145.6",
                null,
                "Electricity"
            ],
            [
                "BWNWL136RE-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "6144.12",
                null,
                "Electricity"
            ],
            [
                "T54K642KYT-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "11550.83",
                null,
                "Electricity"
            ],
            [
                "9MEXW6PXV6-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "25076.82",
                null,
                "Electricity"
            ],
            [
                "ZLLYPDW81DPFKT5XGJOHVSZBOAA42271613",
                "22-08-2024 14:31:37 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "400",
                "Success",
                "Electricity"
            ],
            [
                "VUH81BR855-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "52389.34",
                null,
                "Electricity"
            ],
            [
                "QUOQ0DFZ3D-dummy",
                "22-08-2024 14:31:37 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "4499.25",
                "Success",
                "Electricity"
            ],
            [
                "M4PCGJ8E4H-dummy",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "80971.31",
                null,
                "Electricity"
            ],
            [
                "PHQBKRNXU5-dummy",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "85063.62",
                null,
                "Electricity"
            ],
            [
                "HWR7W3V4TC-dummy",
                "21-08-2024 15:00:45 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "29218.49",
                "Success",
                "Electricity"
            ],
            [
                "JKQI4HT7JH-dummy",
                null,
                "1111111111",
                "bhavik.solanki@aurionpro.com",
                "25647.89",
                null,
                "Electricity"
            ],
            [
                "Q520TG2PP8-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "16705.55",
                null,
                "Electricity"
            ],
            [
                "6R3FE6OMDR-dummy",
                "01-01-0001 05:53:00 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "92834.01",
                "Pending",
                "Electricity"
            ],
            [
                "EOOBDBEU7L-dummy",
                "19-08-2024 12:07:04 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "89941.64",
                "Success",
                "Electricity"
            ],
            [
                "KXSWYAIWWJ-dummy",
                "16-08-2024 12:52:38 IST",
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "4647.96",
                "Success",
                "Electricity"
            ],
            [
                "7BUJPXZ9KW-dummy",
                "14-08-2024 16:59:48 IST",
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "76127.25",
                "Failure",
                "Electricity"
            ],
            [
                "4P0AZJPEQH-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "39879.55",
                null,
                "Electricity"
            ],
            [
                "SDMFA3LIYE-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "12500.39",
                null,
                "Electricity"
            ],
            [
                "9D4NSII3X0-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "29572",
                null,
                "Electricity"
            ],
            [
                "MN6OQEBQJF-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "68636.92",
                null,
                "Electricity"
            ],
            [
                "ZV6SLPDLSD-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "69105.91",
                null,
                "Electricity"
            ],
            [
                "2ZPVXDFD0N-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "42751.02",
                null,
                "Electricity"
            ],
            [
                "UXCCAA52WQ-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "57280.61",
                null,
                "Electricity"
            ],
            [
                "XJ7IQWK7LJ-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "11583.85",
                null,
                "Electricity"
            ],
            [
                "FHOJAHP09L-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "47273.21",
                null,
                "Electricity"
            ],
            [
                "WZGXD6X7I3-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "48627.58",
                null,
                "Electricity"
            ],
            [
                "ERFBYBCLZN-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "86631.4",
                null,
                "Electricity"
            ],
            [
                "KLP68LVXBB-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "85994.65",
                null,
                "Electricity"
            ],
            [
                "W91FOBYC99-dummy",
                "09-08-2024 11:16:48 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "39774.85",
                "Success",
                "Electricity"
            ],
            [
                "DQTDQRUO8X-dummy",
                "09-08-2024 09:54:45 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "6598.76",
                "Success",
                "Electricity"
            ],
            [
                "4XEVZO4KPM-dummy",
                "09-08-2024 09:40:58 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "52678.8",
                "Success",
                "Electricity"
            ],
            [
                "7W4L7U058C-dummy",
                "08-08-2024 16:21:51 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "68591.99",
                "Success",
                "Electricity"
            ],
            [
                "VKQXMGK5P4-dummy",
                "08-08-2024 16:16:44 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "10235.75",
                "Success",
                "Electricity"
            ],
            [
                "B77XJ7DBDI-dummy",
                "08-08-2024 16:10:37 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "91397.92",
                "Success",
                "Electricity"
            ],
            [
                "YPRG3MW8KX-dummy",
                "08-08-2024 16:08:28 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "35436.83",
                "Success",
                "Electricity"
            ],
            [
                "W2Q8OUGLGV-dummy",
                "08-08-2024 12:49:36 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "35883.12",
                "Success",
                "Electricity"
            ],
            [
                "912EP3KHXU-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "480.97",
                null,
                "Electricity"
            ],
            [
                "WXLYDDDKVO-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "6061.57",
                null,
                "Electricity"
            ],
            [
                "UBEUDDCVCZ-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "92090.57",
                null,
                "Electricity"
            ],
            [
                "B8951NJMDI-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "9381.52",
                null,
                "Electricity"
            ],
            [
                "9ITYUFMWZR-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "72226.17",
                null,
                "Electricity"
            ],
            [
                "R733BAS3ED-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "8491.74",
                null,
                "Electricity"
            ],
            [
                "CFCFV6W9JS-dummy",
                "08-08-2024 09:47:12 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "40624.7",
                "Success",
                "Electricity"
            ],
            [
                "XOED4QOJTY-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "81033.95",
                null,
                "Electricity"
            ],
            [
                "AQTFQAN8SA-dummy",
                "07-08-2024 16:15:59 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "76446.01",
                "Success",
                "Electricity"
            ],
            [
                "EJ920DKO8K-dummy",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "10978.34",
                null,
                "Electricity"
            ],
            [
                "U6ZZYJ09JO-dummy",
                "07-08-2024 14:37:58 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "58914.43",
                "Success",
                "Electricity"
            ],
            [
                "L1UV83C6Y1-dummy",
                "07-08-2024 12:44:38 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "53696.22",
                "Success",
                "Electricity"
            ],
            [
                "Y88CWNKDCX-dummy",
                "07-08-2024 12:33:46 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "43261.4",
                "Success",
                "Electricity"
            ],
            [
                "ZNPAR21D26-dummy",
                "07-08-2024 12:29:55 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "69540.05",
                "Success",
                "Electricity"
            ],
            [
                "CKKP6RGLFN-dummy",
                "07-08-2024 12:26:50 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "53235.42",
                "Success",
                "Electricity"
            ],
            [
                "YJTVLVK2C4-dummy",
                "07-08-2024 12:23:56 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "85911.79",
                "Success",
                "Electricity"
            ],
            [
                "ETA3S5CSBU-dummy",
                "07-08-2024 12:17:28 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "31801.49",
                "Success",
                "Electricity"
            ],
            [
                "M5IAM122TA-dummy",
                "07-08-2024 12:15:32 IST",
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "2406.81",
                "Success",
                "Electricity"
            ],
            [
                "O3P6RD0A3G-dummy",
                "07-08-2024 12:01:03 IST",
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "77387.26",
                "Success",
                "Electricity"
            ],
            [
                "V234WCCUW6-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "54651.86",
                null,
                "Electricity"
            ],
            [
                "CG16ZSEXL6-dummy",
                "01-01-0001 05:53:00 IST",
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "45032.71",
                "Pending",
                "Electricity"
            ],
            [
                "BE0Y2Y3WGG-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "45299.2",
                null,
                "Electricity"
            ],
            [
                "NVKYOKGO72-dummy",
                "06-08-2024 19:30:46 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "45930.37",
                "Success",
                "Electricity"
            ],
            [
                "P82RARL800-dummy",
                "06-08-2024 19:28:14 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "97658.53",
                "Success",
                "Electricity"
            ],
            [
                "WKTARIRGA0-dummy",
                "06-08-2024 18:59:57 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "60017.61",
                "Success",
                "Electricity"
            ],
            [
                "IH1T3ZJ2J6-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "39238.74",
                null,
                "Electricity"
            ],
            [
                "MPTXRYW7W2-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "40648.27",
                null,
                "Electricity"
            ],
            [
                "0U9XUAU7YW-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "3122.18",
                null,
                "Electricity"
            ],
            [
                "123LBY7OB3-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "87623.21",
                null,
                "Electricity"
            ],
            [
                "R6TPHP400O-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "75823.88",
                null,
                "Electricity"
            ],
            [
                "LRF9ZUMY89-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "62248.32",
                null,
                "Electricity"
            ],
            [
                "4WBK3E5KSH-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "75094.12",
                null,
                "Electricity"
            ],
            [
                "9S7J6CQAB0-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "25548.04",
                null,
                "Electricity"
            ],
            [
                "BULDW5S59P-dummy",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "50102.25",
                null,
                "Electricity"
            ],
            [
                "LB3Y4KBLEP-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "48601.67",
                null,
                "Electricity"
            ],
            [
                "9Y6BLT9MVP-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "77477.64",
                null,
                "Electricity"
            ],
            [
                "ALIRQ548OI-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "1052.95",
                null,
                "Electricity"
            ],
            [
                "QMR61UECJI-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "35010.82",
                null,
                "Electricity"
            ],
            [
                "7I1MIZYNXQ-dummy",
                "05-08-2024 16:13:04 IST",
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "38510.6",
                "Success",
                "Electricity"
            ],
            [
                "7I1MIZYNXQ-dummy",
                "05-08-2024 16:13:04 IST",
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "38510.6",
                "Success",
                "Electricity"
            ],
            [
                "7I1MIZYNXQ-dummy",
                "05-08-2024 16:13:04 IST",
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "38510.6",
                "Success",
                "Electricity"
            ],
            [
                "7I1MIZYNXQ-dummy",
                "05-08-2024 16:13:04 IST",
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "38510.6",
                "Success",
                "Electricity"
            ],
            [
                "7I1MIZYNXQ-dummy",
                "05-08-2024 16:13:04 IST",
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "38510.6",
                "Success",
                "Electricity"
            ],
            [
                "Z53XKKLS6H-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "95877.77",
                null,
                "Electricity"
            ],
            [
                "30YIMU4KXG-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "41027.52",
                null,
                "Electricity"
            ],
            [
                "OCQA875W31-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "4495.36",
                null,
                "Electricity"
            ],
            [
                "V2PEXXHFK2-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "26868.68",
                null,
                "Electricity"
            ],
            [
                "ORJIRV6C53-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "13129.78",
                null,
                "Electricity"
            ],
            [
                "XCSA8WSL6ZC3B7AQI00P207312T42351015",
                null,
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "R59HB723EVVUU8KEJS0KX7GDLFN42351016",
                "01-01-0001 05:53:00 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "400",
                "Pending",
                "Electricity"
            ],
            [
                "R59HB723EVVUU8KEJS0KX7GDLFN42351016",
                "01-01-0001 05:53:00 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "400",
                "Pending",
                "Electricity"
            ],
            [
                "K32KAQYLKW0BFPM8KOEQ0FDC42542360720",
                null,
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "LNOPD2LN4GDSPY56XAJDEYDYA6D42360722",
                "23-08-2024 12:53:58 IST",
                "8856881018",
                "neeraj.kasar@aurionpro.com",
                "400",
                "Success",
                "Electricity"
            ],
            [
                "SWRTXY225F7RMR7BTJCZR07IMTP42390607",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "U8N6JR11S2XAAAQ9T0TYZ59MH1J42390608",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "B36M9Q4RB51A891IOGL9V5R8YNM42390608",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "KL0FNO5BQDOZWZULEX6PQ83BO8Y42390629",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "OUO8O1J3M6GWXYKO3VQTIQ1HAX142391017",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "5IOKAE8HKZ5IVZ58JW5Z1DKKVXO42391105",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "0GO839CDBEXCQ15421FJNFQSG7942391108",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "LJ9LYT6NE8XI9IGAF2WJABWVHL242391115",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "U3864L2ARJL9XPFP8043RD5YEJX42391117",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "1P1K8OPU314D3PCG5TJ6RTIO5JA42391118",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "5WH2XUVDROIFH6YAECO7USSKKBY42391118",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "JCREKTQ59B6UHGU2XD29SRTXWIF42391118",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "27CZSE9UIGRLWCUTJJ16GENATAZ42391118",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "20F8PKJC9CPJKLK680JQ1VFLOZZ42391118",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "VVIA711KSBKRCC7LSJ1KA5B1DZU42391119",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "EFL2MISXLR5UXIOHS3313MIB4RY42391120",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "EHDCO8RPXA1PB8XY1PDCBSYFG0E42391121",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "PXT4DSWYSNAQIDAZ2443EANQ4ZC42391121",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "UUO5SHZHSM46KA7DIJ4N0M4TYPV42391121",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "XYTSVD0D8P08U1V28A0NMFHZPOG42391122",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "UN3EF6NSVCI7WRNG6SX2MG2HSOS42391122",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "4Z0011IFX6AFD1GJBYPRO7Y878Q42391122",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "S1C610O3YEGEIPWAC693T0PS0VV42391122",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "4BCYFGKQGU1SOPE5WBYE51ME7LJ42680653",
                "01-01-0001 05:53:00 IST",
                "8888888888",
                "suresh@mailinator.com",
                "400",
                "Pending",
                "Electricity"
            ],
            [
                "4BCBFGCQGU8SOBE5WBYEN1MY7LJ42680653",
                "24-09-2024 11:42:47 IST",
                "8856881018",
                "neeraj.kasar@mailinator.com",
                "550",
                "Success",
                "Electricity"
            ],
            [
                "MJJ27540S6XMPOVSX5DVA544JQM42681012",
                "01-01-0001 05:53:00 IST",
                "8888888888",
                "suresh@mailinator.com",
                "400",
                "Pending",
                "Electricity"
            ],
            [
                "70TM4GHPOC0N8HMDF2WU20U0GDD42681018",
                "01-01-0001 05:53:00 IST",
                "8888888888",
                "suresh@mailinator.com",
                "400",
                "Pending",
                "Electricity"
            ],
            [
                "LSC44QNNF7L35O0V3UHFTU819AG42681113",
                null,
                "8888888888",
                "suresh@mailinator.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "2MZ3IT6MNXVI5XGBYHN4LWYBIOM42681116",
                "01-01-0001 05:53:00 IST",
                "0123456789",
                "hande@mailinator.com",
                "400",
                "Pending",
                "Electricity"
            ],
            [
                "GMDNSOD8CYNT9TM8OY9LGXBUV5F42690919",
                "01-01-0001 05:53:00 IST",
                "0999999999",
                "hande@mailinator.com",
                "400",
                "Pending",
                "Electricity"
            ],
            [
                "JM49Z82QDSSH3FEGOPARH1U3BXF42911000",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "PRVE2XV4FI-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "52502.21",
                null,
                "Electricity"
            ],
            [
                "OEQALYA21J-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "87996.93",
                null,
                "Electricity"
            ],
            [
                "39CM98SXZL-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "62923.02",
                null,
                "Electricity"
            ],
            [
                "F2C94SJM1K-dummy",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "19709.16",
                null,
                "Electricity"
            ],
            [
                "Z83DTNCJ20VNXD9NTP2KI6O1PXN42332139",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "5UH1SEI63JU6UXXG8L2UH5BA4MN42332140",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "38O7EKJPIPORDC6AZECKG3RKE6K42332141",
                null,
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "400",
                null,
                "Electricity"
            ],
            [
                "6C5MCF8PP5FO4Q9V5DLPIVBL3RH42332307",
                "20-08-2024 23:31:59 IST",
                "9769288718",
                "pratik.kanani@aurionpro.com",
                "400",
                "Success",
                "Electricity"
            ],
            [
                "LBWXUTS0ECZL81VQSXL485WE3QZ42390637",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "200",
                null,
                "Water"
            ],
            [
                "AP5HJBG9MZE7HP1431M7U7YKPO342390638",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "200",
                null,
                "Water"
            ],
            [
                "J192RTUOV61HO7W7NMSOZYGVKHR42390853",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "200",
                null,
                "Water"
            ],
            [
                "OO11KP36MHSA292WXFTJH0JGRKG42390853",
                null,
                "7012345102",
                "pratik.kanani@aurionpro.com",
                "200",
                null,
                "Water"
            ],
            [
                "UV333OA3V51KL1T8JNI5U00FUMP42391116",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "200",
                null,
                "Water"
            ],
            [
                "HHQ7JNC9XBR5TNFRIINQSTYKMO542391117",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "200",
                null,
                "Water"
            ],
            [
                "N5TYTQWV1FN43Y8NP840EGT7CO542391123",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "200",
                null,
                "Water"
            ],
            [
                "Q5LHE1OFHCCOL7VHFXQYEKVY49G42391124",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "200",
                null,
                "Water"
            ],
            [
                "ZEW3YO278DZDSMHAEKS1M7P8RP242391127",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "200",
                null,
                "Water"
            ],
            [
                "93INQME5Q5E5N5VGEHHUAS45J5442391128",
                null,
                "8180027115",
                "purnima.chhabria@aurionpro.com",
                "200",
                null,
                "Water"
            ],
            [
                "T3SQF9UI3NA0MQYMU1OU8ACG4S942681139",
                "01-01-0001 05:53:00 IST",
                "0123456789",
                "hande@mailinator.com",
                "500",
                "Pending",
                "Electricity"
            ]
        ],
        "pageInfo": {
            "startRow": -1,
            "pageSize": 10,
            "sortField": "transactiondate",
            "asc": false
        },
        "totalRowCount": 630
    }
    resp.status(200).json(data);
})

server.customAPI("get", "/list/details/:id", (req, resp) => {
    const data = {
        "billerCategoryName": "Electricity",
        "amount": 24505.94,
        "billerCategoryIcon": "electricity",
        "transactionStatus": 7,
        "billId": "IGD1V4PI00-dummy",
        "dateOfPayment": "14-10-2024 22:41:12 IST",
        "gatewayTransactionId": "8d942eef-185c-477b-bc78-144c80fa0be9",
        "bbpsReferenceId": "OS4QIVGOS3WFZHBTB9PG",
        "mobileNumber": "2222222222",
        "emailId": "abc@mailinator.com",
        "billerName": "Adani Electricity Mumbai Limited",
        "customerParams": [
            {
                "name": "Consumer number",
                "value": "123456789"
            }
        ],
        "timeline": [
            {
                "transactionStatus": 1,
                "timestamp": "14-10-2024 22:40:48 IST"
            },
            {
                "transactionStatus": 2,
                "timestamp": "14-10-2024 22:40:51 IST"
            },
            {
                "transactionStatus": 4,
                "timestamp": "14-10-2024 22:41:25 IST"
            },
            {
                "transactionStatus": 7,
                "timestamp": "14-10-2024 22:41:26 IST"
            }
        ]
    }
    resp.status(200).json(data);
})

server.customAPI("get", "/list/:id", (req, resp) => 
{
    
    // const data = 
    // {
    //     "header" : [ "BillId", "TransactionDate", "Name", "CreationDate" ],
    //     "data" : [
    //     ["1", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
    //     ["2", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
    //     ["3", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
    //     ["4", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
    //     ["5", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"]
    //     ],
    //     "filters": [
    //     {
    //     "field": "BillId",
    //     "operation": "EQUALS",
    //     "value": "abc123"
    //     },
    //     {
    //     "field": "TransactionDate",
    //     "operation": "BETWEEN",
    //     "value": "01/12/2024"
    //     }
    //     ],
    //     "sortBy": "transactionDate",
    //     "ascending": true,
    //     "pageIndex": 1,
    //     "pageSize": 5,
    //     "totalPages": 30
    // }

    let responseData = [];

    switch (req.params.id) {
        case "1":
        {
            responseData = [
                ["1", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["2", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["3", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["4", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["5", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["6", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["7", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["8", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["9", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["10", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
            ]
        }
        break;

        case "2":
        {
            responseData = [
                ["11", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["12", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["13", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["14", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["15", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["16", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["17", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["18", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["19", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["20", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
            ]
        }
        break;

        case "3":
        {
            responseData = [
                ["21", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["22", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["23", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["24", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["25", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["26", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["27", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["28", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["29", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
                ["30", "20/20/2020", "Atul", "21/12/2020", "Atul", "Atul", "Atul"],
            ]
        }
        break;
    
        default:
            break;
    }

    const data = 
    {
        "metadata": 
        {
            "columns": [
            {
                "name": "BillId",
                "enumValues": [],
                "displayName": "Bill Id",
                "filter" :
                {
                    "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                    "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
                }         
            },
            {
                "name": "Date",
                "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                "enumValues": [],
                "displayName": "Date",
                "filter" :
                {
                    "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                    "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
                }         
            },
            {
                "name": "ContactNo",
                "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                "enumValues": [],
                "displayName": "Contact No.",
                "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
            },
            {
                "name": "EmailId",
                "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                "enumValues": [],
                "displayName": "Email Id",
                "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
            },
            {
                "name": "Amount",
                "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                "enumValues": [],
                "displayName": "Amount",
                "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
            },
            {
                "name": "BillStatus",
                "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                "enumValues": [
                {
                    "transactionStatus": {
                    "Pending": "0",
                    "Success": "1"
                    }
                }
                ],
                "displayName": "Bill Status",
                "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
            },
            {
                "name": "Utility",
                "fieldType": "TEXT || NUMBER || DATE || BOOLEAN || ENUM",
                "enumValues": [],
                "displayName": "Utility",
                "supportedOperations": "EQUALS || CONTAINS || GREATERTHAN || LESSTHAN || BETWEEN || IN"
            }
        ],},
        "data": responseData,
        "pageInfo" :
        {         
            "startRow" : 10,
            "pageSize" : 10, 
            "sortField" : "BillId", 
            "asc" : false,
            "totalPages" : 30
        }
    }

    setTimeout(() => {
        resp.status(200).json(data);    
    }, 3000);
    
});


const latest_data = {
    "metaData": {
        "columns": [
            {
                "name": "BillId",
                "filter": {
                    "fieldType": 1,
                    "supportedOperations": [
                        1,
                        2
                    ]
                },
                "displayName": "Bill Id"
            },
            {
                "name": "Date",
                "filter": {
                    "fieldType": 3,
                    "supportedOperations": [
                        1,
                        3,
                        4,
                        5
                    ]
                },
                "displayName": "Date"
            },
            {
                "name": "ContactNo",
                "filter": {
                    "fieldType": 1,
                    "supportedOperations": [
                        1,
                        2
                    ]
                },
                "displayName": "Contact No."
            },
            {
                "name": "EmailId",
                "filter": {
                    "fieldType": 1,
                    "supportedOperations": [
                        1,
                        2
                    ]
                },
                "displayName": "Email Id"
            },
            {
                "name": "Amount",
                "filter": {
                    "fieldType": 2,
                    "supportedOperations": [
                        1,
                        3,
                        4,
                        5
                    ]
                },
                "displayName": "Amount"
            },
            {
                "name": "BillStatus",
                "filter": {
                    "fieldType": 5,
                    "supportedOperations": [
                        1,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                "displayName": "Bill Status"
            },
            {
                "name": "Utility",
                "filter": {
                    "fieldType": 1,
                    "supportedOperations": [
                        1,
                        2
                    ]
                },
                "displayName": "Utility"
            }
        ]
    },
    "data": [
        [
            "OAYJK36VVW-dummy",
            "27-08-2024 18:24:45 IST",
            "8180027115",
            "purnima.chhabria@aurionpro.com",
            "33312.46",
            "2",
            "Electricity"
        ],
        [
            "PQIOG4PXRV-dummy",
            null,
            "9999999999",
            "amul.patil@aurionpro.com",
            "75788.99",
            "0",
            "Electricity"
        ],
        [
            "N82HPVGGTN-dummy",
            null,
            "8856881019",
            "neeraj.kasar@aurionpro.com",
            "21965.5",
            "0",
            "Electricity"
        ],
        [
            "GY1I1QMMKK-dummy",
            "27-08-2024 14:45:42 IST",
            "8856881019",
            "neeraj.kasar@aurionpro.com",
            "10904.7",
            "2",
            "Electricity"
        ],
        [
            "2NCE7E5C4K-dummy",
            null,
            "8856881019",
            "neeraj.kasar@aurionpro.com",
            "25931.1",
            "0",
            "Electricity"
        ],
        [
            "IAI2I0ITRQ-dummy",
            null,
            "8856881019",
            "neeraj.kasar@aurionpro.com",
            "32247.24",
            "0",
            "Electricity"
        ],
        [
            "TA28MTAW28-dummy",
            null,
            "8856881019",
            "neeraj.kasar@aurionpro.com",
            "55270.55",
            "0",
            "Electricity"
        ],
        [
            "SVD1DN71JZ-dummy",
            null,
            "8856881019",
            "neeraj.kasar@aurionpro.com",
            "93307.41",
            "0",
            "Electricity"
        ],
        [
            "G58WS26M9T-dummy",
            null,
            "9999999999",
            "amul.patil@mailinator.com",
            "64483.82",
            "0",
            "Electricity"
        ],
        [
            "0FCBPADRKV-dummy",
            null,
            "9999999999",
            "amul@mailinator.com",
            "55478.75",
            "0",
            "Electricity"
        ],
        [
            "88RM2RU1DR-dummy",
            "27-08-2024 13:49:51 IST",
            "9999999999",
            "amul@mailinator.com",
            "28473.14",
            "2",
            "Electricity"
        ],
        [
            "7E8ADCDNZM-dummy",
            "27-08-2024 12:37:20 IST",
            "8856881019",
            "neeraj.kasar@aurionpro.com",
            "46218.43",
            "2",
            "Electricity"
        ],
        [
            "IFKAISX6NA-dummy",
            "27-08-2024 12:25:21 IST",
            "8856881019",
            "neeraj.kasar@aurionpro.com",
            "74670.06",
            "2",
            "Electricity"
        ],
        [
            "ZQ7FOQ9NKF-dummy",
            "27-08-2024 11:52:37 IST",
            "9999999999",
            "amul@mailinator.com",
            "89147.51",
            "2",
            "Electricity"
        ],
        [
            "TU11CO2WDZ-dummy",
            "27-08-2024 10:16:21 IST",
            "8180027115",
            "purnima.chhabria@aurionpro.com",
            "47927.84",
            "2",
            "Electricity"
        ],
        [
            "X100734RIA-dummy",
            "27-08-2024 10:13:45 IST",
            "8180027115",
            "purnima.chhabria@aurionpro.com",
            "14230.58",
            "2",
            "Electricity"
        ],
        [
            "B739TU8DAS-dummy",
            "01-01-0001 05:53:00 IST",
            "8180027115",
            "purnima.chhabria@aurionpro.com",
            "17721.42",
            "1",
            "Electricity"
        ],
        [
            "9HSQCSDC3T-dummy",
            "26-08-2024 20:28:29 IST",
            "7012345102",
            "pratik.kanani@aurionpro.com",
            "59766.17",
            "2",
            "Electricity"
        ],
        [
            "JGZLGRFDC3-dummy",
            null,
            "7012345102",
            "pratik.kanani@aurionpro.com",
            "28924.19",
            "0",
            "Electricity"
        ],
        [
            "84JTMA9KKZ-dummy",
            "26-08-2024 20:06:00 IST",
            "7012345102",
            "pratik.kanani@aurionpro.com",
            "25278.17",
            "2",
            "Electricity"
        ]
    ],
    "pageInfo": {
        "startRow": 140,
        "pageSize": 20,
        "sortField": "transactiondate",
        "asc": false
    },
    "totalRowCount": 744
}


server.start();



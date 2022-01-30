
const DBRam = require("./database/db_ram");
const DBFile = require("./database/db_file");
const DBFunciton = require("./database/db_function");

class SimpleMockServer
{
    app;
    PORT;

    constructor(app, port)
    {
        if(!app)
        {
            const express = require("express");
            this.app = express();
            this.app.use(express.json())
        }
        
        this.PORT = port? port : 2000;
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
                const recievedData = req.body
                this.DBInstance.saveData(tableName, recievedData);
                res.status(200).json({ success : true , id : recievedData.id});
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
    SimpleMockServer : SimpleMockServer,
    DBFile : DBFile,
    DBRam : DBRam,
    DBFunciton : DBFunciton
}


// const myTables = 
// [
//     { 
//         name : "Users",
//         seed : 
//         [
//             {
//                 first_name : "Jhon",
//                 last_name : "Dantas",
//                 company_name : null
//             },
//             {
//                 first_name : "Jilly",
//                 last_name : "Jonson",
//                 company_name : null
//             },
//             {
//                 first_name : "Peter",
//                 last_name : "Mathuse",
//                 company_name : null
//             },
//             {
//                 first_name : "Nolan",
//                 last_name : "Recko",
//                 company_name : "Recko Rock Inc."
//             },
//             {
//                 first_name : "Jhon",
//                 last_name : "Longbottom",
//                 company_name : null
//             },
//             {
//                 first_name : "Misto",
//                 last_name : "Mekka",
//                 company_name : "Mekka Traders"
//             }
//         ] 
//     }
// ]

// const server = new SimpleMockServer();
// server.setTables(myTables, new DBRam());
// server.customAPI("get", "/custom", (req, resp) => 
// {
//     DBInstance.query("Users");
    
//     DBInstance.and("last_name", "Longbottom", DBFunciton.QUERY_OPERATION.EQUALS);
    
//     const result = DBInstance.execute();
//     resp.status(200).json({ data :result });
// });
// server.start();



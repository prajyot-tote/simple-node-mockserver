const DBFunction = require("./db_function");
const fs = require('fs');

class DBFile extends DBFunction
{
    DB_PATH = "db_file";
    STORE = {};
    SEPRATOR = "|!|"

    constructor()
    {
        super();
        
        if (!fs.existsSync(this.DB_PATH))
        {
            fs.mkdirSync(this.DB_PATH);
        }
    }

    onCreateTable(tableName)
    {
        try
        {
            if(!this.checkTableExist(tableName))
            {
                const file_path = this.getTablePath(tableName);
                fs.writeFileSync(file_path, "");
            }
        }
        catch(e) 
        {
            console.error(e);
        }
    }

    onSaveData(tableName, data)
    {
        if(this.checkTableExist(tableName))
        {
            try
            {
                const file_path = this.getTablePath(tableName);
                let file_data = fs.readFileSync(file_path).toString();
                let dataJSON;
                if(file_data && file_data != "")
                {
                    dataJSON = JSON.parse(file_data);
                    dataJSON.data.push(data);
                }
                else
                {
                    dataJSON = { data : [data] };
                }

                fs.writeFileSync(file_path, JSON.stringify(dataJSON));
            }
            catch(e)
            {
                console.error(e);
            }
        }
    }

    onGetData(tableName)
    {
        if(this.checkTableExist(tableName))
        {
            const file_path = this.getTablePath(tableName);
            let file_data = fs.readFileSync(file_path).toString();
            if(file_data && file_data != "")
            {
                const dataJSON = JSON.parse(file_data);
                return dataJSON.data;
            }
        }
        
        return;
    }

    onDeleteData(tableName, id)
    {
        if(this.checkTableExist(tableName))
        {
            let dataJSON = {};
            const file_path = this.getTablePath(tableName);
            let file_data = fs.readFileSync(file_path).toString();
            if(file_data && file_data != "")
            {
                const dataList = JSON.parse(file_data).data;
                let index = -1;
                for(let i in dataList)
                {
                    const data = dataList[i];
                    if(data.id == id)
                    {
                        index = i;
                        break;
                    }
                }

                if(index != -1)
                {
                    dataList.splice(index, 1);
                }
                
                dataJSON.data = dataList;
                fs.writeFileSync(file_path, JSON.stringify(dataJSON));
            }
        }
    }

    getTablePath(tableName)
    {
        return `${this.DB_PATH}/${tableName}.txt`;
    }

    checkTableExist(tableName)
    {
        const file_path = this.getTablePath(tableName);
        return fs.existsSync(file_path);
    }

    isSeeded(tableName)
    { 
        if(this.checkTableExist(tableName))
        {
            const file_path = this.getTablePath(tableName);
            let file_data = fs.readFileSync(file_path).toString();
            return file_data && file_data != "";
        }

        return false;
    }

    purge(tableName)
    {
        if(tableName)
        {
            if (this.checkTableExist(tableName))
            {
                const file_path = this.getTablePath(tableName);
                fs.writeFileSync(file_path, "");
            }
        }
        else
        {
            if (fs.existsSync(this.DB_PATH))
            {
                fs.rmdirSync(this.DB_PATH);
            }
        }
    }
}

module.exports = DBFile
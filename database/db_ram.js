const { QUERY_OPERATION } = require("./db_function");
const DBFunction = require("./db_function");

class DBRam extends DBFunction
{
    STORE;
    constructor()
    {
        super();
        this.STORE= {};
    }

    onCreateTable(tableName)
    {
        this.STORE[tableName] = [];
    }

    onSaveData(tableName, data)
    {
        this.STORE[tableName].push(data);
    }

    onGetData(tableName)
    {
        return this.STORE[tableName];
    }

    // onEditData(tableName, id)
    // {
    //     this.query(tableName);
    //     this.where("id", id, QUERY_OPERATION.EQUALS);
    //     return this.execute();
    // }

    onDeleteData(tableName, id)
    {
        const dataList = this.STORE[tableName];
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
    }

    isSeeded(tableName){ return this.STORE[tableName].lenght > 0 }

    purge(tableName)
    {
        if(tableName)
        {
            this.STORE[tableName] = [];
        }
        else
        {
            this.STORE = {};
        }
    }
}

module.exports = DBRam
"use strict"
const { v4: uuidv4 } = require('uuid');

class DBFunciton
{
    static QUERY_OPERATION = 
    {
        EQUALS : 0,
        NOT_EQUALS : 1
    }

    static CONDITION_TYPE = 
    {
        AND : 0,
        OR : 1
    }

    queryFunc = {}
    queryTable;
    
    onCreateTable(tableName){}
    onSaveData(tableName, data){}
    onGetData(tableName){}
    onDeleteData(tableName, id){}
    isSeeded(tableName){ return false; }
    purge(tableName){}

    createTable(tableName)
    {
        return this.onCreateTable(tableName);
    }
    
    saveData(tableName, data)
    {
        data.id = uuidv4().toLocaleUpperCase().replace(/-/g, "");
        return this.onSaveData(tableName, data);
    }
    
    getData(tableName)
    {
        return this.onGetData(tableName);
    }

    deleteData(tableName, id)
    {
        return this.onDeleteData(tableName, id);
    }

    editData(tableName, id, data)
    {
        data.id = id;
        this.query(tableName);
        this.where("id", id, DBFunciton.QUERY_OPERATION.EQUALS);
        const result = this.execute()[0];

        for(let key in data)
        {
            result[key] = data[key];
        }

        this.onDeleteData(tableName, id);
        this.onSaveData(tableName, result);
    }
    
    query(tableName)
    {
        this.queryTable = tableName;
        this.queryFunc[tableName] = [];
    }
    
    and(key, value, operation)
    {
        this.where(key, value, operation, DBFunciton.CONDITION_TYPE.AND)
    }
    
    or(key, value, operation)
    {
        this.where(key, value, operation, DBFunciton.CONDITION_TYPE.OR)
    }
    
    where(key, value, operation, type)
    {
        if(!type)
        {
            type = DBFunciton.CONDITION_TYPE.AND;
        }
    
        const func = (data) => 
        {
            const valueToMatch = data[key];
            if(valueToMatch)
            {
                switch(operation)
                {
                    case DBFunciton.QUERY_OPERATION.EQUALS:
                    {
                        if(valueToMatch == value)
                        {
                            return data;
                        }
    
                        break;
                    }
    
                    case DBFunciton.QUERY_OPERATION.NOT_EQUALS:
                    {
                        if(valueToMatch != value)
                        {
                            return data;
                        }
                        break;
                    }
    
                    default :
                    {
                        return undefined
                    }
                }
            }
        }
    
        const funcData = 
        {
            conditionFunc : func,
            type : type
        }
    
        this.queryFunc[this.queryTable].push(funcData)
    }
    
    execute()
    {
        const funcList = this.queryFunc[this.queryTable];
        let dataList = this.getData(this.queryTable);
    
        let result = [];
    
        for(let i in funcList)
        {
            const funcData = funcList[i];
            for(let i in dataList)
            {
                const data = dataList[i];
                
                switch(funcData.type)
                {
                    case DBFunciton.CONDITION_TYPE.AND: 
                    {
                        const resultData = funcData.conditionFunc(data);
                        if(resultData)
                        {
                            if(!result.includes(resultData))
                            {
                                result.push(resultData);
                            }
                        }
                        else
                        {
                            result = result.filter((ele) => { return ele?.id != data?.id })
                        }
    
                        break;
                    }
        
                    case DBFunciton.CONDITION_TYPE.OR:
                    {
                        const resultData = funcData.conditionFunc(data);
                        if(resultData)
                        {
                            if(!result.includes(resultData))
                            {
                                result.push(resultData);
                            }
                        }
    
                        break;
                    }
                }
            }   
        }
    
        return result;
    }
}



module.exports = DBFunciton

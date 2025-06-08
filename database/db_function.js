"use strict"
const { v4: uuidv4 } = require('uuid');

class DBFunction
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

    onCreateTable(_tableName) {
        throw new Error('onCreateTable method must be implemented by subclass');
    }

    onSaveData(_tableName, _data) {
        throw new Error('onSaveData method must be implemented by subclass');
    }

    onGetData(_tableName) {
        throw new Error('onGetData method must be implemented by subclass');
    }

    onDeleteData(_tableName, _id) {
        throw new Error('onDeleteData method must be implemented by subclass');
    }

    isSeeded(_tableName) {
        throw new Error('isSeeded method must be implemented by subclass');
    }

    purge(_tableName) {
        throw new Error('purge method must be implemented by subclass');
    }

    createTable(tableName)
    {
        return this.onCreateTable(tableName);
    }
    
    saveData(tableName, data)
    {
        data.id = data.id?data.id:uuidv4().toLocaleUpperCase().replace(/-/g, "");
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
        this.where("id", id, DBFunction.QUERY_OPERATION.EQUALS);
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
        this.where(key, value, operation, DBFunction.CONDITION_TYPE.AND)
    }
    
    or(key, value, operation)
    {
        this.where(key, value, operation, DBFunction.CONDITION_TYPE.OR)
    }
    
    where(key, value, operation, type)
    {
        if(!type)
        {
            type = DBFunction.CONDITION_TYPE.AND;
        }
    
        const func = (data) => 
        {
            const valueToMatch = data[key];
            if(valueToMatch)
            {
                switch(operation)
                {
                    case DBFunction.QUERY_OPERATION.EQUALS:
                    {
                        if(valueToMatch == value)
                        {
                            return data;
                        }
    
                        break;
                    }
    
                    case DBFunction.QUERY_OPERATION.NOT_EQUALS:
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

        if (!funcList || funcList.length === 0) {
            return dataList;
        }

        let result = [];
        let resultMap = {};

        for (const data of dataList) {
            let include = this.evaluateDataAgainstConditions(data, funcList);

            if (include) {
                if (!resultMap[data.id]) {
                    result.push(data);
                    resultMap[data.id] = true;
                }
            }
        }

        return result;
    }

    evaluateDataAgainstConditions(data, funcList) {
        let include;
        for (const funcData of funcList) {
            const matched = !!funcData.conditionFunc(data);

            if (funcData.type === DBFunction.CONDITION_TYPE.AND) {
                if (include === undefined) include = true;
                include = include && matched;
            } else if (funcData.type === DBFunction.CONDITION_TYPE.OR) {
                if (include === undefined) include = false;
                include = include || matched;
            }
        }
        return include;
    }
}



module.exports = DBFunction

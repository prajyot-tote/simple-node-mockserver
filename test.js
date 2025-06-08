const { faker } = require('@faker-js/faker');


const randomName = faker.person.jobType();

const config = {
    _count : 20,
    id : ()  => { return faker.string.uuid() },
    name : ()  => { return faker.person.firstName() }
}

const count = config._count;
delete config._count;

const array = [];
for(let i = 0; i < count; i ++)
{
    const json = {};
    for(let key in config)
    {
        json[key] = config[key]();
    }
    
    array.push(json);
}

console.log(array);

const {execute} = require('../utils/base');

async function testSelect(){
  const result = await execute(`select * from test where id =2`)
}

async function testUpdate(){
  const result = await execute(`update user set nickname = '管理员'  where id = 2`);
}

async function testInsert(){
  const result = await execute(`insert into user (id, nickname, username, password) values (2,'insertTest','1235','123')`);
}

async function testDelete(){
  const result = await execute(`delete from user where id=2`);
}

testSelect();
testUpdate();
testInsert();
testDelete();
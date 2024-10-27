//#region web framwork base
console.log('init web framwork...');
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//#endregion

//#region database base
console.log('init database connection pool...');
const sqlLogger = new (require('./tools').logger)('sqllog.txt');
const mysql = require('mysql2');
const pool = mysql
  .createPool({
    connectionLimit: 10,
    port: '3308',
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'version_control',
    dateStrings: true
  })
  .promise();
async function execute(sql) {
  let result;
  try {
    result = (await pool.query(sql))?.[0];
    sqlLogger.log('EXECUTE:', sql);
    sqlLogger.log('RESULT:', JSON.stringify(result));
    sqlLogger.log('===============');
  } catch (error) {
    sqlLogger.log('EXECUTE:', sql);
    sqlLogger.log('ERROR OCCURED:', error.sqlMessage);
    sqlLogger.log('===============');
    result = undefined;
  }
  return result;
}
//#endregion

//#region jira base
const JiraApi = require('jira-client');
const jira = new JiraApi({
  protocol: 'https',
  host: '',
  username: 'version_control',
  password: '',
  apiVersion: '2',
  strictSSL: true
});
jira.updateSprint = function (sprint) {
  return this.doRequest(
    this.makeRequestHeader(
      this.makeAgileUri({
        pathname: `/sprint/${sprint.id}`
      }),
      {
        method: 'PUT',
        followAllRedirects: true,
        body: sprint
      }
    )
  );
};
//for test
// jira
// 	.updateSprint({
// 		id: "70",
// 		name: "123",
// 		state:'closed',
// 		startDate:'2023-03-06',
// 		endDate:'2023-03-07',
// 	})
// 	.then((res) => {
// 		console.log("res :>> ", res);
// 	});
//#endregion

module.exports = {
  app,
  port,
  execute,
  jira,
  mysql
};

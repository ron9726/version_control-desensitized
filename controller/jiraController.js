const { app } = require("../utils/base");
const { ResHelper, requestLogger: r } = require("../utils/tools");
const jiraService = require("../service/jiraService");

async function updateSystemData(req,res) {
	r.log("收到请求:", req.originalUrl);
  r.log('正在更新系统数据...');
	await jiraService.updateSystemData();
  res.send(ResHelper.ok('系统数据更新成功'));
}

app.put('/system/update',updateSystemData);
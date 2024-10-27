const { app } = require("../utils/base");
const { ResHelper, requestLogger: r } = require("../utils/tools");
const pvService = require("../service/pvService");


async function getProjectDetailWithVersionInfo(req,res){
  r.log('收到请求:', req.originalUrl);
  const projectId = req.params.projectId;
  r.log('参数解析:', JSON.stringify(req.params));
  const data = await pvService.getProjectDetailWithVersionInfoByProjectId(projectId);
  let response;
  if(data){
    response = ResHelper.ok(data[0]);
  }else{
    response = ResHelper.error('查询失败');
  }
  r.log('返回结果:', JSON.stringify(response));
  res.send(response);
}

async function getMessageFromJira(req,res){
  r.log("收到jira消息：", req.originalUrl);
  r.log('解析参数:', req.method);
  res.send('ok')
}

app.get('/getProjectDetail/:projectId', getProjectDetailWithVersionInfo);
app.get('/jira',getMessageFromJira);
app.put("/jira", getMessageFromJira);
app.post("/jira", getMessageFromJira);
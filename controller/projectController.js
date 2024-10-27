const {app}  = require('../utils/base');
const {ResHelper, requestLogger:r} = require('../utils/tools');
const projectService = require('../service/projectService');

async function getAllProjects(req, res){
  r.log('收到请求:',req.originalUrl);
  const {projectName, projectNumber} = req.query;
  r.log("参数解析:", JSON.stringify({ projectName, projectNumber }));
  const data = await projectService.getAllProjects(projectName, projectNumber);
  let response;
  if(data){
    response = ResHelper.ok(data);
  }else{
    response = ResHelper.error('查询失败');
  }
  r.log("返回结果:", JSON.stringify(response));
  res.send(response);
}

app.get("/projectList", getAllProjects);
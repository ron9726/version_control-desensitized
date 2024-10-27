const { app } = require("../utils/base");
const { ResHelper, requestLogger: r } = require("../utils/tools");
const {
  getProjectNumber,
  updateOrInsertRecord,
} = require("../service/project_typeService");

async function generateNumber(req, res) {
  r.log("收到请求", req.originalUrl);
  const { prj_type } = req.query;
  r.log("参数解析", JSON.stringify(req.query));
  // 校验类型编号合法
  let response;
  if (!validatePrjNum(prj_type)) {
    response = ResHelper.error("类型不合法");
    r.log("返回结果：", JSON.stringify(response));
    res.send(response);
    return;
  }
  let count = await getProjectNumber(prj_type);
  if (count) {
    response = ResHelper.ok({
      count,
    });
  } else {
    response = ResHelper.error("生成项目编号失败");
  }
  r.log("返回结果：", JSON.stringify(response));
  res.send(response);
}

async function copyNumber(req, res) {
  r.log("收到请求", req.originalUrl);
  const { prj_type } = req.query;
  r.log("参数解析", JSON.stringify(req.query));
  // 校验类型编号合法
  let response;
  if (!validatePrjNum(prj_type)) {
    response = ResHelper.error("类型不合法");
    r.log("返回结果：", JSON.stringify(response));
    res.send(response);
    return;
  }
  const data = await updateOrInsertRecord(prj_type);
  if (data) {
    response = ResHelper.ok({
      data,
    });
  } else {
    response = ResHelper.error("生成项目编号失败");
  }
  r.log("返回结果：", JSON.stringify(response));
  res.send(response);
}

app.get("/getProjectNumber", generateNumber);
app.get("/copyNumber", copyNumber);
/**
 *
 * @param {string} prjType 项目编号
 * @returns true if prjNum is leagal otherwise return false
 */
function validatePrjNum(prjType) {
  const re =
    /^0[1-3](AI|HA|WT)(YY|CP|KH|WH|YW|KY|QT|ZH)[0-9][0-9](0([1-9])|1[0-2])$/;
  return re.test(prjType);
}

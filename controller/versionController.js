const { app } = require("../utils/base");
const { ResHelper, requestLogger: r } = require("../utils/tools");
const versionService = require("../service/versionService");

async function getAllTestVersionsByVersionId(req, res) {
	r.log("收到请求:", req.originalUrl);
	const versionId = req.params.versionId;
	r.log("解析参数:", JSON.stringify(req.params));
	const data = await versionService.getAllTestVersionByVersionId(versionId);
	let response;
	if (data) {
		response = ResHelper.ok(data);
	} else {
		response = ResHelper.error("查询失败");
	}
	r.log("返回结果:", JSON.stringify(response));
	res.send(response);
}

/**
 * req.body={
 * 	versionId:string,
 *  testRound:number,
 * }
 * @param {*} req
 * @param {*} res
 */
async function createTestVersion(req, res) {
	r.log("收到请求:", req.originalUrl);
	const body = req.body;
	r.log("解析参数:", JSON.stringify(req.body));
	const data = await versionService.createTestVersion(body);
	let response;
	if (data) {
		response = ResHelper.ok(data);
	} else {
		response = ResHelper.error("新增测试版本失败");
	}
	r.log("返回结果:", JSON.stringify(response));
	res.send(response);
}

async function updateTestVersionBuildByTestId(req, res) {
	r.log("收到请求:", req.originalUrl);
	const testId = req.params.testId;
	r.log("解析参数:", JSON.stringify(req.params));
	const data = await versionService.updateTestVersionBuildByTestId(testId);
	let response;
	if (data) {
		response = ResHelper.ok(data);
	} else {
		response = ResHelper.error("Build号更新失败");
	}
	r.log("返回结果:", JSON.stringify(response));
	res.send(response);
}

async function getAllVersionsByProjectId(req, res) {
	r.log("收到请求:", req.originalUrl);
	const projectId = req.params.projectId;
	r.log("参数解析:", JSON.stringify(req.params));
	const data = await versionService.getAllVersionsByProjectId(projectId);
	let response;
	if (data) {
		response = ResHelper.ok(data);
	} else {
		response = ResHelper.error("查询失败");
	}
	r.log("返回结果:", JSON.stringify(response));
	res.send(response);
}

async function getAllPlanByVersionId(req, res) {
	r.log("收到请求:", req.originalUrl);
	const versionId = req.params.versionId;
	r.log("参数解析:", JSON.stringify(req.params));
	const data = await versionService.getAllPlanByVersionId(versionId);
	let response;
	if (data) {
		response = ResHelper.ok(data);
	} else {
		response = ResHelper.error("查询失败");
	}
	r.log("返回结果:", JSON.stringify(response));
	res.send(response);
}

async function deleteTestVersionByTestId(req, res) {
	r.log("收到请求:", req.originalUrl);
	const testId = req.params.testId;
	r.log("参数解析:", JSON.stringify(req.params));
	const data = await versionService.deleteTestVersionByTestId(testId);
	let response;
	if (data) {
		response = ResHelper.ok(data);
	} else {
		response = ResHelper.error("删除失败");
	}
	r.log("返回结果:", JSON.stringify(response));
	res.send(response);
}

async function releasePlanByPlanId(req, res) {
	r.log("收到请求:", req.originalUrl);
	const planId = req.params.planId;
	r.log("参数解析:", JSON.stringify(req.params));
	let response;
	try {
		const data = await versionService.releasePlan({ planId, status: 3 });
		if (data) {
			response = ResHelper.ok(data);
		} else {
			response = ResHelper.error("发布失败");
		}
	} catch (error) {
		response = ResHelper.error(error);
	}
	r.log("返回结果:", JSON.stringify(response));
	res.send(response);
}

app.get("/version/:projectId", getAllVersionsByProjectId);

app.get("/plan/:versionId", getAllPlanByVersionId);
app.put("/plan/releasePlan/:planId", releasePlanByPlanId);

app.put("/updateBuild/:testId", updateTestVersionBuildByTestId);

app.get("/testVersion/:versionId", getAllTestVersionsByVersionId);
app.post("/testVersion", createTestVersion);
app.delete("/testVersion/:testId", deleteTestVersionByTestId);

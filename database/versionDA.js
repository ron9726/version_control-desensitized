const { execute, mysql } = require("../utils/base");

//#region version
/**
 * 获取指定项目下所有的发布版本
 * @param {项目ID} projectId
 * @returns
 */
function selectVersionsByProjectId(projectId) {
	return execute(`select * from version where project_id = ${projectId} order by start_time, priority`);
}

/**
 * 获取指定发布版本的详情
 * @param {发布版本的ID} versionId
 * @returns
 */
function selectVersionById(versionId) {
	return execute(`select * from version where version_id = ${versionId}`);
}

/**
 * 删除指定发布版本，当一个发布版本下没有任何迭代时需要删除这个发布版本
 * @param {*} versionId
 * @returns
 */
function deleteVersionByVersionId(versionId) {
	return execute(`delete from version where id = ${versionId}`);
}

function insertVersion(data) {
	return execute(
		`INSERT INTO version (id, project_id, version_name, main, sub, fix, custom_number, upgrade_number, status, nature, priority, start_time, release_time) 
		VALUES('${data.id}','${data.projectId}', '${data.versionName}', ${data.main}, ${data.sub}, ${data.fix}, '${
			data.customNumber || ''
		}', '${data.upgradeNumber || ''}', ${data.status}, ${data.nature}, ${data.priority},'${
			data.startTime || ''
		}', '${data.releaseTime || ''}')`
	);
}

function updateVersionStatusByVersionId(data) {
	return execute(`update version set status=${data.status} where id='${data.id}'`);
}

function deleteAllVersions() {
	return execute(`delete from version`);
}
//#endregion

//#region plan

function selectAllPlansByVersionId(versionId) {
	return execute(`select * from plan where version_id='${versionId}' order by start_time asc`);
}

/**
 * 获取指定发布版本的第一个未发布的迭代
 * @param {发布版本的Id} versionId
 * @returns
 */
function selectCurrentUnreleasedPlanByVersionId(versionId) {
	return execute(`select * from plan where version_id = ${versionId} and status=0 order by start_time ASC limit 1`);
}

/**
 * 插入一条迭代数据，插入前需要检查是否存在发布版本，如果不存在需要先新建发布版本
 * jira同步使用
 * @param {*} data
 * @returns
 */
function insertPlan(data) {
	return execute(
		`INSERT INTO plan (id, version_id, plan_name, start_time, release_time, status, final_release) 
    VALUES('${data.planId}', '${data.versionId}', '${data.planName}', '${data.startTime}', '${data.releaseTime}', ${data.status}, ${data.finalRelease})`
	);
}

/**
 * 更新迭代状态 0 未发布 3已发布
 * @param {*} data
 * @returns
 */
function updatePlanStatusByPlanId(data) {
	return execute(`update plan set status=${data.status} where id='${data.planId}'`);
}

/**
 * 删除迭代，jira同步使用
 * @param {*} planId
 * @returns
 */
function deletePlanByPlanId(planId) {
	return execute(`delete from plan where id=${planId}`);
}

function selectPlanByPlanId(planId) {
	return execute(`select * from plan where id=${planId}`);
}

function deleteAllPlan() {
	return execute(`delete from plan`);
}
//#endregion

//#region test version
/**
 * 获取迭代下的所有测试版本信息, 倒序
 * @param {迭代ID} planId
 * @returns
 */
function selectTestVersionsByVersionId(versionId) {
	return execute(
		`select test.id as id, version_name, test_round, release_time, build, create_time, update_time from version, test where version.id = test.version_id and version.id = '${versionId}' order by test_round desc`
	);
}

/**
 * 在指定迭代下新增测试版本
 * @param {*} data
 * @return
 */
function insertTestVersion(data) {
	return execute(
		`INSERT INTO test(version_id, test_name, test_round, build, tag_link, create_time, update_time)
    VALUES(${data.versionId}, '${data.testName || ""}', ${data.testRound}, 1, '${
			data.tag_link || ""
		}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
	);
}

/**
 * 更新指定测试版本的build号
 * @param {测试id} testId
 * @returns
 */
function updateBuildNumberByTestId(testId) {
	return execute(`update test set build=build+1 where id=${testId}`);
}

/**
 * 删除指定的测试版本
 * @param {测试id} testId
 * @returns
 */
function deleteTestVersionByTestId(testId) {
	return execute(`delete from test where id=${testId}`);
}

function deleteAllTests() {
	return execute(`delete from test`);
}

//#endregion

module.exports = {
	selectCurrentUnreleasedPlanByVersionId,
	selectVersionById,
	selectVersionsByProjectId,
	selectTestVersionsByVersionId,
	selectAllPlansByVersionId,
	selectPlanByPlanId,
	insertPlan,
	deletePlanByPlanId,
	insertVersion,
	deleteVersionByVersionId,
	insertTestVersion,
	updateBuildNumberByTestId,
	deleteTestVersionByTestId,
	updateVersionStatusByVersionId,
	updatePlanStatusByPlanId,
	deleteAllPlan,
	deleteAllVersions,
	deleteAllTests,
};

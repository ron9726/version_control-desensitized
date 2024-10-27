const versionDA = require("../database/versionDA");
const { jira } = require("../utils/base");
const dayjs = require("dayjs");
function getAllVersionsByProjectId(projectId) {
	return versionDA.selectVersionsByProjectId(projectId).then((data) => {
		return data?.map((v) => {
			return {
				version_name: v.version_name,
				id: v.id,
			};
		});
	});
}

function getAllPlanByVersionId(versionId) {
	return versionDA.selectAllPlansByVersionId(versionId).then((data) => {
		return data?.map((v) => {
			const reg = /S[1-9][0-9]?/;
			return {
				id: v.id,
				plan_name: reg.exec(v.plan_name)[0],
			};
		});
	});
}

function getAllTestVersionByVersionId(versionId) {
	return versionDA.selectTestVersionsByVersionId(versionId).then((data) => {
		return data?.map((v) => {
			let test_name;
			let buildNumber = `${v.build >= 10 ? v.build : "0" + v.build}`;
			test_name = `${v.version_name}-beta.${v.test_round}.build.${buildNumber}`;
			return {
				...v,
				test_name,
			};
		});
	});
}

function createTestVersion(data) {
	return versionDA.insertTestVersion(data);
}

function releasePlan(data) {
	let versionId, dataTemp;
	return jira
		.updateVersion({
			id: data.planId,
			released: true,
		})
		.then(
			() => {
				return versionDA.selectPlanByPlanId(data.planId);
			},
			(err) => {
				return Promise.reject(`无法在jira发布迭代，操作失败,错误原因:${err.message}`);
			}
		)
		.then(([plan]) => {
			versionId = plan.version_id;
			return versionDA.updatePlanStatusByPlanId(data);
		})
		.then((result) => {
			dataTemp = result;
			if (result) {
				return versionDA.selectAllPlansByVersionId(versionId);
			} else {
				return Promise.reject(`迭代${data.planId}发布失败`);
			}
		})
		.then((plans) => {
			let status = 3;
			plans.forEach((plan) => {
				if (plan.status == 0) {
					status = 0;
				}
			});
			if (status === 3) {
				return versionDA.updateVersionStatusByVersionId({ status: 2, id: versionId });
			}
			return Promise.resolve(dataTemp);
		});
	// return versionDA
	// 	.selectPlanByPlanId(data.planId)
	// 	.then(([plan]) => {
	// 		releaesId = plan.release_id;
	// 		return versionDA.updatePlanStatusByPlanId(data);
	// 	})
	// 	.then((result) => {
	// 		dataTemp = result;
	// 		if (result) {
	// 			return versionDA.selectAllPlansByReleaseId(releaesId).then((plans) => {
	// 				return jira
	// 					.updateVersion({
	// 						id: data.planId,
	// 						released: true,
	// 					})
	// 					.then(() => {
	// 						return plans;
	// 					});
	// 			});
	// 		} else {
	// 			return Promise.reject(`迭代${data.planId}发布失败`);
	// 		}
	// 	})
	// 	.then((plans) => {
	// 		let status = 3;
	// 		plans.forEach((plan) => {
	// 			if (plan.status == 0) {
	// 				status = 0;
	// 			}
	// 		});
	// 		if (status === 3) {
	// 			return versionDA.updateReleaseStatusByReleaseId({ status: 2, id: releaesId });
	// 		}
	// 		return Promise.resolve(dataTemp);
	// 	});
}

function updateTestVersionBuildByTestId(testId) {
	return versionDA.updateBuildNumberByTestId(testId);
}

function deleteTestVersionByTestId(testId) {
	return versionDA.deleteTestVersionByTestId(testId);
}

module.exports = {
	getAllVersionsByProjectId,
	getAllTestVersionByVersionId,
	getAllPlanByVersionId,
	deleteTestVersionByTestId,
	createTestVersion,
	releasePlan,
	updateTestVersionBuildByTestId,
};

const { execute } = require("../utils/base");

function selectAllProject() {
	return execute("select * from project");
}

function selectProjectById(projectId) {
	return execute(`select * from project where id=${projectId}`);
}

function selectProjectByProjectNumberAndProjectName(projectNumber, projectName) {
	if (projectName && projectNumber) {
		return execute(
			`select * from project where project_number like '%${projectNumber}%' and project_name like '%${projectName}%'`
		);
	} else if (projectName) {
		return execute(`select * from project where project_name like '%${projectName}%'`);
	} else if (projectNumber) {
		return execute(`select * from project where project_number like '%${projectNumber}%'`);
	} else{
		return execute("select * from project");
	}
}

function insertProject(data) {
	return execute(
		`INSERT INTO project (id, project_name, project_number) VALUES('${data.id}', '${data.projectName}' ,'${data.projectNumber}')`
	);
}

function updateProject(data) {
	return execute(
		`UPDATE project SET project_name='${data.projectName}', project_number='${data.projectNumber}' WHERE id='${data.projectId}'`
	);
}

function deleteAllProject(){
	return execute(`delete from project`);
}

module.exports = {
	selectAllProject,
	selectProjectById,
	insertProject,
	updateProject,
	selectProjectByProjectNumberAndProjectName,
	deleteAllProject,
};

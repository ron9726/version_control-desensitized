const { execute } = require("../utils/base");

function selectProjectDetailWithVersionInfoByProjectId(projectId) {
	return execute(`select project_name, project_number, id, current_version_id, current_version, start_time, release_time
from (select project_name, project_number, project.id as id, current_version_id, current_version, start_time, release_time
  from project left join (
    select id as current_version_id, project_id, version_name as current_version, start_time, release_time
    from version
    where project_id = '${projectId}' and status!=2
    order by start_time, priority
    limit 1
  ) t on project.id = t.project_id) t2
 where t2.id = '${projectId}'`);
}

module.exports = {
	selectProjectDetailWithVersionInfoByProjectId,
};

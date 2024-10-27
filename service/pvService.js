const pvDA = require('../database/pvDA');

function getProjectDetailWithVersionInfoByProjectId(projectId){
  return pvDA.selectProjectDetailWithVersionInfoByProjectId(projectId);
}

module.exports = {
  getProjectDetailWithVersionInfoByProjectId,
}
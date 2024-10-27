const projectDA = require('../database/projectDA');

function getAllProjects(projectName,projectNumber){
  return projectDA.selectProjectByProjectNumberAndProjectName(projectNumber, projectName);
}

module.exports = {
  getAllProjects,
}
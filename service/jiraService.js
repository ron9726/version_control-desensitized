const { jira } = require("../utils/base");
const { v4 } = require("uuid");
const versionDA = require("../database/versionDA");
const projectDA = require("../database/projectDA");

function getAndInsertJiraProjects() {
  return jira.listProjects().then(
    (res) => {
      return new Promise(resolve => {
        let count = 0;
        res.forEach(async (project) => {
          // 过滤掉测试等不需要研发的项目
          if (project.projectCategory.id !== "10001") {
            count++;
            return;
          }
          await projectDA.insertProject({
            id: project.id,
            projectName: project.name,
            projectNumber: project.key,
          });
          count++;
          if (count === res.length) {
            resolve();
          }
        });
      })
    },
    (err) => {
      console.log("err :>> ", err);
    }
  );
}

function getVersionData(version) {
  let status = version.released ? 2 : 0;
  const fullReg =
    /[v|V]{1}[1-9][0-9]?\.[0-9]{1,2}\.[0-9]{1,2}(\.C.*?-U[1-9][0-9]?)?/g;
  if (fullReg.exec(version.name) === null) {
    return undefined;
  }
  const versionNameReg =
    /[v|V]{1}[1-9][0-9]?\.[0-9]{1,2}\.[0-9]{1,2}(\.C.*?-U[1-9][0-9]?)?/g;
  const msfReg = /[v|V]{1}[1-9][0-9]?\.[0-9]{1,2}\.[0-9]{1,2}/g;
  const customTagReg = /C.*?-U[1-9][0-9]?/g;
  const msfArr = msfReg
    .exec(version.name)[0]
    .replace("V", "v")
    .replace("v", "")
    .split(".");
  let customNumber,
    upgradeNumber,
    nature = 0;
  const customTag = customTagReg.exec(version.name)?.[0];
  if (customTag) {
    const tagTemp = customTag.split("-");
    customNumber = tagTemp[0].replace("C", "");
    upgradeNumber = tagTemp[1].replace("U", "");
    nature = 1;
  }
  const versionName = versionNameReg.exec(version.name)[0].replace("V", "v");
  const main = msfArr[0];
  const sub = msfArr[1];
  const fix = msfArr[2];
  const priority = Number(msfArr.join(""));

  return {
    id: version.id,
    projectId: version.projectId,
    versionName,
    main,
    sub,
    fix,
    customNumber,
    upgradeNumber,
    status,
    nature,
    priority,
    startTime: version.startDate,
    releaseTime: version.releaseDate,
  };
}

function initVersion() {
  return projectDA.selectAllProject().then((projects) => {
    return new Promise(resolve => {
      let outCount = 0
      function addOutCount() {
        outCount++;
        if (outCount === projects.length) {
          resolve();
        }
      }
      projects.forEach((project, index) => {
        jira.getVersions(project.id).then((res) => {
          let innerCount = 0;
          if (res.length === 0) {
            addOutCount();
          }
          res.forEach(async (version) => {
            const versionData = getVersionData(version);
            //如果没有versionData或者规划开始时间，则不插入
            if (versionData && versionData.startTime) {
              await versionDA.insertVersion(versionData);
            }
            innerCount++;
            if (innerCount === res.length) {
              addOutCount();
            }
          });
        });
      });
    })

  });
}

function updateSystemData() {
  return versionDA
    .deleteAllVersions()
    .then(() => {
      return projectDA.deleteAllProject();
    })
    .then(() => {
      return getAndInsertJiraProjects();
    })
    .then(() => {
      return initVersion();
    });
}

module.exports = {
  updateSystemData,
};

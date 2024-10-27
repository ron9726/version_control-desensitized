const projectDA = require('../database/projectDA');
const versionDA = require('../database/versionDA');
const { v4 } = require('uuid');
const JiraApi = require('jira-client');
const jira = new JiraApi({
  protocol: 'https',
  host: '',
  username: 'project-viewer',
  password: '',
  apiVersion: '2',
  strictSSL: true
});

// 同步项目数据
jira.listProjects().then(
  (res) => {
    res.forEach((project) => {
      projectDA.insertProject({
        id: project.id,
        projectName: project.name,
        projectNumber: project.key
      });
    });
  },
  (err) => {
    console.log('err :>> ', err);
  }
);

//同步项目下所有的版本数据
function getReleaseData(plans) {
  let status = 2;
  plans.forEach((plan) => {
    if (!plan.released) {
      status = 0;
    }
  });
  const plan = plans[0];
  const fullReg =
    /v[1-9][0-9]?\.[0-9]{1,2}\.[0-9]{1,2}(\.C.*?-U[1-9][0-9]?)?(.S[1-9][0-9]?)/g;
  if (fullReg.exec(plan.name) === null) {
    return undefined;
  }
  const releaseNameReg =
    /v[1-9][0-9]?\.[0-9]{1,2}\.[0-9]{1,2}(\.C.*?-U[1-9][0-9]?)?/g;
  const versionReg = /v[1-9][0-9]?\.[0-9]{1,2}\.[0-9]{1,2}/g;
  const customTagReg = /C.*?-U[1-9][0-9]?/g;
  const versionArr = versionReg.exec(plan.name)[0].replace('v', '').split('.');
  let customNumber,
    upgradeNumber,
    nature = 0;
  const customTag = customTagReg.exec(plan.name)?.[0];
  if (customTag) {
    const tagTemp = customTag.split('-');
    customNumber = tagTemp[0].replace('C', '');
    upgradeNumber = tagTemp[1].replace('U', '');
    nature = 1;
  }
  const releaseName = releaseNameReg.exec(plan.name)[0];
  const main = versionArr[0];
  const sub = versionArr[1];
  const fix = versionArr[2];
  const priority = Number(versionArr.join(''));

  return {
    id: v4(),
    projectId: plan.projectId,
    releaseName,
    main,
    sub,
    fix,
    customNumber,
    upgradeNumber,
    status,
    nature,
    priority
  };
}
function categorizePlan(plans) {
  const categoryMap = new Map();
  plans.forEach((plan) => {
    const releaseNameReg =
      /v[1-9][0-9]?\.[0-9]{1,2}\.[0-9]{1,2}(\.C.*?-U[1-9][0-9]?)?/g;
    const fullReg =
      /v[1-9][0-9]?\.[0-9]{1,2}\.[0-9]{1,2}(\.C.*?-U[1-9][0-9]?)?(.S[1-9][0-9]?)/g;
    if (fullReg.exec(plan.name) === null) {
      return;
    }
    const releaseName = releaseNameReg.exec(plan.name)[0];
    let categoryArr;
    if ((categoryArr = categoryMap.get(releaseName))) {
      categoryArr.push(plan);
    } else {
      categoryMap.set(releaseName, [plan]);
    }
  });
  return categoryMap;
}
projectDA.selectAllProject().then((projects) => {
  projects.forEach((project) => {
    jira.getVersions(project.id).then((res) => {
      const categoryMap = categorizePlan(res);
      categoryMap.forEach((plans) => {
        const releaseData = getReleaseData(plans);
        versionDA.insertRelease(releaseData);
        plans.forEach((plan) => {
          versionDA.insertPlan({
            planId: plan.id,
            releaseId: releaseData.id,
            planName: plan.name,
            startTime: plan.startDate,
            releaseTime: plan.releaseDate,
            status: plan.released ? 3 : 0,
            finalRelease: 0
          });
        });
      });
    });
  });
});

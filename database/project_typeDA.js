// 操作项目编号表
const { execute, mysql } = require("../utils/base");
/**
 * 查询当前类型的项目的个数
 * @param {string} prj_type 项目类型，由所属部门，所属单位，类型，年份，月份，组成
 * @returns
 */
function selectCountByType(prj_type = "01AIYY2303") {
  return execute(
    `select * from project_type pt where pt.prj_type ='${prj_type}'`
  );
}

/**
 * 插入一条新的类型
 * @param {string} prj_type 项目类型，由所属部门，所属单位，类型，年份，月份，组成
 * @returns
 */
function insertRecord(prj_type) {
  return execute(`INSERT INTO project_type
  (prj_type, count)
  VALUES('${prj_type}', 1);`);
}

/**
 * 查询当前类型的项目的个数加1
 * @param {string} prj_type 项目类型，由所属部门，所属单位，类型，年份，月份，组成
 * @returns
 */
function updateRecord(prj_type) {
  return execute(`UPDATE project_type
  SET count=count+1
  WHERE prj_type='${prj_type}';`);
}

function undo(prj_type) {
  return execute(`UPDATE project_type
  SET count=count-1
  WHERE prj_type='${prj_type}';`);
}

module.exports = {
  selectCountByType,
  insertRecord,
  updateRecord,
};

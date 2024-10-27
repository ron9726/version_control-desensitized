// 项目编号的业务逻辑
const {
  selectCountByType,
  insertRecord,
  updateRecord,
} = require("../database/project_typeDA");

/**
 * 查询当前类型的项目的个数
 * @param {string} prj_type 项目类型，由所属部门，所属单位，类型，年份，月份，组成
 * @returns
 */
async function getProjectNumber(prj_type) {
  // 先查找表里是否有类型
  let data = await selectCountByType(prj_type);
  // 如果已经存在该类型的话
  if (data.length) {
    let count = data[0].count + 1;
    // 更新数据库
    return formatNumber(count);
  } else {
    return "01";
  }
}

async function updateOrInsertRecord(prj_type) {
  let data = await selectCountByType(prj_type);
  if (data.length) {
    data = await updateRecord(prj_type);
  } else {
    data = await insertRecord(prj_type);
  }
  return data;
}

function formatNumber(num) {
  if (num >= 10) return "" + num;
  else return "0" + num;
}

module.exports = {
  getProjectNumber,
  updateOrInsertRecord,
};

const fs = require('fs');
const dayjs = require('dayjs');
const path = require('path');

class logger{
  /**
   * 
   * @param {*} logFile filename, type:string
   * @param {*} config {timestamp:true|false}
   */
  constructor(logFile, config){
    this.logFile = this.destinationHandler(logFile);
    this.config = config || {
      timestamp:true
    }
  }
  log(...content){
    const processedContent = this.contentHandler(content.join(''))
    console.log(processedContent);
    fs.writeFileSync(this.logFile, processedContent, { flag: "a" });
  }
  contentHandler(content){
    let result;
    if(this.config.timestamp){
      result = `${dayjs().format('YYYY-MM-DD hh:mm:ss')} ${content}\n`
    }else{
      result = content;
    }
    return result;
  }
  destinationHandler(logFile){
    return path.join(__dirname, `../logs/${logFile}`);
  }
}
const requestLogger = new logger('reqLog.txt');
class ResHelper{
  static ok(playload){
    return {
      code:200,
      data:playload,
      msg:'',
    }
  }
  static error(msg){
    return {
      code:500,
      data:{},
      msg,
    }
  }
}



module.exports = {
  logger,
  ResHelper,
  requestLogger,
}
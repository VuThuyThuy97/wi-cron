var CronJob = require('cron').CronJob;
var deleteTool = require('./delete-files');
let config = require('./config/default.json');

function deleteExportedFiles () {
  new CronJob(config.deleteCronComand, function() {
    deleteTool.deleteFilesInSubDirectory(config.rootPath);
  }, null, true, 'America/Los_Angeles');
}

deleteExportedFiles();

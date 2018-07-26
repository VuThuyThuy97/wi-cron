var CronJob = require('cron').CronJob;
var deleter = require('./delete-files');

new CronJob('* * * * * *', function() {
  deleter.deleteExportedFiles();
  console.log('You will see this message every second', new Date());
}, null, true, 'America/Los_Angeles');
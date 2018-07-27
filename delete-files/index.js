let fs = require('fs');
let async = require('async');
let path = require('path');
let config = require('../config/default.json');

function deleteFilesInSubDirectory (rootDirectoryPath, callback) {
    let directories = getSubDirectories(rootDirectoryPath);
    async.each(directories, function (directory, next) {
        deleteFilesInDirectory(path.join(rootDirectoryPath, directory), function (err) {
            if(err) {
                console.log(err);
            }
            next();
        })
    }, function () {
        console.log('done');
    })
}

function deleteFilesInDirectory (directoryPath, callback) {
    fs.readdir(directoryPath, function (err, files) {
        if (!files) {
            callback();
        } else {
            async.each(files, function (file, next) {
                fs.stat(path.join(directoryPath, file), function (err, stats) {
                    let date = new Date();
                    if (getDeleteCondition(stats)) {
                        // fs.unlink(path.join(directoryPath, file), function () {})
                    }
                    next();
                })
            }, function (err) {
                callback(err);
            })
        }
    })
}

function getSubDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

function getDeleteCondition (file) {
    let maxDay = config.condition.maxDay;
    let maxSize = config.condition.maxSize;
    let maxMinute = config.condition.maxMinute;
    let now = new Date();
    console.log (getMinuteDiff(now, file.birthtime));
    // return getDayDiff(now, file.birthtime) >= maxTime;
    return (file.size > maxSize) || (getDayDiff(now, file.birthTime) > maxDay) || (getMinuteDiff(now, file.birthtime) > maxDay);
}

function getDayDiff(date1, date2) {
    return Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
}

function getMinuteDiff(date1, date2) {
    return Math.floor((date1 - date2) / (1000 * 60));
}

module.exports = {
    deleteFilesInSubDirectory: deleteFilesInSubDirectory,
    deleteFilesInDirectory: deleteFilesInDirectory
}
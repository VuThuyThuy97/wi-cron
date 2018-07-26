let fs = require('fs');
let async = require('async');
let path = require('path');

function deleteExportedFiles () {
    let rootPath = './';
    let directories = getSubDirectories(rootPath);
    // let directories = ['test'];
    async.each(directories, function (directory, nextD) {
        fs.readdir(path.join(rootPath, directory), function (err, files) {
            if (!files) {
                nextD();
            } else {
                async.each(files, function (file, nextF) {
                    fs.stat(path.join(rootPath, directory, file), function (err, stats) {
                        let date = new Date();
                        console.log('stats', getMinuteDiff(date, stats.birthtime));
                        if (getMinuteDiff(date, stats.birthtime) >= 3) {
                            fs.unlink(path.join(rootPath, directory, file), function () {
                                console.log('deleted');
                            })
                        }
                        nextF();
                    })
                }, function () {
                    nextD()
                })
            }
        })
    }, function () {
        console.log('done');
    })
}

function getSubDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

function getDayDiff(date1, date2) {
    return Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));
}

function getMinuteDiff(date1, date2) {
    return Math.floor((date1 - date2) / (1000 * 60));
}

module.exports = {
    deleteExportedFiles: deleteExportedFiles
}
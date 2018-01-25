import path = require('path');
import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');

function GetToolRunner() {
    var newman: trm.ToolRunner = tl.tool(tl.which('newman', true));
    newman.arg('run');
    let sslClientCert = tl.getPathInput('sslClientCert', false, true);
    newman.argIf(typeof sslClientCert != 'undefined' && sslClientCert, ['--ssl-client-cert', sslClientCert]);
    let sslClientKey = tl.getPathInput('sslClientKey', false, true);
    newman.argIf(typeof sslClientKey != 'undefined' && sslClientKey, ['--ssl-client-key', sslClientKey]);
    let reporterHtmlTemplate = tl.getPathInput('reporterHtmlTemplate', false, true);
    newman.argIf(typeof reporterHtmlTemplate != 'undefined' && reporterHtmlTemplate, ['--reporter-html-template', reporterHtmlTemplate]);
    let reporterHtmlExport = tl.getInput('reporterHtmlExport');
    newman.argIf(typeof reporterHtmlExport != 'undefined' && reporterHtmlExport, ['--reporter-html-export', reporterHtmlExport]);
    let reporterJsonExport = tl.getInput('reporterJsonExport');
    newman.argIf(typeof reporterJsonExport != 'undefined' && reporterJsonExport, ['--reporter-json-export', reporterJsonExport]);
    let reporters = tl.getInput('reporters');
    newman.argIf(typeof reporters != 'undefined' && reporters, ['-r', reporters]);
    let delayRequest = tl.getInput('delayRequest');
    newman.argIf(typeof delayRequest != 'undefined' && delayRequest, ['--delay-request', delayRequest]);
    let timeoutRequest = tl.getInput('timeoutRequest');
    newman.argIf(typeof timeoutRequest != 'undefined' && timeoutRequest, ['--timeout-request', timeoutRequest]);
    let numberOfIterations = tl.getInput('numberOfIterations');
    newman.argIf(typeof numberOfIterations != 'undefined' && numberOfIterations, ['-n', numberOfIterations]);
    newman.arg(['-e', tl.getPathInput('environment', true, true)]);
    let globalVariable = tl.getPathInput('globalVariables',false,true);
    newman.argIf(typeof globalVariable !='undefined'&& globalVariable,['--globals',globalVariable]);
    return newman;
}

async function run() {
    try {
        tl.debug('executing newman')
        tl.setResourcePath(path.join(__dirname, 'task.json'));

        let collectionFileSource = tl.getPathInput('collectionFileSource', true, true);
        var taskSuccess = true;
        if (tl.stats(collectionFileSource).isDirectory()) {
            let contents: string[] = tl.getDelimitedInput('Contents', '\n', true);
            collectionFileSource = path.normalize(collectionFileSource);

            let allPaths: string[] = tl.find(collectionFileSource);
            let matchedPaths: string[] = tl.match(allPaths, contents, collectionFileSource);
            let matchedFiles: string[] = matchedPaths.filter((itemPath: string) => !tl.stats(itemPath).isDirectory());

            console.log("found %d files", matchedFiles.length);

            if (matchedFiles.length > 0) {
                matchedFiles.forEach((file: string) => {
                    var newman: trm.ToolRunner = GetToolRunner();
                    newman.arg(file);

                    var execResponse = newman.execSync();

                    if (execResponse.code === 1) {
                        console.log(execResponse);
                        taskSuccess = false;
                    }
                });
            }
            else {
                console.log("Could not find any collection files in the path provided");
                taskSuccess = false;
            }
        }
        else {
            var newman: trm.ToolRunner = GetToolRunner();
            newman.arg(collectionFileSource);

            await newman.exec();
        }

        if (taskSuccess) {
            tl.setResult(tl.TaskResult.Succeeded, "Success");
        }
        else {
            tl.setResult(tl.TaskResult.Failed, "Failed");
        }
    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
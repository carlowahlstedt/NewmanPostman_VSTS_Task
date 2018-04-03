import path = require('path');
import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');

function GetToolRunner(collectionToRun) {
    var newman: trm.ToolRunner = tl.tool(tl.which('newman', true));
    newman.arg('run');
    newman.arg(collectionToRun);

    let sslClientCert = tl.getPathInput('sslClientCert', false, true);
    newman.argIf(typeof sslClientCert != 'undefined' && sslClientCert, ['--ssl-client-cert', sslClientCert]);
    let sslClientKey = tl.getPathInput('sslClientKey', false, true);
    newman.argIf(typeof sslClientKey != 'undefined' && sslClientKey, ['--ssl-client-key', sslClientKey]);
    let sslStrict = tl.getBoolInput('sslStrict');
    newman.argIf(sslStrict, ['--insecure']);

    let reporterHtmlTemplate = tl.getPathInput('reporterHtmlTemplate', false, true);
    newman.argIf(typeof reporterHtmlTemplate != 'undefined' && tl.filePathSupplied('reporterHtmlTemplate'), ['--reporter-html-template', reporterHtmlTemplate]);
    let reporterHtmlExport = tl.getPathInput('reporterHtmlExport');
    newman.argIf(typeof reporterHtmlExport != 'undefined' && tl.filePathSupplied('reporterHtmlExport'), ['--reporter-html-export', reporterHtmlExport]);
    let reporterJsonExport = tl.getPathInput('reporterJsonExport');
    newman.argIf(typeof reporterJsonExport != 'undefined' && tl.filePathSupplied('reporterJsonExport'), ['--reporter-json-export', reporterJsonExport]);
    let reporterJUnitExport = tl.getPathInput('reporterJUnitExport', false, true);
    newman.argIf(typeof reporterJUnitExport != 'undefined' && tl.filePathSupplied('reporterJUnitExport'), ['--reporter-junit-export', reporterJUnitExport]);
    let reporterList = tl.getInput('reporters');
    newman.argIf(typeof reporterList != 'undefined' && (reporterList.split(',').length != 0), ['-r', reporterList]);

    let delayRequest = tl.getInput('delayRequest');
    newman.argIf(typeof delayRequest != 'undefined' && delayRequest, ['--delay-request', delayRequest]);
    let timeoutRequest = tl.getInput('timeoutRequest');
    newman.argIf(typeof timeoutRequest != 'undefined' && timeoutRequest, ['--timeout-request', timeoutRequest]);
    let timeoutGlobal = tl.getInput('timeoutGlobal', false);
    newman.argIf(typeof timeoutGlobal != 'undefined' && timeoutGlobal, ['--timeout', timeoutGlobal]);
    let timeoutScript = tl.getInput('timeoutScript', false);
    newman.argIf(typeof timeoutScript != 'undefined' && timeoutScript, ['--timeout-script', timeoutScript]);

    let numberOfIterations = tl.getInput('numberOfIterations');
    newman.argIf(typeof numberOfIterations != 'undefined' && numberOfIterations, ['-n', numberOfIterations]);
    let globalVariable = tl.getPathInput('globalVariables', false, true);
    newman.argIf(typeof globalVariable != 'undefined' && tl.filePathSupplied('globalVariables'), ['--globals', globalVariable]);
    let dataFile = tl.getPathInput('dataFile', false, true);
    newman.argIf(typeof globalVariable != 'undefined' && tl.filePathSupplied('dataFile'), ['--iteration-data', dataFile]);
    let folder = tl.getInput('folder');
    newman.argIf(typeof folder != 'undefined' && folder, ['--folder', folder]);
    let globalVars: string[] = tl.getDelimitedInput('globalVars', '\n');
    globalVars.forEach(globVar => {
        newman.arg(['--global-var', globVar]);
    });
    let ignoreRedirect = tl.getBoolInput('ignoreRedirect');
    newman.argIf(ignoreRedirect, ['--ignore-redirects']);

    let exportEnvironment = tl.getPathInput('exportEnvironment');
    newman.argIf(tl.filePathSupplied('exportEnvironment'), ['--export-environment', exportEnvironment]);
    let exportGlobals = tl.getPathInput('exportGlobals');
    newman.argIf(tl.filePathSupplied('exportGlobals'), ['--export-globals', exportGlobals]);
    let exportCollection = tl.getPathInput('exportCollection');
    newman.argIf(tl.filePathSupplied('exportCollection'), ['--export-collection', exportCollection]);

    newman.arg(['-e', tl.getPathInput('environment', true, true)]);
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
                    var newman: trm.ToolRunner = GetToolRunner(file);
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
            var newman: trm.ToolRunner = GetToolRunner(collectionFileSource);
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
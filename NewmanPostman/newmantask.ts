import path = require('path');
import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');
import isurl = require('is-url');

function GetToolRunner(collectionToRun: string) {
    let pathToNewman = tl.getInput('pathToNewman', false);
    if (typeof pathToNewman != 'undefined' && pathToNewman) {
        console.info("Specific path to newman found");
    } else {
        console.info("No specific path to newman, using default of 'newman'");
        pathToNewman = "newman";
    }

    var newman: trm.ToolRunner = tl.tool(tl.which(pathToNewman, true));

    newman.arg('run');
    newman.arg(collectionToRun);

    let sslClientCert = tl.getPathInput('sslClientCert', false, true);
    newman.argIf(typeof sslClientCert != 'undefined' && tl.filePathSupplied('sslClientCert'), ['--ssl-client-cert', sslClientCert]);
    let sslClientKey = tl.getPathInput('sslClientKey', false, true);
    newman.argIf(typeof sslClientKey != 'undefined' && tl.filePathSupplied('sslClientKey'), ['--ssl-client-key', sslClientKey]);
    let sslStrict = tl.getBoolInput('sslStrict');
    newman.argIf(sslStrict, ['--insecure']);

    let unicodeDisabled = tl.getBoolInput('unicodeDisabled');
    newman.argIf(unicodeDisabled, ['--disable-unicode']);

    let forceNoColor = tl.getBoolInput('forceNoColor');
    newman.argIf(forceNoColor, ['--no-color']);

    let reporterHtmlTemplate = tl.getPathInput('reporterHtmlTemplate', false, true);
    newman.argIf(typeof reporterHtmlTemplate != 'undefined' && tl.filePathSupplied('reporterHtmlTemplate'), ['--reporter-html-template', reporterHtmlTemplate]);
    let reporterHtmlExport = tl.getPathInput('reporterHtmlExport');
    newman.argIf(typeof reporterHtmlExport != 'undefined' && tl.filePathSupplied('reporterHtmlExport'), ['--reporter-html-export', reporterHtmlExport]);
    let reporterJsonExport = tl.getPathInput('reporterJsonExport');
    newman.argIf(typeof reporterJsonExport != 'undefined' && tl.filePathSupplied('reporterJsonExport'), ['--reporter-json-export', reporterJsonExport]);
    let reporterJUnitExport = tl.getPathInput('reporterJUnitExport', false, true);
    newman.argIf(typeof reporterJUnitExport != 'undefined' && tl.filePathSupplied('reporterJUnitExport'), ['--reporter-junit-export', reporterJUnitExport]);

    let reporterList = tl.getInput('reporters');
    let customReporter = tl.getInput('customReporter');
    let newReporterList = "";

    if (customReporter != 'undefined' && customReporter) {
        console.info("Custom report configuration detected");
        if (reporterList != 'undefined' && reporterList.split(',').length != 0) { //there is at least one reporter from select
            //append custom one to the list
            newReporterList = reporterList + "," + customReporter.trim();
        } else { //only custom report
            newReporterList = customReporter.trim();
        }
    } else {
        console.info("No custom report configured");
        newReporterList = reporterList;
    }
    console.info("Reporter list is : " + newReporterList);

    newman.argIf(newReporterList != null && (newReporterList.split(',').length != 0), ['-r', newReporterList]);

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

    if (tl.getInput('environmentSourceType') == 'file') { //environment is a file
        newman.arg(['-e', tl.getPathInput('environmentFile', true, true)]);
    } else {
        let envURl = tl.getInput('environmentUrl', true);
        if (isurl(envURl)) {
            newman.arg(['-e', envURl]);
        } else {
            tl.setResult(tl.TaskResult.Failed, 'Provided string "' + envURl + '" for environment is not a valid url');
        }
    }
    return newman;
}

async function run() {
    try {
        // tl.debug('executing newman')
        tl.setResourcePath(path.join(__dirname, 'task.json'));

        if (tl.getInput('collectionSourceType', true) == 'file') {
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
                        // tl.debug(execResponse.stdout);
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
        } else {
            let collectionFileUrl = tl.getInput('collectionURL', true);
            if (isurl(collectionFileUrl)) {
                var newman: trm.ToolRunner = GetToolRunner(collectionFileUrl);
                await newman.exec();
            } else {
                tl.setResult(tl.TaskResult.Failed, 'Provided string "' + collectionFileUrl + '" for collection is not a valid url');
            }
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
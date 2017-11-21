import path = require('path');
import tl = require('vsts-task-lib/task');
import trm = require('vsts-task-lib/toolrunner');

async function run() {
    try {
        tl.debug('executing newman')
        tl.setResourcePath(path.join(__dirname, 'task.json'));

        var newman: trm.ToolRunner = tl.tool(tl.which('newman', true));

        newman.arg('run');
        newman.arg(tl.getPathInput('collectionFileSource', true, true));
        newman.arg(['-e', tl.getPathInput('environment', true, true)]);

        let sslClientCert = tl.getPathInput('sslClientCert', false, true);
        newman.argIf(typeof sslClientCert != 'undefined' && sslClientCert, ['--ssl-client-cert', sslClientCert]);

        let sslClientKey = tl.getPathInput('sslClientKey', false, true);
        newman.argIf(typeof sslClientKey != 'undefined' && sslClientKey, ['--ssl-client-key', sslClientKey]);

        let reporterHtmlTemplate = tl.getPathInput('reporterHtmlTemplate', false, true);
        newman.argIf(typeof reporterHtmlTemplate != 'undefined' && reporterHtmlTemplate, ['--reporter-html-template', reporterHtmlTemplate]);

        let reporterHtmlExport = tl.getPathInput('reporterHtmlExport', false, true);
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

        await newman.exec();

        tl.setResult(tl.TaskResult.Succeeded, "Success");
    } catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();

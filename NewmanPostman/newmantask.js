"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const tl = require("vsts-task-lib/task");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            tl.debug('executing newman');
            tl.setResourcePath(path.join(__dirname, 'task.json'));
            var newman = tl.tool(tl.which('newman', true));
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
            let collectionFileSource = tl.getPathInput('collectionFileSource', true, true);
            if (tl.stats(collectionFileSource).isDirectory()) {
                let contents = tl.getDelimitedInput('Contents', '\n', true);
                collectionFileSource = path.normalize(collectionFileSource);
                let allPaths = tl.find(collectionFileSource);
                let matchedPaths = tl.match(allPaths, contents, collectionFileSource);
                let matchedFiles = matchedPaths.filter((itemPath) => !tl.stats(itemPath).isDirectory());
                console.log(tl.loc('FoundNFiles', matchedFiles.length));
                if (matchedFiles.length > 0) {
                    matchedFiles.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                        newman.arg('run');
                        newman.arg(file);
                        newman.arg(['-e', tl.getPathInput('environment', true, true)]);
                        yield newman.exec();
                    }));
                }
            }
            else {
                newman.arg('run');
                newman.arg(collectionFileSource);
                newman.arg(['-e', tl.getPathInput('environment', true, true)]);
                yield newman.exec();
            }
            tl.setResult(tl.TaskResult.Succeeded, "Success");
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();

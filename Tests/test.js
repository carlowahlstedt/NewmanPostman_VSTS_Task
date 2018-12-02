"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocktest = require("vsts-task-lib/mock-test");
const path = require("path");
const assert = require("assert");
describe('Mandatory arguments', function () {
    before(() => { });
    after(() => { });
    it('Error if collection file path is empty', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'emptyCollectionTest.js');
        console.info(testPath);
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // assert(runner.succeeded, 'should have succeeded');
        console.error(runner.stdout);
        assert.equal(runner.errorIssues.length, 0, 'NO ERROR');
        done();
    });
});

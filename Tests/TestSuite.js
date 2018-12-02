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
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        assert(runner.stdOutContained('Input required: collectionFileSource'), 'Empty Collection file source raise an error');
        done();
    });
    it('Error if collection is a directory and content not set', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'emptyContents.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        assert(runner.stdOutContained('Input required: Contents'), 'Empty content raise an error if collection is a directory');
        done();
    });
});
describe('Other arguments', function () {
    before(() => { });
    after(() => { });
    it('Multiple report format can be set', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'customReporterTest.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        assert(runner.stdOutContained('-r cli,json'), 'custom reporter format are set');
        done();
    });
    it('Number of iteration can be set', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'numberOfIterationTest.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        assert(runner.stdOutContained('-n 2'), 'number of iteration is set');
        done();
    });
    it('Folder can be set', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'folderTest.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.stdOutContained('--folder /'), 'folder is set');
        done();
    });
    it('Global var file can be set', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'globalVarFileTest.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.stdOutContained('--globals ' + __dirname), 'folder is set');
        done();
    });
    it('Multiple Global vars can be set', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'globalVarTest.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.stdOutContained('--global-var var1=1 --global-var var2=2'), 'multiple variables are set');
        done();
    });
});

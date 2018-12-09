"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocktest = require("vsts-task-lib/mock-test");
const path = require("path");
const assert = require("assert");
describe('Error handling', function () {
    before(() => { });
    after(() => { });
    it('Error if collection file path is empty', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'emptyCollectionTest.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        assert(runner.stdOutContained('Input required: collectionFileSource'), 'Empty Collection file source should raise an error');
        done();
    });
    it('Error if collection is a directory and content not set', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'emptyContents.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.stdOutContained('Input required: Contents'), 'Empty content should raise an error if collection is a directory');
        done();
    });
    it('Error if environement is set as a file and none set', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'emptyEnvironmentFile.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.stdOutContained('Input required: environmentFile'), 'Empty environment file should raise an error if envt type is \'file\'');
        done();
    });
    it('Error if environement is set as a URL and none set', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'emptyEnvironmentURL.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.stdOutContained('Input required: environmentUrl'), 'Empty url should raise an error if envt type is \'url\'');
        done();
    });
    it('Error if provided environment url is not a valid url', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'wrongEnvironmentURL.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.stdOutContained('for environment is not a valid url'), 'Error if environement URL format is incorrect');
        done();
    });
    it('Error if provided collection url is not a valid url', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'wrongCollectionURL.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.stdOutContained('for collection is not a valid url'), 'Error if collection URL format is incorrect');
        done();
    });
});
describe('Normal behavior', function () {
    before(() => { });
    after(() => { });
    it('Environment is not mandatory', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'noEnvironment.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.stdOutContained('No environment set, no need to add it in argument'), 'No error if no envt is set');
        done();
    });
    it('When environment file is set, it\'s used', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'useEnvironmentFile.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.stdOutContained('-e ' + path.join(__dirname, 'assets/Core.postman_collection.json')), 'environment file can be used');
        done();
    });
    it('URL can be set for collection', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'useCollectionURL.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.stdOutContained('run https://api.getpostman.com/collections/$collectionUid?apikey=$apiKey'), 'url can be used as collection source');
        done();
    });
    it('URL can be set for environment', (done) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'useEnvironmentURL.js');
        let runner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.stdOutContained('-e https://api.getpostman.com/environments?apikey=$apiKey'), 'url can be used as environment source');
        done();
    });
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
//# sourceMappingURL=TestSuite.js.map
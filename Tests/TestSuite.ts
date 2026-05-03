import * as mocktest from 'azure-pipelines-task-lib/mock-test';
import * as path from 'path';
import * as assert from 'assert';

describe('Error handling', function () {
    before(() => { });

    after(() => { });

    it('Error if collection file path is empty', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'emptyCollectionTest.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        console.log(runner.stderr);
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('Input required: collectionFileSource'), 'Empty Collection file source should raise an error');
        done();
    });
    it('Error if collection is a directory and content not set', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'emptyContents.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('Input required: Contents'), 'Empty content should raise an error if collection is a directory');
        done();
    });
    it('Error if environement is set as a file and none set', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'emptyEnvironmentFile.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('Input required: environment'), 'Empty environment file should raise an error if envt type is \'file\'');
        done();
    });
    it('Error if environement is set as a URL and none set', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'emptyEnvironmentURL.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('Input required: environmentUrl'), 'Empty url should raise an error if envt type is \'url\'');
        done();
    })
    it('Error if provided environment url is not a valid url', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'wrongEnvironmentURL.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('for environment is not a valid url'), 'Error if environement URL format is incorrect');
        done();
    });
    it('Error if provided collection url is not a valid url', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'wrongCollectionURL.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('for collection is not a valid url'), 'Error if collection URL format is incorrect');
        done();
    })
    it('Error if no match file in collection directory', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'noMatchedFileInDir.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('Could not find any collection files in the path provided'), 'Error if collection URL format is incorrect');
        // assert(runner.errorIssues)
        done();
    })
});


describe('Normal behavior', function () {
    before(() => { });

    after(() => { });
    it('Environment is not mandatory', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'noEnvironment.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.succeeded, 'Should in success');
        assert(runner.stdOutContained('No environment set, no need to add it in argument'), 'No error if no envt is set');
        done();
    })
    it('When a folder is set as source, collection in this dir are used', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'folderAsSource.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.succeeded, 'Should be in success')
        assert(runner.stdOutContained('found 2 files'), '2 files are found');
        assert(runner.invokedToolCount == 2, 'should have call n two times. Actual:' + runner.invokedToolCount);
        assert(runner.stdOutContained('n run /srcDir/collection1.json'), 'Should have used collection1.json');
        assert(runner.stdOutContained('n run /srcDir/collection2.json'), 'Should have used collection2.json');

        done();
    })
    it('When environment file is set, it\'s used', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'useEnvironmentFile.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.succeeded, 'Should be in success')
        assert(runner.stdOutContained('-e ' + path.normalize('/srcDir/environment.json')), 'environment file is added as arg');
        done();
    });
    it('URL can be set for collection', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'useCollectionURL.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.succeeded, 'Should be in success')
        assert(runner.stdOutContained('run https://api.getpostman.com/collections/4b34e87f2bd3fbbaf1a4'), 'url is used as collection source');
        done();
    });
    it('URL can be set for environment', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'useEnvironmentURL.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('-e https://api.getpostman.com/environments?apikey=4b34e87f2bd3fbbaf1a4'), 'url can be used as environment source');
        done();
    });
    it('Multiple report format can be set', (done: MochaDone) => {
        this.timeout(1000);

        let testPath = path.join(__dirname, 'customReporterTest.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('-r cli,json'), 'custom reporter format are set');
        done();
    });

    it('Number of iteration can be set', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'numberOfIterationTest.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('-n 2'), 'number of iteration is set');
        done();
    });

    it('Folder can be set', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'folderTest.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('--folder /'), 'folder is set');
        done();
    });
    it('Global var file can be set', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'globalVarFileTest.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('--globals ' + path.normalize('/srcDir/Global.json')), 'folder is set');
        done();
    });
    it('Multiple Global vars can be set', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'globalVarTest.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('--global-var var1=1 --global-var var2=2'), 'multiple variables are set');
        done();
    });
    it('When path to newman is set, this one is used', (done: MochaDone) => {
        this.timeout(1000);
        let testPath = path.join(__dirname, 'useNewmanPath.js');
        let runner: mocktest.MockTestRunner = new mocktest.MockTestRunner(testPath);
        runner.run();
        // console.error(runner.stdout);
        assert(runner.succeeded, 'Should be in success');
        done();
    })
});



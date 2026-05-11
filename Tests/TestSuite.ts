import * as mocktest from 'azure-pipelines-task-lib/mock-test';
import * as path from 'path';
import * as assert from 'assert';

function makeRunner(testFile: string): mocktest.MockTestRunner {
    let runner = new mocktest.MockTestRunner(path.join(__dirname, testFile));
    runner.nodePath = process.execPath;
    return runner;
}

describe('Error handling', function () {
    before(() => { });

    after(() => { });

    it('Error if collection file path is empty', async () => {
        let runner = makeRunner('emptyCollectionTest.js');
        await runner.runAsync();
        console.log(runner.stderr);
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('Input required: collectionFileSource'), 'Empty Collection file source should raise an error');
    });
    it('Error if collection is a directory and content not set', async () => {
        let runner = makeRunner('emptyContents.js');
        await runner.runAsync();
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('Input required: Contents'), 'Empty content should raise an error if collection is a directory');
    });
    it('Error if environement is set as a file and none set', async () => {
        let runner = makeRunner('emptyEnvironmentFile.js');
        await runner.runAsync();
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('Input required: environment'), 'Empty environment file should raise an error if envt type is \'file\'');
    });
    it('Error if environement is set as a URL and none set', async () => {
        let runner = makeRunner('emptyEnvironmentURL.js');
        await runner.runAsync();
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('Input required: environmentUrl'), 'Empty url should raise an error if envt type is \'url\'');
    });
    it('Error if provided environment url is not a valid url', async () => {
        let runner = makeRunner('wrongEnvironmentURL.js');
        await runner.runAsync();
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('for environment is not a valid url'), 'Error if environement URL format is incorrect');
    });
    it('Error if provided collection url is not a valid url', async () => {
        let runner = makeRunner('wrongCollectionURL.js');
        await runner.runAsync();
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('for collection is not a valid url'), 'Error if collection URL format is incorrect');
    });
    it('Error if no match file in collection directory', async () => {
        let runner = makeRunner('noMatchedFileInDir.js');
        await runner.runAsync();
        assert(runner.failed, 'Should be in Failed status');
        assert(runner.stdOutContained('Could not find any collection files in the path provided'), 'Error if collection URL format is incorrect');
    });
});


describe('Normal behavior', function () {
    before(() => { });

    after(() => { });

    it('Environment is not mandatory', async () => {
        let runner = makeRunner('noEnvironment.js');
        await runner.runAsync();
        assert(runner.succeeded, 'Should in success');
        assert(runner.stdOutContained('No environment set, no need to add it in argument'), 'No error if no envt is set');
    });
    it('When a folder is set as source, collection in this dir are used', async () => {
        let runner = makeRunner('folderAsSource.js');
        await runner.runAsync();
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('found 2 files'), '2 files are found');
        assert(runner.invokedToolCount == 2, 'should have call n two times. Actual:' + runner.invokedToolCount);
        assert(runner.stdOutContained('n run ' + path.normalize('/srcDir/collection1.json')), 'Should have used collection1.json');
        assert(runner.stdOutContained('n run ' + path.normalize('/srcDir/collection2.json')), 'Should have used collection2.json');
    });
    it('When environment file is set, it\'s used', async () => {
        let runner = makeRunner('useEnvironmentFile.js');
        await runner.runAsync();
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('-e ' + path.normalize('/srcDir/environment.json')), 'environment file is added as arg');
    });
    it('URL can be set for collection', async () => {
        let runner = makeRunner('useCollectionURL.js');
        await runner.runAsync();
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('run https://api.getpostman.com/collections/4b34e87f2bd3fbbaf1a4'), 'url is used as collection source');
    });
    it('URL can be set for environment', async () => {
        let runner = makeRunner('useEnvironmentURL.js');
        await runner.runAsync();
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('-e https://api.getpostman.com/environments?apikey=4b34e87f2bd3fbbaf1a4'), 'url can be used as environment source');
    });
    it('Multiple report format can be set', async () => {
        let runner = makeRunner('customReporterTest.js');
        await runner.runAsync();
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('-r cli,json'), 'custom reporter format are set');
    });
    it('Number of iteration can be set', async () => {
        let runner = makeRunner('numberOfIterationTest.js');
        await runner.runAsync();
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('-n 2'), 'number of iteration is set');
    });
    it('Folder can be set', async () => {
        let runner = makeRunner('folderTest.js');
        await runner.runAsync();
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('--folder /'), 'folder is set');
    });
    it('Global var file can be set', async () => {
        let runner = makeRunner('globalVarFileTest.js');
        await runner.runAsync();
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('--globals ' + path.normalize('/srcDir/Global.json')), 'folder is set');
    });
    it('Multiple Global vars can be set', async () => {
        let runner = makeRunner('globalVarTest.js');
        await runner.runAsync();
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('--global-var var1=1 --global-var var2=2'), 'multiple variables are set');
    });
    it('When path to newman is set, this one is used', async () => {
        let runner = makeRunner('useNewmanPath.js');
        await runner.runAsync();
        assert(runner.succeeded, 'Should be in success');
    });
    it('htmlExtra template path is forwarded to newman with the correct flag', async () => {
        let runner = makeRunner('htmlExtraTemplateTest.js');
        await runner.runAsync();
        assert(runner.succeeded, 'Should be in success');
        assert(runner.stdOutContained('--reporter-htmlextra-template ' + path.normalize('/srcDir/htmlExtra.hbs')), 'htmlextra template is added as arg');
    });
});

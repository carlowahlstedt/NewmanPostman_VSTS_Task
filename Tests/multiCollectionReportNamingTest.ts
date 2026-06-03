import mockanswer = require('azure-pipelines-task-lib/mock-answer');
import mockrun = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'NewmanPostman', 'newmantask.js');

let runner: mockrun.TaskMockRunner = new mockrun.TaskMockRunner(taskPath);
let dirPath = path.normalize('/srcDir/');
let junitOut = path.normalize('/out/report.xml');

runner.setInput('collectionSourceType', 'file');
runner.setInput('environmentSourceType', 'none');
runner.setInput('collectionFileSource', dirPath);
runner.setInput('Contents', '**/collection1.json\n**/collection2.json');
runner.setInput('reporters', 'junit');
runner.setInput('reporterJUnitExport', junitOut);

let answers = <mockanswer.TaskLibAnswers>{
    'checkPath': {},
    'which': {
        'newman': 'newman'
    },
    'stats': {},
    'find': {},
    'exec': {}
};
answers.checkPath[dirPath] = true;
answers.checkPath['newman'] = true;
answers.checkPath[junitOut] = true;
answers.stats[dirPath] = true;
answers.find[dirPath] = [
    path.normalize('/srcDir/collection1.json'),
    path.normalize('/srcDir/collection2.json'),
];

let suffixed1 = path.join(path.dirname(junitOut), 'report-collection1.xml');
let suffixed2 = path.join(path.dirname(junitOut), 'report-collection2.xml');
answers.exec[`newman run ${dirPath}collection1.json --reporter-junit-export ${suffixed1} -r junit`] = { 'code': 0, 'stdout': 'OK' };
answers.exec[`newman run ${dirPath}collection2.json --reporter-junit-export ${suffixed2} -r junit`] = { 'code': 0, 'stdout': 'OK' };

runner.setAnswers(answers);
runner.registerMockExport('stats', (itemPath: string) => {
    switch (itemPath) {
        case dirPath:
            return { isDirectory: () => true };
        case path.normalize('/srcDir/collection1.json'):
        case path.normalize('/srcDir/collection2.json'):
            return { isDirectory: () => false };
        default:
            throw { code: 'ENOENT' };
    }
});

runner.run();

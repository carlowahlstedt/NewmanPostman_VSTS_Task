import mockanswer = require('azure-pipelines-task-lib/mock-answer');
import mockrun = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'NewmanPostman', 'newmantask.js');

let runner: mockrun.TaskMockRunner = new mockrun.TaskMockRunner(taskPath);
let filePath = path.normalize('/srcDir/collection.json');
let localBin = path.join(process.cwd(), 'node_modules', '.bin',
    process.platform === 'win32' ? 'newman.cmd' : 'newman');

runner.setInput('collectionSourceType', 'file');
runner.setInput('environmentSourceType', 'none');
runner.setInput('collectionFileSource', filePath);
runner.setInput('Contents', path.normalize('**/collection.json'));

let answers = <mockanswer.TaskLibAnswers>{
    'checkPath': {},
    'which': {
        'newman': '/should/not/be/used/newman'
    },
    'stats': {},
    'exist': {},
    'exec': {}
};
answers.checkPath[filePath] = true;
answers.checkPath['/should/not/be/used/newman'] = true;
answers.exist[localBin] = true;
answers.stats[filePath] = true;
runner.setAnswers(answers);

answers.exec[`${localBin} run ${filePath}`] = { 'code': 0, 'stdout': 'OK' };
runner.run();

import mockanswer = require('azure-pipelines-task-lib/mock-answer');
import mockrun = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'NewmanPostman', 'newmantask.js');

let runner: mockrun.TaskMockRunner = new mockrun.TaskMockRunner(taskPath);
let filePath = path.normalize('/srcDir/collection.json');

runner.setInput('collectionSourceType', 'file');
runner.setInput('environmentSourceType', 'none');
runner.setInput('collectionFileSource', filePath);
runner.setInput('Contents', path.normalize('**/collection.json'));
runner.setInput('forceNoColor', 'true');

let answers = <mockanswer.TaskLibAnswers>{
    'checkPath': {},
    'which': {
        'newman': 'newman'
    },
    'stats': {},
    'exec': {}
};
answers.checkPath[filePath] = true;
answers.checkPath['newman'] = true;
answers.stats[filePath] = true;
runner.setAnswers(answers);

answers.exec[`newman run ${filePath} --color off`] = { 'code': 0, 'stdout': 'OK' };
runner.run();

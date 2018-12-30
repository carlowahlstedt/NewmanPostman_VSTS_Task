import mockanswer = require('azure-pipelines-task-lib/mock-answer');
import mockrun = require('azure-pipelines-task-lib/mock-run');
import path = require('path')
import { ENOENT } from 'constants';

let taskPath = path.join(__dirname, '..', 'NewmanPostman', 'newmantask.js');

let runner: mockrun.TaskMockRunner = new mockrun.TaskMockRunner(taskPath);
let filePath = path.normalize('/srcDir/');

runner.setInput("collectionSourceType", 'file');
runner.setInput("collectionFileSource", filePath);
runner.setInput("Contents", '**/collection1.json\n**/collection2.json');

let answers = <mockanswer.TaskLibAnswers>{
    "checkPath": {},
    "which": {
        'newman': 'newman'
    },
    "stats": {},
    "find": {}
};
answers.checkPath[filePath] = true;
answers.checkPath['newman'] = true;

answers.stats[filePath] = true;
answers.find[filePath] = [
    path.normalize('/srcDir/collection3.json')
]
runner.setAnswers(answers);
runner.registerMockExport('stats', (itemPath: string) => {
    console.log('##vso[task.debug]stats ' + itemPath);
    switch (itemPath) {
        case path.normalize('/srcDir/'):
            return { isDirectory: () => true };
        case path.normalize('/srcDir/collection3.json'):
            return { isDirectory: () => false };
        default:
            throw { code: 'ENOENT' };
    }
})

runner.run();
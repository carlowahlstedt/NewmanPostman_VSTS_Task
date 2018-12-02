import fs = require('fs');
import mockanswer = require('vsts-task-lib/mock-answer');
import mockrun = require('vsts-task-lib/mock-run');
import path = require('path')

let taskPath = path.join(__dirname, '..', 'NewmanPostman', 'newmantask.js');

console.info(taskPath);
let runner: mockrun.TaskMockRunner = new mockrun.TaskMockRunner(taskPath);
let filePath = path.join(__dirname, '/assets/Core.postman_collection.json');
let environment = path.join(__dirname, 'assets/Core.postman_collection.json');
runner.setInput("collectionFileSource", filePath);
runner.setInput("Contents",'');

let answers = <mockanswer.TaskLibAnswers>{
    checkPath: {},
    which: {
        'newman': 'newman'
    },
    stats: {}
};
answers.checkPath[filePath] = true;
answers.checkPath['newman'] = true;
answers.stats[filePath] = true;
runner.setAnswers(answers);
runner.registerMockExport('stats', (itemPath: string) => {
    console.log('##vso[task.debug]stats ' + itemPath);
    switch (itemPath) {
        case filePath:
            return { isDirectory: () => true };
        default:
            return true;
    }
})
runner.run();
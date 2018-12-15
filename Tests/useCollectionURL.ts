import mockanswer = require('azure-pipelines-task-lib/mock-answer');
import mockrun = require('azure-pipelines-task-lib/mock-run');
import path = require('path')

let taskPath = path.join(__dirname, '..', 'NewmanPostman', 'newmantask.js');

let collectionUrl = "https://api.getpostman.com/collections/4b34e87f2bd3fbbaf1a4";
let runner: mockrun.TaskMockRunner = new mockrun.TaskMockRunner(taskPath);

runner.setInput("collectionSourceType", 'url');
runner.setInput("collectionUrl", collectionUrl);
runner.setInput("environmentSourceType", 'none');


let answers = <mockanswer.TaskLibAnswers>{
    "checkPath": {},
    "which": {
        'newman': 'newman'
    },
    "stats": {},
    "exec": {}
};

answers.checkPath['newman'] = true;
runner.setAnswers(answers);

answers.exec[`newman run ${collectionUrl}`] = { 'code': 0, 'stdout': 'OK' }

runner.run();
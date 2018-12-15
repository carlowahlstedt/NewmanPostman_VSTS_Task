import fs = require('fs');
import mockanswer = require('azure-pipelines-task-lib/mock-answer');
import mockrun = require('azure-pipelines-task-lib/mock-run');
import path = require('path')

let taskPath = path.join(__dirname, '..', 'NewmanPostman', 'newmantask.js');

let runner: mockrun.TaskMockRunner = new mockrun.TaskMockRunner(taskPath);
let filePath = path.normalize('/srcDir/collection.json');
let environmentUrl = "https://api.getpostman.com/environments?apikey=4b34e87f2bd3fbbaf1a4";

runner.setInput("collectionSourceType", 'file');
runner.setInput("collectionFileSource", filePath);
runner.setInput("environmentSourceType", 'url');
runner.setInput("environmentUrl", environmentUrl);


let answers = <mockanswer.TaskLibAnswers>{
    "checkPath": {},
    "which": {
        'newman': 'newman'
    },
    "stats": {},
    "exec": {}
};
answers.checkPath[filePath] = true;
answers.checkPath['newman'] = true;
answers.stats[filePath] = true;
runner.setAnswers(answers);

answers.exec[`newman run ${filePath} -e ${environmentUrl}`] = { 'code': 0, 'stdout': 'OK' }

runner.run();
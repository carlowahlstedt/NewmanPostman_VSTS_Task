import mockanswer = require('azure-pipelines-task-lib/mock-answer');
import mockrun = require('azure-pipelines-task-lib/mock-run');
import path = require('path')

let taskPath = path.join(__dirname, '..', 'NewmanPostman', 'newmantask.js');


let runner: mockrun.TaskMockRunner = new mockrun.TaskMockRunner(taskPath);
let filePath = path.normalize('/srcDir/collection.json');
let environment = path.normalize('/srcDir/environment.json');
let newmanPath = path.normalize('/dir1/dir2/newman');

runner.setInput("collectionSourceType", 'file');
runner.setInput("environmentSourceType", 'none');
runner.setInput("collectionFileSource", filePath);
runner.setInput("Contents", path.normalize("**/collection.json"));
runner.setInput("pathToNewman", newmanPath)

let answers = <mockanswer.TaskLibAnswers>{
    "checkPath": {},
    "which": {},
    "stats": {},
    "exec": {}
};
answers.checkPath[filePath] = true;
answers.checkPath[environment] = true;
answers.checkPath[newmanPath] = true;
answers.checkPath['newman'] = true;
answers.stats[filePath] = true;
answers.which[newmanPath] = newmanPath;
runner.setAnswers(answers);

answers.exec[`${newmanPath} run ${filePath}`] = { 'code': 0, 'stdout': 'OK' }
runner.run();
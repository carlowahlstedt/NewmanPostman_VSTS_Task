"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockrun = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
let taskPath = path.join(__dirname, '..', 'NewmanPostman', 'newmantask.js');
let runner = new mockrun.TaskMockRunner(taskPath);
let filePath = path.normalize('/srcDir/collection.json');
let environment = path.normalize('/srcDir/environment.json');
let folder = '/';
runner.setInput("collectionSourceType", 'file');
runner.setInput("environmentSourceType", 'file');
runner.setInput("collectionFileSource", filePath);
runner.setInput("Contents", path.normalize("**/collection.json"));
runner.setInput("environmentFile", environment);
runner.setInput("folder", folder);
let answers = {
    "checkPath": {},
    "which": {
        'newman': 'newman'
    },
    "stats": {},
    "exec": {}
};
answers.checkPath[filePath] = true;
answers.checkPath[environment] = true;
answers.checkPath['newman'] = true;
answers.stats[filePath] = true;
runner.setAnswers(answers);
answers.exec[`newman run ${filePath} --folder ${folder} -e ${environment}`] = { 'code': 0, 'stdout': 'OK' };
runner.run();

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockrun = require("azure-pipelines-task-lib/mock-run");
const path = require("path");
let taskPath = path.join(__dirname, '..', 'NewmanPostman', 'newmantask.js');
console.info(taskPath);
let runner = new mockrun.TaskMockRunner(taskPath);
let filePath = '';
runner.setInput("collectionSourceType", 'file');
runner.setInput("collectionFileSource", filePath);
runner.setInput("Contents", path.normalize("**/collection.json"));
let answers = {
    "checkPath": {},
    "which": {
        'newman': 'newman'
    },
    "stats": {}
};
answers.checkPath[filePath] = true;
answers.checkPath['newman'] = true;
answers.stats[filePath] = true;
runner.setAnswers(answers);
runner.run();

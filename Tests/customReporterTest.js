"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockrun = require("vsts-task-lib/mock-run");
const path = require("path");
let taskPath = path.join(__dirname, '..', 'NewmanPostman', 'newmantask.js');
let runner = new mockrun.TaskMockRunner(taskPath);
let filePath = path.join(__dirname, '/assets/Core.postman_collection.json');
let environment = path.join(__dirname, 'assets/Core.postman_collection.json');
runner.setInput("collectionSourceType", 'file');
runner.setInput("environmentSourceType", 'file');
runner.setInput("collectionFileSource", filePath);
runner.setInput("Contents", path.normalize("**/collection.json"));
runner.setInput("environmentFile", environment);
runner.setInput("reporters", 'cli,json');
let answers = {
    checkPath: {},
    which: {
        'newman': 'newman'
    },
    stats: {}
};
answers.checkPath[filePath] = true;
answers.checkPath[environment] = true;
answers.checkPath['newman'] = true;
answers.stats[filePath] = true;
runner.setAnswers(answers);
runner.run();
//# sourceMappingURL=customReporterTest.js.map
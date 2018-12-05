"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockrun = require("vsts-task-lib/mock-run");
const path = require("path");
let taskPath = path.join(__dirname, '..', 'NewmanPostman', 'newmantask.js');
let runner = new mockrun.TaskMockRunner(taskPath);
let filePath = path.join(__dirname, '/assets/Core.postman_collection.json');
let environment = path.join(__dirname, 'assets/Core.postman_collection.json');
let globalVariables = __dirname;
runner.setInput("collectionFileSource", filePath);
runner.setInput("Contents", path.normalize("**/collection.json"));
runner.setInput("environment", environment);
runner.setInput("globalVariables", globalVariables);
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
answers.checkPath[globalVariables] = true;
runner.setAnswers(answers);
runner.run();
//# sourceMappingURL=globalVarFileTest.js.map
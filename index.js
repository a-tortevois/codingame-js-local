const { readdirSync, readFileSync, existsSync } = require("node:fs");
const path = require("node:path");

// const {fileURLToPath} = require('node:url');
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// -- Global variables --
const args = process.argv.slice(2);
const defaultConsoleLog = console.log;
const defaultConsoleError = console.error;
const inputTestFiles = [];
const outputTestFiles = [];
let testInputs;
let testOutputs;
const solution = existsSync(path.join(__dirname, "solution.js")) ? readFileSync(path.join(__dirname, "solution.js")).toString() : console.error(`Unable to open the file: solutions.js`);
const exit = {
  success: true,
  find: "",
  expected: "",
};

// -- Functions definition --
const getFilesListFromDir = (dirent) => {
  return readdirSync(path.join(__dirname, dirent), { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);
};

const readline = () => {
  return testInputs.shift();
};

console.log = (...data) => {
  const expected = testOutputs.shift();
  const find = data.join(" ");
  if (exit.success && find !== expected) {
    exit.success = false;
    exit.find = find;
    exit.expected = expected;
  }
  defaultConsoleLog.apply(this, data);
};

console.error = (...data) => {
  if (data.length === 1) {
    data[0] = `\x1b[31m${data}\x1b[0m`;
  } else {
    data.unshift("\x1b[31m");
    data.push("\x1b[0m");
  }
  defaultConsoleError.apply(this, data);
  process.exit(1);
};

// -- Main --
const main = () => {
  if (args[0] === "all") {
    inputTestFiles.push(...getFilesListFromDir("inputs"));
    outputTestFiles.push(...getFilesListFromDir("outputs"));
  } else {
    for (let arg of args) {
      const testFile = `${arg}.txt`;
      if (!existsSync(path.join(__dirname, "inputs", testFile))) {
        console.error(`Unable to open the file: ./inputs/${testFile}`);
      }
      if (!existsSync(path.join(__dirname, "outputs", testFile))) {
        console.error(`Unable to open the file: ./outputs/${testFile}`);
      }
      inputTestFiles.push(testFile);
      outputTestFiles.push(testFile);
    }
  }

  for (const testFile of inputTestFiles) {
    if (outputTestFiles.includes(testFile)) {
      console.warn(`-----------------------------------------------------------------------------------------------------`);
      console.warn(`\x1b[47m\x1b[30mExec test #${testFile.split(".")[0]}\x1b[0m\n`);
      testInputs = readFileSync(path.join(__dirname, "inputs", testFile))
        .toString()
        .split("\n")
        .map((v) => v.trim());
      testOutputs = readFileSync(path.join(__dirname, "outputs", testFile))
        .toString()
        .split("\n")
        .map((v) => v.trim());
      eval(solution);
      if (exit.success) {
        console.warn(`\n\x1b[32mSuccess\x1b[0m`);
      } else {
        console.error(`Échec\nTrouvé: ${exit.find}\nAttendu: ${exit.expected}`);
      }
    }
  }
};

main();

/*
process.on('exit', () => {
    if (exit.success) {
        console.warn(`\nSuccess`);
    } else {
        console.warn(`\nÉchec\nTrouvé: ${exit.find}\nAttendu: ${exit.expected}`);
    }
});
*/

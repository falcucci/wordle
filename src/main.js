"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
// these are the two libraries we need
// import prompt from 'prompt-sync'
var prompts_1 = __importDefault(require("prompts"));
var fs_1 = require("fs");
// these are some codes to get the console to print in colors
// see examples below
var Reset = "\x1b[0m";
var BgRed = "\x1b[41m";
var BgGreen = "\x1b[42m";
var BgYellow = "\x1b[43m";
var BgBlue = "\x1b[44m";
var BgMagenta = "\x1b[45m";
var BgCyan = "\x1b[46m";
var BgWhite = "\x1b[47m";
// QWERT keys
var qwert = 'q w e r t y u i o p a s d f g h j k l z x c v b n m';
var keyboardDict = {};
qwert.split(' ').map(function (letter) {
    return keyboardDict[letter.toUpperCase()] = { color: Reset };
});
var random = function (a, b) {
    if (a === void 0) { a = 1; }
    if (b === void 0) { b = 0; }
    var lower = Math.ceil(Math.min(a, b));
    var upper = Math.floor(Math.max(a, b));
    return Math.floor(lower + Math.random() * (upper - lower + 1));
};
var words = (0, fs_1.readFileSync)('allwords.txt', 'utf-8').split("\n");
var answers = (0, fs_1.readFileSync)('answers.txt', 'utf-8').split("\n");
var answer = answers[random(answers.length)];
var keyboardBuilder = function (keys) {
    // formats the key with the color
    var lettersArray = Object.keys(keys);
    var lettersArrayFulfilled = [];
    lettersArray.map(function (letter) {
        lettersArrayFulfilled.push("".concat(keys[letter].color, " ").concat(letter, " ").concat(Reset));
        return true;
    });
    console.log('|', '-'.repeat(57), '|');
    var firstRow = lettersArrayFulfilled.slice(0, lettersArray.indexOf('A'));
    console.log('|', firstRow.join(' | '), '|');
    var secondRow = lettersArrayFulfilled.slice(lettersArray.indexOf('A'), lettersArray.indexOf('X'));
    console.log('|', '-'.repeat(57), '|');
    console.log('|', secondRow.join(' | '), '|');
    console.log('|', '-'.repeat(57), '|');
    var thirdRow = lettersArrayFulfilled.slice(lettersArray.indexOf('Z'));
    console.log('|        |', thirdRow.join(' | '), '|        |');
    console.log('|', '-'.repeat(57), '|');
};
// const options: any = {
//   QUIT: "q",
//   HARD: "HARD",
//   EASY: "EASY",
//   STAT: "STAT",
//   HELP: "HELP"
// }
// let option: string = ""
// const history: any = []
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var options, option, history, _loop_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                options = {
                    QUIT: "q",
                    HARD: "HARD",
                    EASY: "EASY",
                    STAT: "STAT",
                    HELP: "HELP"
                };
                option = "";
                history = [];
                _loop_1 = function () {
                    var text, wordIsValid, answerLetters, guessLetters, rowDict, rowFulfilled, divider, emptyRow, i, len, wordArray, row, breakLines;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, prompts_1["default"])({
                                    type: 'text',
                                    name: 'value',
                                    message: 'How old are you?'
                                })];
                            case 1:
                                text = _b.sent();
                                console.log(text);
                                // const text: any = input('Your guess? ')
                                // console.clear()
                                if (Object.values(options).includes(text)) {
                                    option = text;
                                }
                                switch (option) {
                                    case options.EASY:
                                        break;
                                    case options.HARD:
                                        break;
                                    case options.STAT:
                                        break;
                                    case options.HELP:
                                        break;
                                    case options.QUIT:
                                        break;
                                    default:
                                        break;
                                }
                                wordIsValid = words.includes(text);
                                answerLetters = answer.split('');
                                guessLetters = text.split('');
                                rowDict = {};
                                guessLetters.map(function (letter, index) {
                                    return rowDict[parseInt(index)] = {
                                        value: letter,
                                        color: BgWhite
                                    };
                                });
                                rowFulfilled = [];
                                Object.values(rowDict).map(function (item, index) {
                                    var value = item.value;
                                    var has = answerLetters.includes(item.value);
                                    var guessedLetter = answerLetters[index];
                                    var samePosition = has && guessedLetter === item.value;
                                    if (has) {
                                        rowDict[index].color = BgYellow;
                                        keyboardDict[value.toUpperCase()].color = BgYellow;
                                    }
                                    else {
                                        keyboardDict[value.toUpperCase()].color = BgWhite;
                                    }
                                    if (samePosition) {
                                        rowDict[index].color = BgGreen;
                                        keyboardDict[value.toUpperCase()].color = BgGreen;
                                    }
                                    rowFulfilled.push("".concat(item.color, " ").concat(item.value, " ").concat(Reset));
                                });
                                history.push(rowFulfilled);
                                divider = " | ---".repeat(5) + ' |';
                                emptyRow = ' |    '.repeat(5) + ' |';
                                console.log(divider);
                                for (i = 0, len = 6; i < len; i++) {
                                    wordArray = history[i];
                                    row = emptyRow;
                                    if (wordArray) {
                                        row = " | ".concat(wordArray.join(' | '), " |");
                                    }
                                    console.log(row);
                                    console.log(divider);
                                }
                                breakLines = "\n\n\n\n";
                                console.log(breakLines);
                                keyboardBuilder(keyboardDict);
                                return [2 /*return*/];
                        }
                    });
                };
                _a.label = 1;
            case 1:
                if (!(option !== options.QUIT)) return [3 /*break*/, 3];
                return [5 /*yield**/, _loop_1()];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}); })();
// this is how we get data from the user
// const yesOrNo = input('Your guess? ')
// if(yesOrNo === "yes") {
//   // this is how you could print in colors
//   console.log('|---|---|---|---|---|---|')
//   console.log(`|${BgYellow} W ${Reset}| O |${BgGreen} R ${Reset}| D |${BgYellow} L ${Reset}| E |`)
//   console.log('|---|---|---|---|---|---|')
//   console.log('\n');
//   console.log('keyboard(keyboardDict): ', keyboard(keyboardDict));
// } else {
//   console.log("not a problem")
// }
//
// // this is how to read data from the files
// const answers:string[] = readFileSync('answers.txt', 'utf-8').split("\n")
// const words: string[] = readFileSync('allwords.txt', 'utf-8').split("\n")
//
// // this is how to read an integer, if needed
// // but be careful about incorrect inputs 
// const n = parseInt(input("enter a number between 0 and 2314:  "))
// console.log(`The word at index ${n} is ${words[n]}`)
// console.log(`The answer word at index ${n} is ${answers[n]}`)
//
// // this is how to clear the console
// input("press enter to clear the console")
// console.clear()
//
// // feel free to delete all the starter you don't need after you understand how to use it.  
// // after this the program quits

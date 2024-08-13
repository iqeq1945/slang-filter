"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var slang_json_1 = require("./slang.json");
var initialState = {
    list: [],
    exclude: [],
    splitRegex: /\s/,
    placeHolder: "*",
    regex: /[^a-zA-Z0-9|$|@]|^/g,
    replaceRegex: /\w/g,
    emptyList: false,
};
var Filter = /** @class */ (function () {
    /**
     * Filter constructor.
     * @constructor
     * @param {object} options - Filter instance options
     * @param {boolean} options.emptyList - Instantiate filter with no blacklist
     * @param {array} options.list - Instantiate filter with custom list
     * @param {string} options.placeHolder - Character used to replace profane words.
     * @param {string} options.regex - Regular expression used to sanitize words before comparing them to blacklist.
     * @param {string} options.replaceRegex - Regular expression used to replace profane words with placeHolder.
     * @param {string} options.splitRegex - Regular expression used to split a string into words.
     */
    function Filter(options) {
        if (options === void 0) { options = initialState; }
        this.options = {
            list: options.emptyList ? [] : __spreadArray(__spreadArray([], slang_json_1.Slang, true), (options.list || []), true),
            exclude: options.exclude || [],
            splitRegex: options.splitRegex || /\s/,
            placeHolder: options.placeHolder || "*",
            regex: options.regex || /[^a-zA-Z0-9|$|@]|^/g,
            replaceRegex: options.replaceRegex || /\w/g,
            emptyList: options.emptyList,
        };
    }
    /**
     * Determine if a string contains slang words.
     * 비속어 인지 확인 해주는 함수
     * @param {keyword} string - String to evaluate for slang.
     */
    Filter.prototype.isInSlang = function (keyword) {
        var _a = this.options, exclude = _a.exclude, list = _a.list;
        return list.some(function (word) {
            var wordExp = new RegExp(word.trim(), "g");
            return !exclude.includes(word) && wordExp.test(keyword);
        });
    };
    /**
     * Replace a word with placeHolder characters;
     * 정해둔 placeholder 값으로 수정하여 출력
     * @param {keyword} string - String to replace.
     */
    Filter.prototype.replaceWord = function (keyword) {
        var _a = this.options, regex = _a.regex, replaceRegex = _a.replaceRegex, placeHolder = _a.placeHolder;
        return keyword
            .replace(regex, placeHolder)
            .replace(replaceRegex, placeHolder);
    };
    /**
     * Evaluate a string for slang and return an edited version.
     * 비속어를 가지고 있는지 확인하고, 비속어가 있을시 수정하여 반환해줌.
     * @param {sentence} string - Sentence to filter.
     */
    Filter.prototype.clean = function (sentence) {
        var _this = this;
        var splitRegex = this.options.splitRegex;
        return sentence
            .split(splitRegex)
            .map(function (word) { return (_this.isInSlang(word) ? _this.replaceWord(word) : word); })
            .join(" ");
    };
    /**
     * Add word(s) to blacklist filter / remove words from whitelist filter
     * 비속어 추가 및 화이트리스트에 있던 경우, 삭제
     * @param {string[]} word - Word(s) to add to blacklist
     */
    Filter.prototype.addWords = function () {
        var words = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            words[_i] = arguments[_i];
        }
        var _a = this.options, list = _a.list, exclude = _a.exclude;
        list.push.apply(list, words);
        words.forEach(function (word) {
            var index = exclude.indexOf(word);
            if (index !== -1) {
                exclude.splice(index, 1);
            }
        });
    };
    /**
     * Add words to whitelist filter
     * 화이트 리스트에 추가
     * @param {...slang} word - slang(s) to add to whitelist.
     */
    Filter.prototype.removeWords = function () {
        var slang = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            slang[_i] = arguments[_i];
        }
        var exclude = this.options.exclude;
        exclude.push.apply(exclude, slang.map(function (word) { return word.toLowerCase(); }));
    };
    return Filter;
}());
exports.default = Filter;

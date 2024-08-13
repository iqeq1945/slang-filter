"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var slang_1 = require("./slang");
var filter = new slang_1.default();
console.log(filter.clean("병신"));
console.log(filter.clean("병신들아"));
console.log(filter.clean("gigigi"));

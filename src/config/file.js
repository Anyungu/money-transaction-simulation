"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parentDir = exports.__dirname = exports.__filename = void 0;
var url_1 = require("url");
var path_1 = require("path");
exports.__filename = (0, url_1.fileURLToPath)(import.meta.url);
exports.__dirname = (0, path_1.dirname)(exports.__filename);
exports.parentDir = (0, path_1.join)(exports.__dirname, '../../');

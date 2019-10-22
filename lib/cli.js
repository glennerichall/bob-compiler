"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = exports.compileOne = exports.compileGroup = exports.getGroups = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _compiler = require("./compiler.js");

var _group = require("./group.js");

var _fs = require("fs");

var _recursiveReaddir = _interopRequireDefault(require("recursive-readdir"));

var _path = _interopRequireDefault(require("path"));

var access = _fs.promises.access,
    lstat = _fs.promises.lstat,
    F_OK = _fs.promises.F_OK;

var getGroups =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(source, options) {
    var pattern, files, names, groups;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            options = options || {};
            pattern = new RegExp(options.pattern);
            _context.next = 4;
            return (0, _recursiveReaddir["default"])(source);

          case 4:
            files = _context.sent;
            files = files.filter(function (file) {
              return pattern.test(_path["default"].basename(file));
            });

            if (!options.groupby) {
              _context.next = 11;
              break;
            }

            names = options.groupby;
            if (!Array.isArray(names)) names = [names];
            groups = files.reduce(function (result, current) {
              var match = pattern.exec(_path["default"].basename(current));

              if (match) {
                var key = names.reduce(function (result, key) {
                  result += match.groups[key];
                  return result;
                }, '');

                if (!result[key]) {
                  result[key] = [];
                }

                result[key].push(current);
              }

              return result;
            }, {});
            return _context.abrupt("return", Object.keys(groups).map(function (key) {
              return groups[key];
            }));

          case 11:
            return _context.abrupt("return", [files]);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getGroups(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // ---------------------------------------------------------------------------


exports.getGroups = getGroups;

var compileGroup =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(source, commentaires, options) {
    var groups, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, files, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, file, group;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return getGroups(source, options);

          case 2:
            groups = _context2.sent;
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 6;
            _iterator = groups[Symbol.iterator]();

          case 8:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 38;
              break;
            }

            files = _step.value;
            console.log("Compilation du groupe de fichiers : ");
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context2.prev = 14;

            for (_iterator2 = files[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              file = _step2.value;
              console.log(file.replace(_path["default"].join(source, '\\'), '\t'));
            }

            _context2.next = 22;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](14);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t0;

          case 22:
            _context2.prev = 22;
            _context2.prev = 23;

            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }

          case 25:
            _context2.prev = 25;

            if (!_didIteratorError2) {
              _context2.next = 28;
              break;
            }

            throw _iteratorError2;

          case 28:
            return _context2.finish(25);

          case 29:
            return _context2.finish(22);

          case 30:
            group = new _group.CompilationGroup(files, commentaires);
            _context2.next = 33;
            return group.load();

          case 33:
            _context2.next = 35;
            return group.execute();

          case 35:
            _iteratorNormalCompletion = true;
            _context2.next = 8;
            break;

          case 38:
            _context2.next = 44;
            break;

          case 40:
            _context2.prev = 40;
            _context2.t1 = _context2["catch"](6);
            _didIteratorError = true;
            _iteratorError = _context2.t1;

          case 44:
            _context2.prev = 44;
            _context2.prev = 45;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 47:
            _context2.prev = 47;

            if (!_didIteratorError) {
              _context2.next = 50;
              break;
            }

            throw _iteratorError;

          case 50:
            return _context2.finish(47);

          case 51:
            return _context2.finish(44);

          case 52:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[6, 40, 44, 52], [14, 18, 22, 30], [23,, 25, 29], [45,, 47, 51]]);
  }));

  return function compileGroup(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}(); // ---------------------------------------------------------------------------


exports.compileGroup = compileGroup;

var compileOne =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(source, commentaires) {
    var compiler;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            compiler = new _compiler.Compiler(source);
            _context3.next = 3;
            return compiler.load();

          case 3:
            _context3.next = 5;
            return compiler.execute();

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function compileOne(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}(); // ---------------------------------------------------------------------------


exports.compileOne = compileOne;

var compile =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(source, commentaires, options) {
    var start, stats;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return access(source, F_OK);

          case 3:
            _context4.next = 8;
            break;

          case 5:
            _context4.prev = 5;
            _context4.t0 = _context4["catch"](0);
            console.error("Le chemin source ".concat(source, " n'existe pas"));

          case 8:
            _context4.prev = 8;
            _context4.next = 11;
            return access(commentaires, F_OK);

          case 11:
            _context4.next = 16;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t1 = _context4["catch"](8);
            console.error("Le chemin commentaires ".concat(commentaires, " n'existe pas"));

          case 16:
            start = new Date();
            _context4.prev = 17;
            _context4.next = 20;
            return lstat(source);

          case 20:
            stats = _context4.sent;

            if (stats.isDirectory()) {
              compileGroup(source, commentaires, options);
            } else {
              compileOne(source, commentaires);
            }

            _context4.next = 28;
            break;

          case 24:
            _context4.prev = 24;
            _context4.t2 = _context4["catch"](17);
            console.error(_context4.t2.message);
            return _context4.abrupt("return");

          case 28:
            console.log("Compilation termin\xE9e en ".concat(new Date() - start, " milliseconde(s)"));

          case 29:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 5], [8, 13], [17, 24]]);
  }));

  return function compile(_x8, _x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();

exports.compile = compile;
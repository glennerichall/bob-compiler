"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lstCmd = exports.cpmCmd = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _cli = require("./cli.js");

// ---------------------------------------------------------------------------
var cpmCmd = ['compile <source> <commentaires> [groupby] [pattern]', 'Compiler les points des commentaires annotés dans les fichiers.', function (y) {
  return y.positional('source', {
    type: 'string',
    describe: 'Chemin de fichier ou de répertoire contenant le groupe de fichiers à compiler.'
  }).positional('commentaires', {
    type: 'string',
    describe: 'Chemin de fichier contenant la liste des commentaires et leur pondération.'
  }).option('groupby', {
    type: 'string',
    "default": process.env.bobcgroupby,
    describe: "Grouper les fichiers selon les greoupes nommés dans l'expression régulière déterminé par l'option [pattern]"
  }).option('pattern', {
    type: 'string',
    "default": process.env.bobcpattern || '.*',
    describe: 'Filtrer les fichier selon une expression régulière'
  }).implies('groupby', 'pattern');
},
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(args) {
    var source, commentaires;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            source = args.source, commentaires = args.commentaires;
            _context.next = 3;
            return (0, _cli.compile)(source, commentaires, args);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()]; // ---------------------------------------------------------------------------

exports.cpmCmd = cpmCmd;
var lstCmd = ['list <commentaires>', 'Afficher la liste des commentaires contenu dans le fichier', function (y) {
  return y.positional('commentaires', {
    type: 'string',
    describe: 'Chemin de fichier contenant la liste des commentaires et leur pondération.'
  });
}, function (args) {
  var commentaires = args.commentaires;
}];
exports.lstCmd = lstCmd;
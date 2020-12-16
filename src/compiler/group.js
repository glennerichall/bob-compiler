const {Compiler} = require('./compiler.js');
const {asDatabase} = require('./comments.js');
const memoized = require('../utils/memoized');

class SubCompiler extends Compiler {
    constructor(file, database, getSum) {
        super(file, database);
        this.superGetSum = this.getSum;
        this.getSum = getSum;
    }
}

class CompilationGroup {
    constructor(files, database) {
        this.files = files;
        this.database = asDatabase(database);
        this.compilers = files.map(
            file => new SubCompiler(file, this.database, this.getSum)
        );
        this.sum = undefined;
    }

    getSum = memoized(() => {
        return this.compilers
            .map(compiler => compiler.superGetSum())
            .reduce((a, b) => a + b, 0);
    });

    async load() {
        let promises = this.compilers.map(compiler => compiler.load());
        await Promise.all(promises);
    }

    async execute() {
        let promises = this.compilers.map(compiler => compiler.execute());
        await Promise.all(promises);
        return Math.max(this.database.total + this.getSum(), 0);
    }

    dryrun() {
        this.compilers.forEach((compiler) => {
            compiler.document.saveAs = () => true;
        });
    }
}

module.exports = {
    CompilationGroup,
}
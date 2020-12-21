const logger = require('../src/logger');
const {levels} = logger;

before(async()=>{
    if (process.env.trace === 'on') {
        logger.level = levels.trace;
    }
});
const logger = require('../src/logger');

before(async()=>{
   logger.level = logger.levels.trace;
});
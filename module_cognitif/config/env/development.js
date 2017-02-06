"use strict";

/**
 * Development environment settings
 * @description :: This section overrides all other config values ONLY in development environment
 */

module.exports = {
  port: 3001,
  log: {
    level: 'verbose'
  },
  logger : {
    _hookTimeout: 60000
  },
  request : {
    _hookTimeout: 60000
  },
  // models: {
  //   connection: 'disk'
  // },
    models: {
    connection: 'mongo'
  },
  lang : ['en', 'fr']
};

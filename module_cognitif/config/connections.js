"use strict";

/**
 * Connections API Configuration
 *
 * Connections are like "saved settings" for your adapters.
 * Each model must have a `connection` property (a string) which is references the name of one
 * of these connections.  If it doesn't, the default `connection` configured in `config/models.js`
 * will be applied.  Of course, a connection can (and usually is) shared by multiple models.
 *
 * NOTE: If you're using version control, you should put your passwords/api keys
 * in `config/local.js`, environment variables, or use another strategy.
 */

module.exports = {
  connections: {
    /**
     * MongoDB configuration
     * @type {Object}
     */

    mongo: {
      adapter: 'sails-mongo',
      host: 'ds139187.mlab.com',
      port: 39187,
      user: 'watson',
      password: 'watson',
      database: 'watson-credit-conso'
    },

    // mLab
    // mongo: {
    //   adapter: 'sails-mongo',
    //   host: 'ds019633.mlab.com',
    //   port: 19633,
    //   user: 'watson',
    //   password: 'watson',
    //   database: 'watson'
    // },
      // mLab2

    // mongo: {
    //   adapter: 'sails-mongo',
    //   host: 'ds019633.mlab.com',
    //   port: 19633,
    //   user: 'watson',
    //   password: 'watson',
    //   database: 'watson'
    // },
    // Scaleway
   /* mongo: {
      adapter: 'sails-mongo',
      host: '163.172.128.141',
      port: 443,
      user: 'watson',
      password: 'watson',
      database: 'watson-test'
    },*/
    // Scaleway
    // mongo: {
    //   adapter: 'sails-mongo',
    //   host: '163.172.128.141',
    //   port: 27017,
    //   user: 'watson',
    //   password: 'watson123',
    //   database: 'watson'
    // },

    /**
     * Redis configuration
     * @type {Object}
     */
    redis: {
      adapter: 'sails-redis',
      port: 6379,
      host: 'localhost',
      password: '',
      database: 'sails-rest-api',
      options: {
        parser: 'hiredis',
        return_buffers: false,
        detect_buffers: false,
        socket_nodelay: true,
        no_ready_check: false,
        enable_offline_queue: true
      }
    },

    /**
     * PostgreSQL configuration
     * @type {Object}
     */
    postgresql: {
      adapter: 'sails-postgresql',
      database: 'sails-rest-api',
      host: 'localhost',
      user: '',
      password: '',
      port: 5432,
      pool: false,
      ssl: false
    },

    /**
     * MySQL configuration
     * @type {Object}
     */
    mysql: {
      adapter: 'sails-mysql',
      host: 'watsonmysql.c9bz5v5kndfs.us-west-2.rds.amazonaws.com',
      port: 3306,
      user: 'watson_mysql',
      password: 'sopra123',
      database: 'watson',
      charset: 'utf8',
      collation: 'utf8_swedish_ci'
    },

    /**
     * Microsoft SQL Server configuration
     * @type {Object}
     */
    sqlserver: {
      adapter: 'sails-sqlserver',
      user: '',
      password: '',
      host: 'localhost',
      database: 'sails-rest-api',
      options: {
        encrypt: false
      }
    },

    /**
     * OrientDB configuration
     * @type {Object}
     */
    orientdb: {
      adapter: 'sails-orientdb',
      host: 'localhost',
      port: 2424,
      user: '',
      password: '',
      database: 'sails-rest-api',
      options: {
        databaseType: 'graph',
        storage: 'plocal',
        transport: 'binary',
        decodeURIComponent: true,
        removeCircularReferences: false,
        unsafeDrop: false,
        parameterized: true,
        fetchPlanLevel: 1
      }
    },

    /**
     * DynamoDB configuration
     * @type {Object}
     */
    dynamodb: {
      adapter: 'sails-dynamodb',
      accessKeyId: '',
      secretAccessKey: '',
      region: 'us-west-1'
    },

    /**
     * FileMaker configuration
     * @type {Object}
     */
    filemaker: {
      adapter: 'sails-filemaker',
      host: 'localhost',
      database: 'sails-rest-api',
      userName: '',
      password: ''
    },

    /**
     * Memory configuration
     * ONLY FOR DEVELOPMENT
     * @type {Object}
     */
    memory: {
      adapter: 'sails-memory'
    },

    /**
     * Disk configuration
     * ONLY FOR DEVELOPMENT
     * @type {Object}
     */
    disk: {
      adapter: 'sails-disk'
    }
  }
};

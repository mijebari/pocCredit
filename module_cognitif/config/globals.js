"use strict";

/**
 * Global Variable Configuration
 * Configure which global variables which will be exposed automatically by Sails.
 */

module.exports = {
  globals: {
    /**
     * Expose the lodash installed in Sails core as a global variable
     * @type {Boolean}
     */
    _: true,

    /**
     * Expose the async installed in Sails core as a global variable
     * @type {Boolean}
     */
    async: true,

    /**
     * Expose the sails instance representing your app
     * @type {Boolean}
     */
    sails: true,

    /**
     * Expose each of your app's services as global variables
     * @type {Boolean}
     */
    services: true,

    /**
     * Expose each of your app's models as global variables
     * @type {Boolean}
     */
    models: true
  }
};

const updatePageHeaders = require('./update_page-headers');

module.exports = function(migration, context) {
  updatePageHeaders(migration, context);
};

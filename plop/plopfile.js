const componentGenerator = require('./generators/component');
const datetimeHelper = require('./helpers/datetime');

module.exports = function (plop) {
   // helpers
   datetimeHelper(plop);
   
   // components
   componentGenerator(plop);
};

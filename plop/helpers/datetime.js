module.exports = function (plop) {
  plop.setHelper('datetime', function () {
    const date = new Date();
    return [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ].map(digit => String(digit).padStart(2, '0')).join('');
  });
};
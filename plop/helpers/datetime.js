module.exports = function (plop) {
  plop.setHelper('datetime', function () {
    const d = new Date();
    return [
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
    ].map(digit => String(digit).padStart(2, '0')).join('');
  });
};
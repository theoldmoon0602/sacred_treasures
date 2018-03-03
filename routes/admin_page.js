var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin_page', function(req, res, next) {
  res.render('admin_page');
});
router.get('/flag', function(req, res, next) {
  res.send('flag{this-is-very-easy-flag-so-you-got-only-1000-points}');
});

module.exports = router;

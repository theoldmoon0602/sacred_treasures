var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var index = require('./routes/index');
var admin_page = require('./routes/admin_page');

var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

const db_validate = function(db) {
  return {
    good: db.good.length,
    bad: db.bad.length,
    page: db.page,
  };
};
const button_pressed = function(db, button) {
  db[button].push({page: db.page});
  return db;
}
const get_comment = function(db, comment) {
  db.comments.push({page: db.page, comment: comment});
  return db;
}
const next_page = function(db) {
  db.page++;
  return db;
}
const prev_page = function(db) {
  db.page--;
  return db;
}
const reset = function() {
  return {
    page: 0,
    good: [],
    bad: [],
    comments: [],
    flag: 'flag{wow-you-sure-are-a-ctf-player-!-send-this-flag-as-comment-and-get-1000000-points-!}',
  };
}
const store_db = function(file, db) {
  fs.writeFileSync(file, JSON.stringify(db, '', '  '));
}
const load_db = function(file) {
  try {
    let data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  }
  catch (err) {
    return reset();
  }
}

let db = load_db('./db.json');
io.on('connection', function(socket) {
  socket.emit('update', db_validate(db));
  
  socket.on('good', function() {
    store_db('./db.json', db);
    db = button_pressed(db, 'good');
    io.sockets.emit('update', db_validate(db));
  });
  socket.on('bad', function() {
    store_db('./db.json', db);
    db = button_pressed(db, 'bad');
    io.sockets.emit('update', db_validate(db));
  });
  socket.on('comment', function(data) {
    store_db('./db.json', db);
    db = get_comment(db, data.comment);
    io.sockets.emit('admin-update', db);
  });
  socket.on('next-page', function() {
    db = next_page(db);
    io.sockets.emit('update', db_validate(db));
  });
  socket.on('prev-page', function() {
    db = prev_page(db);
    io.sockets.emit('update', db_validate(db));
  });
  socket.on('admin-request', function() {
    socket.emit('admin-update', db);
  });
  socket.on('reset', function() {
    db = reset();
    io.sockets.emit('update', db_validate(db));
    io.sockets.emit('admin-update', db);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(index);
app.use(admin_page);
app.use('/css', express.static(path.join(__dirname, './node_modules/bulma/css/')));
app.use('/socketio', express.static(path.join(__dirname, './node_modules/socket.io-client/dist/')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {
  app: app,
  server: server,
};

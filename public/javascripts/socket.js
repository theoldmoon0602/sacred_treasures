// (function() {
  // flag{in-fact-this-is-a-ctf-!-send-this-flag-with-your-handle-as-comment-and-got-first-100-points}
  var good_button = document.querySelector('#good');
  var good_nums = document.querySelector('#good_nums');
  var bad_button = document.querySelector('#bad');
  var bad_nums = document.querySelector('#bad_nums');
  var send_button = document.querySelector('#send_button');
  var comment = document.querySelector('#comment');
  
  var socket = io();
  socket.on('update', function(data) {
    good_nums.innerText = data.good;
    bad_nums.innerText = data.bad;
  });
  
  good_button.addEventListener('click', function() {
    socket.emit('good');
  });
  bad_button.addEventListener('click', function() {
    socket.emit('bad');
  });
  send_button.addEventListener('click', function() {
    if (comment.value.length == 0) { return; }
    socket.emit('comment', {
      comment: comment.value,
    });
    comment.value = "";
  });
// });

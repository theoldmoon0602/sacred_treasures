// (function() {
  var good_nums = document.querySelector('#good_nums');
  var bad_nums = document.querySelector('#bad_nums');
  var page = document.querySelector('#page');
  var comment_table = document.querySelector('#comment_table');
  var next_page = document.querySelector('#next_page');
  var prev_page = document.querySelector('#prev_page');

  var socket = io();
  socket.emit('admin-request');
  socket.on('update', function(data) {
    console.log(data);
    good_nums.innerText = data.good;
    bad_nums.innerText = data.bad;
    page.innerText = data.page;
  });

  socket.on('admin-update', function(data) {
    let comments = data.comments;
    comments.sort(function(a,b) {
      let keyA = a.page;
      let keyB = b.page;
      if (keyA < keyB) { return -1; }
      if (keyA > keyB) { return 1; }
      return 0;
    });

    let new_tbody = document.createElement('tbody');
    let row = new_tbody.insertRow(-1);  // add to last
    row.insertCell(-1).outerHTML = "<th>Page</th>";
    row.insertCell(-1).outerHTML = "<th>Comment</th>";

    for (let i = 0; i < comments.length; i++) {
      let row = new_tbody.insertRow(-1);  // add to last
      let page_cell = row.insertCell(-1);
      let page_text = document.createTextNode(comments[i].page);
      page_cell.appendChild(page_text);
      let comment_cell = row.insertCell(-1);
      let comment_text = document.createTextNode(comments[i].comment);
      comment_cell.appendChild(comment_text);
    }

    while (comment_table.firstChild) {
      comment_table.removeChild(comment_table.firstChild);
    }
    comment_table.appendChild(new_tbody);
  });

  next_page.addEventListener('click', function() {
    socket.emit('next-page');
  });
  prev_page.addEventListener('click', function() {
    socket.emit('prev-page');
  });
// });

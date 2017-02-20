var users = {}
var server = http.createServer(app)
var io = require('socket.io').listen(server)

io.sockets.on('connection', function (socket) {
  socket.on('online', function (data) {
    socket.name = data.user
    if (!users[data.user]) {
      users[data.user] = data.user
    }
    io.sockets.emit('online', {users: users, user: data.user})
  })
  socket.on('say', function (data) {
    chatApi.insertChat(data, function (cont) {
      if (cont) {
        if (data.to === 'all') {
          socket.broadcast.emit('say', data)
        } else {
          var clients = io.sockets.clients()
          clients.forEach(function (client) {
            if (client.name === data.to) {
              client.emit('say', data)
            }
          })
        }
        chatApi.upDataChatList(data, function (conts) {
        })
      }
    })
  })
  socket.on('focus', function (data) {
    var clients = io.sockets.clients()
    clients.forEach(function (client) {
      if (client.name === data.to) {
        client.emit('focus', data)
      }
    })
  })
  socket.on('blur', function (data) {
    var clients = io.sockets.clients()
    clients.forEach(function (client) {
      if (client.name === data.to) {
        client.emit('blur', data)
      }
    })
  })
  socket.on('see', function (data) {
    chatApi.updateChat(data, function (conts) {
      console.log('conts--->', conts)
      var clients = io.sockets.clients()
      clients.forEach(function (client) {
        if (client.name === data.to) {
          client.emit('see', data)
        }
      })
    })
  })
  socket.on('disconnect', function () {
    if (users[socket.name]) {
      delete users[socket.name]
      socket.broadcast.emit('offline', {users: users, user: socket.name})
    }
  })
})


var TimeByClinic = function ($scope, $http) {
    var socket = window.io.connect()
    var from = window.$.cookie('user')
    $scope.chatLists = []
    $scope.timeStamp = new Date().getTime()
    function getTime (date) {
      for (var i = 0; i < date.length; i++) {
        date[i].year = new Date(parseInt(date[i].chatList_time)).getFullYear()
        date[i].month = new Date(parseInt(date[i].chatList_time)).getMonth() + 1
        date[i].data = new Date(parseInt(date[i].chatList_time)).getDate()
        if ($scope.timeStamp - date[i].chatList_time <= 86400000) {
          if (new Date(parseInt(date[i].chatList_time)).getMinutes() < 10) {
            date[i].time = new Date(parseInt(date[i].chatList_time)).getHours() + ':0' + new Date(parseInt(date[i].chatList_time)).getMinutes()
          } else {
            date[i].time = new Date(parseInt(date[i].chatList_time)).getHours() + ':' + new Date(parseInt(date[i].chatList_time)).getMinutes()
          }
        } else {
          date[i].time = date[i].data + '|' + date[i].month + '|' + date[i].year
        }
      }
      console.log(date)
    }
    function chatList () {
      $http({
        url: '/getChatListData',
        method: 'POST',
        data: {
          'username': window.utils.getQuery('username')
        }
      }).success(function (data) {
        $scope.chatLists = data
        getTime(data)
      })
    }
    function updateChatList (o) {
      $http({
        url: '/updateChatList',
        method: 'POST',
        data: {
          'username': window.utils.getQuery('username'),
          'chatname': o.chatList_chatname
        }
      }).success(function (data) {
        console.log(data)
      })
    }
    chatList()
    $scope.chatListClick = function (o) {
      updateChatList(o)
      var str = '/chat?' + 'username=' + o.chatList_username + '&chatName=' + o.chatList_chatname
      window.location = str
    }
    socket.emit('online', {user: from})
    socket.on('online', function (data) {
      console.log(data)
    })
    socket.on('say', function (data) {
      console.log(data)
      chatList()
      $scope.$apply()
    })
  }
  window.hyyApp.controller('chat', ['$scope', '$http', TimeByClinic])
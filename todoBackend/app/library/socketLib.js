
const mongoose = require('mongoose')
const shortId = require('shortid')
const event = require('events').EventEmitter
const myEvent = new event
const io = require('socket.io')
const tokenLib = require('../library/tokenLib')
require('../model/socketModel')
const chatMsg = mongoose.model('chatModel')

let allOnlineUsers = [];

let socketSet = (server) => {
    socket = io.listen(server)
    let myIo = socket.of('')

    myIo.on('connection', (socket) => {


        console.log('Client is connected to socket...')

        socket.emit('verifyUser', '');

        socket.on('setUser', (authToken) => {
            console.log(authToken)
            tokenLib.verifyClaimWithoutSecret(authToken, (err, data) => {
                if (err) {
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
                } else {
                    console.log('User veryfied in socketLib')
                    console.log(data)
                    let currentUser = data.data;
                    // setting socket user id 
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} is online`);
                    let userObj = { userId: currentUser.userId, fullName: fullName }
                    allOnlineUsers.push(userObj)
                    console.log(allOnlineUsers)
                    socket.fullName = fullName
                    //creating room
                    socket.room = 'edChat';
                    socket.join('edChat')
                    //notify users about who is come online
                    socket.broadcast.to('edChat').emit('come', socket.fullName)
                    //socket.broadcast.to('edChat').emit('all-onlineUsersList', allOnlineUsers)
                    myIo.in('edChat').emit('all-onlineUsersList', allOnlineUsers);
                    //sending users allOnline Users list
                    // socket.to('edChat').broadcast.emit('all-onlineUsersList', allOnlineUsers)
                    //creating another room for group chat
                    socket.room = 'groupChat'
                    socket.join('groupChat')


                }
            })

        })

        socket.on('chat-msg', (data) => {
            console.log(data)
            console.log('Sending private message')
            //saving user message into database
            data['chatId'] = shortId.generate()
            setTimeout(() => {
                myEvent.emit('saveChat', data)
            }, 2000)
            //sending private message to another socket through perticular Id
            myIo.emit(data.receiverId, data)

        })

        socket.on('group-chat', (data) => {
            console.log(data)
            console.log('Sending group message')
            data['chatId'] = shortId.generate()
            setTimeout(() => {
                myEvent.emit('saveGroupChat', data)
            }, 2000)
            //sending group message to all the clients in the groupChat including sender also
            myIo.in('groupChat').emit('message', data);

        })

        socket.on('typing', (userInfo) => {
            console.log('Showing typing message')
            myIo.emit(userInfo.receiverName, userInfo)
        })

        socket.on('click', (todo) => {
            console.log('pressed click button by unknown ')
            socket.broadcast.to('edChat').emit('notify', todo)
        })

        //saving messages
        myEvent.on('saveChat', (data) => {

            let newMsg = new chatMsg({
                chatId: data.chatId,
                senderId: data.senderId,
                senderName: data.senderName,
                receiverId: data.receiverId,
                receiverName: data.receiverName,
                message: data.message,
                createdOn: Date.now(),
                chatRoom: data.chatRoom || ''
            })

            newMsg.save((err, result) => {
                if (err) {
                    console.log(`some error occured: ${err}`)
                } else if (result == undefined || result == null || result == '') {
                    console.log(`Chat is not saved`)
                } else {
                    console.log(`Chat is saved in the data base successfully`)
                    console.log(result)
                }
            })
        })

        myEvent.on('saveGroupChat', (data)=>{
            let groupMsg= new chatMsg({
                chatId:data.chatId,
                senderId: data.senderId,
                senderName: data.senderName,
                receiverId: data.receiverId,
                receiverName: data.receiverName,
                message:data.groupMessage,
                createdOn:Date.now(),
                chatRoom:socket.room||'',
            })

            groupMsg.save((err, result)=>{
                if(err){
                    console.log(err)
                }else if(result == undefined || result == null || result == ''){
                    console.log(`chat is not saved`)
                }else{
                    console.log(`Chat is saved in the data base successfully`)
                    console.log(result)
                }
            })
        })




        socket.on('disconnect', (data) => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId + " is now offline");
            socket.to('edChat').broadcast.emit('leave', socket.fullName)
            var removeIndex = allOnlineUsers.map(function (user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex, 1)
            myIo.in('edChat').emit('all-onlineUsersList', allOnlineUsers);
            //socket.to('edChat').broadcast.emit('all-onlineUsersList', allOnlineUsers)
            socket.leave('edChat')
            socket.leave('groupChat')

            console.log(allOnlineUsers)
            console.log(socket.fullName)

        })

    })
}


module.exports = {
    socketSet: socketSet
}
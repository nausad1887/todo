const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6InpWbUlpMkFBIiwiaWF0IjoxNTc2NTIxOTMzNDI3LCJleHAiOjE1NzY2MDgzMzMsInN1YiI6ImF1dGhUb2tlbiIsImlzcyI6InRvZG9BcHAiLCJkYXRhIjp7InVzZXJJZCI6IkwxM1REcWQtIiwiZmlyc3ROYW1lIjoiQW5zYXJpIiwibGFzdE5hbWUiOiJhbGV4IiwibW9iaWxlTnVtYmVyIjo4Nzk3NzY3MDc2LCJlbWFpbCI6Im5hdXNhZDE4ODZAZ21haWwuY29tIn19.K3JbBydoWcDbW3zVIqzWtQUrrLDP9yLZY2JEkim4ceM"
const secretKey ="mySecretKeyThatNoOneKnowsInHisWildDream"
const userId = 'L13TDqd-'
const socket = io('http://localhost:8081')

let clientJs = () => {

    let userInfo = {
        senderId: userId,
        senderName: 'Ansari alex',
        receiverName: 'Nausad',
        receiverId: '3ulavQsv',
    }

    let chatMessage = {
        senderId: userId,
        senderName: 'Ansari alex',
        receiverName: 'Nausad',
        receiverId: '3ulavQsv',
        createdOn: Date.now()
    }


    socket.on('verifyUser', (data) => {

        console.log('Server wants to verify the user')

        //sending authtoken to setUser event
        socket.emit('setUser', (authToken))
    })

    socket.on(userId, (data) => {
        //console.log(data)
        console.log("You have received a message from  " + data.senderName)
        console.log(data.message)
    })

    socket.on(userInfo.senderName, (userInfo) => {
        //console.log(userInfo)
        console.log(userInfo.senderName + '  is typing...')
    })

    socket.on('auth-error', (data) => {
        console.log(data)
    })

    socket.on('all-onlineUsersList', (list) => {
        console.log('users list updated')
        console.log(list)
    })

    socket.on('come', (fullname) => {
        console.log(fullname + '  came online')
    })

    socket.on('leave', (fullname) => {
        console.log(fullname + '  go offline')
    })

    socket.on('message', (data) => {
        console.log(data.senderName + '  says: ' + data.groupMessage)
    })

    socket.on('notify', (data) => {
        console.log(data + "  is clicked a button on his side")
    })

    $("#send1").on('click', function () {

        let messageText = $("#messageToSend").val()
        chatMessage.message = messageText;
        socket.emit("chat-msg", chatMessage)

    })

    $("#send2").on('click', function () {

        let groupMessageText = $("#groupChat").val()
        chatMessage.groupMessage = groupMessageText;
        socket.emit("group-chat", chatMessage)

    })

    $("#messageToSend").keypress(function () {

        socket.emit("typing", userInfo)

    })
}

//calling clientJs function
clientJs();
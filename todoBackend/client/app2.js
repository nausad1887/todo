const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ik9DSXd0S0YtIiwiaWF0IjoxNTc2NTIxODk4NDU1LCJleHAiOjE1NzY2MDgyOTgsInN1YiI6ImF1dGhUb2tlbiIsImlzcyI6InRvZG9BcHAiLCJkYXRhIjp7InVzZXJJZCI6IjN1bGF2UXN2IiwiZmlyc3ROYW1lIjoiTmF1c2FkIiwibGFzdE5hbWUiOiIiLCJtb2JpbGVOdW1iZXIiOjg3OTc3NjcwNzYsImVtYWlsIjoibmF1c2FkMTg4N0BnbWFpbC5jbyJ9fQ.jorb1gCgm_7I4lypFb9HJtDhpvRiQpjvlrcgtEf8q2k"
const secretKey = "mySecretKeyThatNoOneKnowsInHisWildDream"
const userId = '3ulavQsv'
const socket = io('http://localhost:8081')

let clientJs = () => {

    let chatMessage = {
        senderId: userId,
        senderName: 'Nausad',
        receiverName: 'Ansari alex',
        receiverId: 'L13TDqd-',
        createdOn: Date.now()
    }

    let userInfo = {
        senderId: userId,
        senderName: 'Nausad',
        receiverName: 'Ansari alex',
        receiverId: 'L13TDqd-',
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

    $("#send1").on('click', function () {

        let messageText = $("#messageToSend").val()
        chatMessage.message = messageText;
        socket.emit("chat-msg", chatMessage)

    })

    socket.on('notify', (data) => {
        console.log(data + "  is clicked a button on his side")
    })

    $("#send2").on('click', function () {

        let groupMessageText = $("#groupChat").val()
        chatMessage.groupMessage = groupMessageText;
        socket.emit("group-chat", chatMessage)

    })

    $("#messageToSend").keypress(function () {

        socket.emit("typing", userInfo)

    })

    $("#send0").click(function () {

        socket.emit("click", chatMessage.senderName)

    })
}

//calling clientJs function
clientJs();
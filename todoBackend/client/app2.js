const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IlhzRjJ5YnRuUCIsImlhdCI6MTYwMjAxMTI1NDMzMiwiZXhwIjoxNjAyMDk3NjU0LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJ0b2RvQXBwIiwiZGF0YSI6eyJ1c2VySWQiOiJsYWs0aDZZaTciLCJmaXJzdE5hbWUiOiJzaGFtaW0iLCJsYXN0TmFtZSI6IkFobWVkIiwibW9iaWxlTnVtYmVyIjo4MDc0OTk5OTIzLCJhcGlLZXkiOiIxMjM0NTYiLCJlbWFpbCI6InNoYW1pbUBnbWFpbC5jb20ifX0.6TV3Tf9Si_25EAyMlEO0JaTDt5CnSL5hOijn0EwXulg"
const secretKey = "mySecretKeyThatNoOneKnowsInHisWildDream"
const userId = 'lak4h6Yi7'
const socket = io('http://localhost:8081')

let clientJs = () => {

    let chatMessage = {
        senderId: userId,
        senderName: 'shamim',
        receiverName: 'shamim1',
        receiverId: '1iArcc0B0',
        createdOn: Date.now()
    }

    let userInfo = {
        senderId: userId,
        senderName: 'shamim',
        receiverName: 'shamim1',
        receiverId: '1iArcc0B0',
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
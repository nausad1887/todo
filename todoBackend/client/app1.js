const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6InIyWm9pVVRJLSIsImlhdCI6MTYwMjAxMTQxNTQ0MSwiZXhwIjoxNjAyMDk3ODE1LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJ0b2RvQXBwIiwiZGF0YSI6eyJ1c2VySWQiOiIxaUFyY2MwQjAiLCJmaXJzdE5hbWUiOiJzaGFtaW0xIiwibGFzdE5hbWUiOiJBaG1lZCIsIm1vYmlsZU51bWJlciI6ODA3NDk5OTkyMywiYXBpS2V5IjoiMTIzNDU2IiwiZW1haWwiOiJzaGFtaW0xQGdtYWlsLmNvbSJ9fQ.1adpC6CmyOfrD4BnQYFEFd0rfM24M5mh374o_m2R4EQ"
const secretKey ="mySecretKeyThatNoOneKnowsInHisWildDream"
const userId = '1iArcc0B0'
const socket = io('http://localhost:8081')

let clientJs = () => {

    let userInfo = {
        senderId: userId,
        senderName: 'shamim1',
        receiverName: 'shamim',
        receiverId: 'lak4h6Yi7',
    }

    let chatMessage = {
        senderId: userId,
        senderName: 'shamim1',
        receiverName: 'shamim',
        receiverId: 'lak4h6Yi7',
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
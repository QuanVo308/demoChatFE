

export class WebSocketService {
    messageMaxQuantity
    roomQuantity
    ws
    setQuantity
    setListMessage
    closeSocket
    userToken
    handleLogout


    init(host, _setRoom, _setQuantity, _setListMessage, _handleLogout) {
        this.setQuantity = _setQuantity
        this.setListMessage = _setListMessage
        this.handleLogout = _handleLogout
        this.closeSocket = false
        this.messageMaxQuantity = 10

        this.ws = new WebSocket(host);
        this.currentRoom = null

        const thisClass = this


        this.ws.addEventListener("open", function (event) {
            // websocketService.ws.send('Hello Server!');
            // console.log("connect", event);
            thisClass.handleLogin(thisClass.userToken)
        });
        this.ws.addEventListener("close", function (event) {
            // this.ws.send('Hello Server!');
            if (!thisClass.closeSocket) {
                thisClass.reConnect(host, _setRoom, _setQuantity, _setListMessage, thisClass.userToken)
            }
            // console.log("close", event);
        });

        this.ws.addEventListener("error", function (event) {
            // this.ws.send('Hello Server!');
            // console.log("error", event);
        });

        this.ws.addEventListener("message", function (event) {
            // websocketService.ws.send('Hello Server!');
            // console.log("message", event.data);
            thisClass.handleEventMessage(event)
        });
    }
    setUserToken = (_userToken) => {
        this.userToken = _userToken || null
        this.handleLogin(_userToken)
    }

    reConnect = (host, _setRoom, _setQuantity, _setListMessage, _userToken) => {
        console.log('reconnect')
        this.init(host, _setRoom, _setQuantity, _setListMessage, _userToken)
    }

    handleEventMessage = (event) => {
        const data = JSON.parse(event.data)

        try {
            switch (data.type) {
                // case 'response_join_room':
                //     console.log("response_join_room")
                //     this.joinRoomResponse(event)
                //     break;
                // case 'response_leave_room':
                //     console.log("response_leave_room")
                //     this.leaveRoomResponse(event)
                //     break;
                // case "room_quantity_update":
                //     console.log("room_quantity_update")
                //     this.updateRoomQuantity(event)
                //     break;
                // case "response_message_room":
                //     this.errorMessageRoom(event)
                //     break;
                case "message_room":
                    this.newMessageRoom(event)
                    break;

                case "authen_error":
                    this.handleLogout()
                    break;
                // case "authenticated_error":
                //     this.newMessageRoom(event)
                //     break;
                default:
                    // console.log('Not valid action type', data)
                    break;
            }
        } catch (e) {
            console.log('Event handler error', e)
        }

    }


    // errorMessageRoom = (event) => {
    //     try {
    //         const data = JSON.parse(event.data)
    //         console.log(data)

    //     } catch (e) {
    //         console.log('error room update', e)
    //     }
    // }

    newMessageRoom = (event) => {
        try {
            const data = JSON.parse(event.data)

            this.setListMessage((current) => [...current, data])
            this.setQuantity(data.quantity)
        } catch (e) {
            console.log('error message room update', e)
        }
    }

    handleLogin = async (userToken) => {
        try {
            if (userToken !== null && userToken !== undefined) {
                const data = await JSON.stringify({
                    type: 'login',
                    token: userToken
                })
                this.ws.send(data)
            }
        } catch (e) {
            console.log('Login error')
        }
    }

    sendMessageRoom = (data) => {
        try {
            this.ws.send(JSON.stringify(data))
        } catch (e) {
            // console.log('Send message room', e)
        }
    }

    closeConnection = () => {
        this.closeSocket = true
        this.ws.close()
    }

    // updateRoomQuantity = (event) => {
    //     try {
    //         const data = JSON.parse(event.data)
    //         this.setQuantity(data.quantity)

    //     } catch (e) {
    //         console.log('Update room quantity', e)
    //     }
    // }

    // leaveRoom = (roomCode) => {
    //     this.ws.send(JSON.stringify({
    //         type: "leave_room",
    //         room: `${roomCode}`
    //     }))
    // }

    // leaveRoomResponse = (event) => {
    //     try {
    //         const data = JSON.parse(event.data)
    //         if (data.status === 'success') {
    //             this.setRoom(null)
    //         }

    //     } catch (e) {
    //         console.log('Leave room response', e)
    //     }

    // }

    // joinRoomResponse = (event) => {
    //     try {
    //         const data = JSON.parse(event.data)
    //         if (data.status === 'success') {
    //             this.setRoom(data.room)
    //         }

    //     } catch (e) {
    //         console.log('Join room response', e)
    //     }

    // }

    // joinRoom = (roomCode) => {
    //     this.ws.send(JSON.stringify({
    //         type: "join_room",
    //         room: `${roomCode}`
    //     }))
    // }



}


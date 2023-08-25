

export class WebSocketService {
    messageMaxQuantity
    roomQuantity
    ws
    setQuantity
    setListMessage
    closeSocket
    userToken
    handleLogout
    setLogin


    init(host, _setQuantity, _setListMessage, _setLogin) {
        this.setQuantity = _setQuantity
        this.setListMessage = _setListMessage
        this.closeSocket = false
        this.messageMaxQuantity = 10
        this.setLogin = _setLogin
        this.ws = host;
        this.currentRoom = null

        const thisClass = this


        this.ws.addEventListener("open", function (event) {
            // websocketService.ws.send('Hello Server!');
            console.log("connect", event);
            thisClass.handleLogin(thisClass.userToken)
        });
        this.ws.addEventListener("close", function (event) {
            // this.ws.send('Hello Server!');
            if (!thisClass.closeSocket) {
                thisClass.reConnect(host, _setQuantity, _setListMessage, thisClass.userToken)
            }
            // console.log("close", event);
        });

        this.ws.addEventListener("error", function (event) {
            // this.ws.send('Hello Server!');
            // console.log("error", event);
        });

        this.ws.addEventListener("message", function (event) {
            // websocketService.ws.send('Hello Server!');
            console.log("message", event.data);
            thisClass.handleEventMessage(event)
        });


    }
    setUserToken = (_userToken) => {
        this.userToken = _userToken || null
        this.handleLogin(_userToken)
    }

    reConnect = (host, _setQuantity, _setListMessage, _userToken) => {
        console.log('reconnect')
        this.init(host, _setQuantity, _setListMessage, _userToken)
    }

    handleEventMessage = (event) => {
        const data = JSON.parse(event.data)
        try {
            switch (data.type) {
                case "message_room":
                    this.newMessageRoom(event)
                    break;

                case "login_success":
                    this.setLogin(true)
                    break;

                case "login_error":
                    this.handleLogout()
                    break;
                default:
                    break;
            }
        } catch (e) {
            console.log('Event handler error', e)
        }

    }

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

    sendMessageRoom = (data, ws) => {
        try {
            ws.send(JSON.stringify(data))
        } catch (e) {
            console.log('Send message room', e)
        }
    }

    closeConnection = () => {
        console.log('close')
        this.closeSocket = true
        this.ws.close()
    }


}


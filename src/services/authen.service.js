import axios from 'axios';

export class AuthenticationService {

    googleLogin = async (accessToken) => {
        let result
        await axios.post(`${process.env.REACT_APP_AUTHEN_API_HOST}/authentication/google-authentication`, { token: accessToken }, {
            withCredentials: true
        }).then((response) => {
            // console.log('response', response)
            result = response
        }).catch((err) => {
            // console.log('err', err)
            result = err.response
        });
        return result
    }

    logout = async () => {
        let result
        await axios.post(`${process.env.REACT_APP_AUTHEN_API_HOST}/authentication/log-out`, {}, {
            withCredentials: true
        }).then((response) => {
            result = response
        }).catch((err) => {
            result = err.response
        });
        return result
    }

    getUser = async () => {
        let result
        await axios.get(`${process.env.REACT_APP_AUTHEN_API_HOST}/user/get-user`, {
            withCredentials: true
        }).then((response) => {
            console.log('get user success', response.data)
            result = response
        }).catch((err) => {
            console.log('err', err)
            result = err.response
        });
        console.log(result)
        return result
    }
}


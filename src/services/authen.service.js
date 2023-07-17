import axios from 'axios';

export class AuthenticationService {

    login = async (accessToken) => {
        console.log(accessToken)
        const response = await axios.post('http://localhost:8000/authentication/google-authentication', { token: accessToken }, {
            withCredentials: true, headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data
    }
}


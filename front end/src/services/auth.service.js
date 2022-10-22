import { APP_CONFIG } from '../config/api-config';

export const authService = {
    login,
    logout
};

function login(username, password) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: username })
        };
        return fetch(APP_CONFIG.API_ROOT + '/login', requestOptions)
            .then(handleResponse)
            .then(user => {
                // store user details in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

import client from './client'

export const signup = (data) =>
    client.post('/api/auth/signup', data)

export const login = (data) =>
    client.post('/api/auth/login', data)

export const getMe = () =>
    client.get('/api/auth/me')

export const refresh = (token) =>
    client.post('/api/auth/refresh', {
        refresh_token: token
    })

import client from './client'

export const signup = (data) => client.post('/auth/signup', data)
export const login  = (data) => client.post('/auth/login', data)
export const getMe  = ()     => client.get('/auth/me')
export const refresh = (token) => client.post('/auth/refresh', { refresh_token: token })

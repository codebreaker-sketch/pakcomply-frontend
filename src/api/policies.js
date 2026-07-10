import client from './client'

export const listPolicies   = ()         => client.get('/policies')
export const getPolicy      = (id)       => client.get(`/policies/${id}`)
export const getPolicyText  = (id)       => client.get(`/policies/${id}/text`)
export const reprocessPolicy= (id)       => client.post(`/policies/${id}/process`)
export const deletePolicy   = (id)       => client.delete(`/policies/${id}`)
export const updatePolicy   = (id, data) => client.patch(`/policies/${id}`, data)

export const uploadPolicy = (formData, onProgress) =>
  client.post('/policies/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => onProgress?.(Math.round((e.loaded * 100) / e.total)),
  })

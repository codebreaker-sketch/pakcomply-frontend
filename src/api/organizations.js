import client from './client'

export const getMyOrg       = ()         => client.get('/organizations/me')
export const updateMyOrg    = (data)     => client.patch('/organizations/me', data)
export const listMembers    = ()         => client.get('/organizations/me/members')
export const updateMemberRole = (userId, role) =>
  client.patch(`/organizations/me/members/${userId}/role`, { role })

export const getAuditLogs   = (limit = 100) => client.get(`/audit-logs?limit=${limit}`)

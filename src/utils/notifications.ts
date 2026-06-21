import type { Notification, User, UserRole } from '../types'
import { ROLE_CONFIG } from '../config/roles'

export function getActiveUserForRole(users: User[], role: UserRole): User | undefined {
  return users.find((user) => user.role === role && user.active)
}

export function getRoleAccountSummaries(users: User[]) {
  return ROLE_CONFIG.map((config) => {
    const account = getActiveUserForRole(users, config.role)
    return { ...config, account }
  })
}

export function getNotificationsForUser(
  notifications: Notification[],
  user: User | null,
): Notification[] {
  if (!user) return []

  return notifications.filter((notification) => {
    if (notification.targetRole && notification.targetRole !== user.role) {
      return false
    }

    if (
      notification.targetUserEmail &&
      notification.targetUserEmail.toLowerCase() !== user.email.toLowerCase()
    ) {
      return false
    }

    return true
  })
}

export function getUnreadNotificationCount(
  notifications: Notification[],
  user: User | null,
): number {
  return getNotificationsForUser(notifications, user).filter((notification) => !notification.read)
    .length
}

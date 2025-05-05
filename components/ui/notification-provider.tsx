"use client"

import * as React from "react"
import { createContext, useContext, useState } from "react"
import { Notification, NotificationTitle, NotificationDescription } from "./notification"

type NotificationType = "default" | "success" | "info" | "warning" | "error"

interface NotificationOptions {
  title?: string
  description?: string
  duration?: number
  variant?: NotificationType
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"
}

interface NotificationItem extends NotificationOptions {
  id: string
}

interface NotificationContextType {
  notifications: NotificationItem[]
  showNotification: (options: NotificationOptions) => void
  dismissNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const showNotification = (options: NotificationOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    const notification: NotificationItem = {
      id,
      duration: 5000,
      position: "bottom-right",
      ...options,
    }

    setNotifications((prev) => [...prev, notification])

    if (notification.duration !== Infinity) {
      setTimeout(() => {
        dismissNotification(id)
      }, notification.duration)
    }

    return id
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const positionClasses = {
    "top-right": "fixed top-4 right-4 flex flex-col gap-2 w-full max-w-sm z-50",
    "top-left": "fixed top-4 left-4 flex flex-col gap-2 w-full max-w-sm z-50",
    "bottom-right": "fixed bottom-4 right-4 flex flex-col gap-2 w-full max-w-sm z-50",
    "bottom-left": "fixed bottom-4 left-4 flex flex-col gap-2 w-full max-w-sm z-50",
    "top-center": "fixed top-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 w-full max-w-sm z-50",
    "bottom-center": "fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 w-full max-w-sm z-50",
  }

  // Group notifications by position
  const notificationsByPosition = notifications.reduce<Record<string, NotificationItem[]>>(
    (acc, notification) => {
      const position = notification.position || "top-right"
      if (!acc[position]) {
        acc[position] = []
      }
      acc[position].push(notification)
      return acc
    },
    {}
  )

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, dismissNotification }}>
      {children}
      {Object.entries(notificationsByPosition).map(([position, items]) => (
        <div key={position} className={positionClasses[position as keyof typeof positionClasses]}>
          {items.map((notification) => (
            <Notification
              key={notification.id}
              variant={notification.variant}
              onClose={() => dismissNotification(notification.id)}
              className="w-full"
            >
              <div>
                {notification.title && <NotificationTitle>{notification.title}</NotificationTitle>}
                {notification.description && (
                  <NotificationDescription>{notification.description}</NotificationDescription>
                )}
              </div>
            </Notification>
          ))}
        </div>
      ))}
    </NotificationContext.Provider>
  )
} 
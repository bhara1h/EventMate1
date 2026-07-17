import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { useNotification } from '../../context/NotificationContext'

export default function NotificationsCenter() {
  const { notifications, markAsRead, clearNotifications } = useNotification()

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gradient">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400">Stay updated with all your event notifications</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={clearNotifications}>
                Clear All
              </Button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No notifications yet. Check back soon.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <Card
                  key={notif.id}
                  className={`transition ${notif.read ? '' : 'border-2 border-purple-500'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{notif.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{notif.message}</p>
                      <p className="text-xs text-gray-500">{new Date(notif.createdAt || notif.time || Date.now()).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {!notif.read && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-xs font-semibold">
                          New
                        </span>
                      )}
                      {!notif.read && (
                        <Button size="sm" onClick={() => markAsRead(notif.id)}>
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

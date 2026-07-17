import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Download, QrCode, Check } from 'lucide-react'
import { useGetMyRegistrations } from '../../hooks/useApi'

export default function RegisteredEvents() {
  const { data, isLoading, isError } = useGetMyRegistrations()
  const registrations = data?.data?.registrations || []

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-6xl mx-auto text-center text-red-600 dark:text-red-400">
            Failed to load registered events.
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">My Registered Events</h1>
            <p className="text-gray-600 dark:text-gray-400">View and manage your event registrations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {registrations.length > 0 ? (
              registrations.map((registration) => (
                <Card key={registration._id} className="space-y-4">
                  <div className="space-y-2 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold">{registration.event.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>📅 {new Date(registration.event.date).toLocaleDateString()}</p>
                      <p>📍 {registration.event.location}</p>
                      <p>🎫 {registration.ticketId}</p>
                    </div>
                  </div>

                  <div className="flex justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {registration.qrCode ? (
                      <img src={registration.qrCode} alt="QR Code" className="w-40 h-40" />
                    ) : (
                      <div className="w-40 h-40 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                        Ticket not available yet
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                    <Button className="flex-1">
                      <QrCode className="w-4 h-4" />
                      View Ticket
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">Registration Confirmed</span>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
                You have no registrations yet.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

import { useParams } from 'react-router-dom'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Check, X, QrCode } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useGetEventParticipants, useGetEventById } from '../../hooks/useApi'

export default function AttendanceTracker() {
  const { eventId } = useParams()
  const [showQRScanner, setShowQRScanner] = useState(false)
  const { data: eventData } = useGetEventById(eventId)
  const { data, isLoading } = useGetEventParticipants(eventId)
  const [participants, setParticipants] = useState([])

  useEffect(() => {
    const loaded = data?.data?.participants || []
    setParticipants(
      loaded.map((participant) => ({
        ...participant,
        id: participant._id || participant.id,
        attended: participant.attended || false,
      }))
    )
  }, [data])

  const handleToggleAttendance = (id) => {
    setParticipants((prev) =>
      prev.map((participant) =>
        participant.id === id
          ? { ...participant, attended: !participant.attended }
          : participant
      )
    )
  }

  const event = eventData?.data?.event

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col gap-4 md:flex-row items-start md:items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gradient">Attendance Tracking</h1>
              <p className="text-gray-600 dark:text-gray-400">Mark and manage event attendance</p>
              {event && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tracking attendance for <strong>{event.title}</strong>
                </p>
              )}
            </div>
            <Button onClick={() => setShowQRScanner(!showQRScanner)}>
              <QrCode className="w-4 h-4" />
              {showQRScanner ? 'Close Scanner' : 'Scan QR'}
            </Button>
          </div>

          {showQRScanner && (
            <Card className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">QR Scanner coming soon</p>
            </Card>
          )}

          <Card className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Participants ({participants.length})</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Attended: {participants.filter((p) => p.attended).length} / {participants.length}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 font-semibold">Name</th>
                    <th className="text-left py-3 font-semibold">Email</th>
                    <th className="text-left py-3 font-semibold">Registered</th>
                    <th className="text-center py-3 font-semibold">Status</th>
                    <th className="text-center py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-600 dark:text-gray-400">
                        Loading participants...
                      </td>
                    </tr>
                  ) : participants.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-600 dark:text-gray-400">
                        No participants have registered for this event yet.
                      </td>
                    </tr>
                  ) : (
                    participants.map((participant) => (
                      <tr key={participant.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 font-medium">{participant.user?.name || participant.name}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{participant.user?.email || participant.email}</td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">{new Date(participant.createdAt || participant.registered).toLocaleDateString()}</td>
                        <td className="py-3 text-center">
                          {participant.attended ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs font-semibold">
                              <Check className="w-3 h-3" />
                              Attended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-semibold">
                              <X className="w-3 h-3" />
                              No-show
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => handleToggleAttendance(participant.id)}
                            className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-semibold"
                          >
                            {participant.attended ? 'Mark Absent' : 'Mark Present'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

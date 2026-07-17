import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { Download, Share2 } from 'lucide-react'
import { useGetCertificates } from '../../hooks/useApi'

export default function Certificates() {
  const { data, isLoading } = useGetCertificates()
  const certificates = data?.data?.certificates || []

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />

      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">My Certificates</h1>
            <p className="text-gray-600 dark:text-gray-400">View and download certificates earned from events</p>
          </div>

          {isLoading ? (
            <Card className="p-8 text-center">Loading certificates...</Card>
          ) : certificates.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-lg font-semibold">No certificates yet.</p>
              <p className="text-gray-600 dark:text-gray-400">Complete events to receive certificates here.</p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <Card key={cert._id} className="space-y-4">
                  <h3 className="font-bold text-lg">{cert.event?.title || 'Event Certificate'}</h3>
                  <img
                    src={cert.certificateUrl || 'https://via.placeholder.com/800x600?text=Certificate'}
                    alt={cert.event?.title || 'Certificate'}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Completed on {new Date(cert.issuedAt || cert.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-3">
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-300"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-600 text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </a>
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

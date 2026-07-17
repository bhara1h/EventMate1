import Card from './Card'
import { ArrowRight } from 'lucide-react'

export default function EventCard({ event, onClick, onRegister }) {
  return (
    <Card className="overflow-hidden hover:shadow-glow cursor-pointer transition hover:-translate-y-2" onClick={onClick}>
      {/* Event Image */}
      <div className="relative h-40 bg-gradient-to-r from-purple-500 to-blue-500 overflow-hidden">
        {event.poster && (
          <img
            src={event.poster}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-110 transition duration-300"
          />
        )}
        {event.status === 'approved' && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-green-500/90 text-white text-xs font-semibold rounded-full">
            Live
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
          {event.category}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 py-3 border-y border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>📍</span>
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>📅</span>
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>👥</span>
            <span>{event.registrations || 0} registered</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-500">By {event.organizer?.name || 'EventMate'}</p>
          </div>
          {onRegister && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRegister(event._id)
              }}
              className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700"
            >
              Register <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}

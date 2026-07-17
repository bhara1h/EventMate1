import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useCreateEvent } from '../../hooks/useApi'
import { uploadAPI } from '../../services/api'
import { Image } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateEvent() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technology',
    date: '',
    time: '',
    location: '',
    capacity: '',
    fee: '',
    poster: null,
  })

  const createEventMutation = useCreateEvent()

  const categories = [
    'Technology', 'Entertainment', 'Sports', 'Academic', 'Cultural',
    'Workshop', 'Seminar', 'Competition', 'Social', 'Other'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      let posterUrl = ''

      if (formData.poster) {
        const fileData = new FormData()
        fileData.append('image', formData.poster)
        const uploadResponse = await uploadAPI.uploadImage(fileData)
        posterUrl = uploadResponse.data.url
      }

      await createEventMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        capacity: Number(formData.capacity),
        fee: Number(formData.fee),
        poster: posterUrl || undefined,
      })

      toast.success('Event created successfully! Pending admin approval.')
      navigate('/organizer/manage-events')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">Create New Event</h1>
            <p className="text-gray-600 dark:text-gray-400">Fill in the details to create your event</p>
          </div>

          <Card className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Event Details</h3>
                
                <Input
                  label="Event Title"
                  placeholder="e.g., Tech Summit 2024"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe your event in detail..."
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                    rows="4"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Poster/Banner Image
                    </label>
                    <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-purple-300 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/10 transition">
                      <Image className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-semibold">Upload Image</span>
                      <input
                        type="file"
                        name="poster"
                        accept="image/*"
                        onChange={(e) => setFormData(prev => ({ ...prev, poster: e.target.files[0] }))}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">Schedule & Location</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Time"
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label="Location"
                  placeholder="e.g., Main Auditorium, College Campus"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">Capacity & Pricing</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Capacity"
                    type="number"
                    placeholder="e.g., 500"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Entry Fee (₹)"
                    type="number"
                    placeholder="e.g., 199"
                    name="fee"
                    value={formData.fee}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  <strong>Note:</strong> Your event will be submitted for admin verification. It will be visible to students only after approval.
                </p>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="submit"
                  isLoading={createEventMutation.isLoading}
                  className="flex-1"
                >
                  Submit for Approval
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/organizer/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

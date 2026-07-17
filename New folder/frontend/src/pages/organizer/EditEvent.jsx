import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { useGetEventById, useUpdateEvent } from '../../hooks/useApi'
import { uploadAPI } from '../../services/api'

export default function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetEventById(id)
  const updateMutation = useUpdateEvent(id)
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

  useEffect(() => {
    if (data?.data?.event) {
      const event = data.data.event
      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'Technology',
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        time: event.time || '',
        location: event.location || '',
        capacity: event.capacity || '',
        fee: event.fee || '',
        poster: null,
      })
    }
  }, [data])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      let posterUrl = undefined
      if (formData.poster) {
        const form = new FormData()
        form.append('image', formData.poster)
        const uploadResponse = await uploadAPI.uploadImage(form)
        posterUrl = uploadResponse.data.url
      }

      await updateMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        capacity: Number(formData.capacity),
        fee: Number(formData.fee),
        poster: posterUrl,
      })

      toast.success('Event updated successfully')
      navigate('/organizer/manage-events')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event')
    }
  }

  if (isLoading) return <LoadingSpinner />

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
        <Header />
        <main className="flex-1 px-4 py-8">
          <div className="max-w-4xl mx-auto text-center text-red-600 dark:text-red-400">
            Failed to load event details.
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
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gradient">Edit Event</h1>
            <p className="text-gray-600 dark:text-gray-400">Update your event details</p>
          </div>

          <Card className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Event Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
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
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                    >
                      {['Technology', 'Entertainment', 'Sports', 'Academic', 'Cultural', 'Workshop', 'Seminar', 'Competition', 'Social', 'Other'].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Poster/Banner Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData((prev) => ({ ...prev, poster: e.target.files[0] }))}
                      className="w-full text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

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
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Fee (₹)"
                  name="fee"
                  type="number"
                  value={formData.fee}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button type="submit" isLoading={updateMutation.isLoading} className="flex-1">Save Changes</Button>
                <Button type="button" variant="secondary" onClick={() => navigate('/organizer/manage-events')} className="flex-1">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

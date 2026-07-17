import cloudinary from '../config/cloudinary.js'

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    const fileBase64 = req.file.buffer.toString('base64')
    const dataUri = `data:${req.file.mimetype};base64,${fileBase64}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'eventmate',
      resource_type: 'image',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    })

    res.status(201).json({ success: true, url: result.secure_url })
  } catch (error) {
    next(error)
  }
}

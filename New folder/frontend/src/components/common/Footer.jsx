import { Link } from 'react-router-dom'
import { Heart, Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-gradient mb-4">EventMate</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Smart college event planner & discovery platform for everyone.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Features</Link></li>
              <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Pricing</Link></li>
              <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Security</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">About</Link></li>
              <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Blog</Link></li>
              <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">Contact</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <p className="flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500" /> by EventMate Team
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/" className="hover:text-purple-600">Privacy Policy</Link>
              <Link to="/" className="hover:text-purple-600">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

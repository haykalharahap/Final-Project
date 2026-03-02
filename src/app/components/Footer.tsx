import { Link } from 'react-router';
import { Twitter, Instagram, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-10 sm:pt-12 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold text-orange-500 mb-3 sm:mb-4">Singgah Kita</h3>
            <p className="text-gray-400 text-sm sm:text-base">Delicious food delivered to your doorstep. Fresh, fast, and fantastic.</p>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition text-sm sm:text-base">Home</Link></li>
              <li><Link to="/menu" className="text-gray-400 hover:text-white transition text-sm sm:text-base">Menu</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-white transition text-sm sm:text-base">Cart</Link></li>
              <li><Link to="/profile" className="text-gray-400 hover:text-white transition text-sm sm:text-base">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li>JL Jamin Ginting</li>
              <li>Medan, Indonesia</li>
              <li>+62 812 3456 7890</li>
              <li>hello@singgahkita.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition p-2 bg-gray-700 rounded-lg hover:bg-gray-600"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition p-2 bg-gray-700 rounded-lg hover:bg-gray-600"><Instagram className="w-5 h-5" /></a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition p-2 bg-gray-700 rounded-lg hover:bg-gray-600"><MessageCircle className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Singgah Kita. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

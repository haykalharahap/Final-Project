import { Twitter, Instagram, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-orange-500 mb-4">Singgah Kita</h3>
            <p className="text-gray-400">Delicious food delivered to your doorstep. Fresh, fast, and fantastic.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition">Home</a></li>
              <li><a href="/menu" className="text-gray-400 hover:text-white transition">Menu</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white transition">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>JL Jamin Ginting</li>
              <li>Medan, Indonesia</li>
              <li>+62 812 3456 7890</li>
              <li>hello@foodchews.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition"><Twitter className="w-6 h-6" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition"><Instagram className="w-6 h-6" /></a>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition"><MessageCircle className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Singgah Kita. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

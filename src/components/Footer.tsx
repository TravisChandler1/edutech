import Link from 'next/link';
// import NewsletterForm from './NewsletterForm';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-yoruba-navy text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-exo font-bold mb-4 footer-text text-yoruba-gold">Ẹwà Èdè Yorùbá</h3>
          <p className="text-sm font-noto footer-text opacity-90">
            Preserving Yoruba language and culture through education and community.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-exo font-bold mb-4 footer-text text-yoruba-gold">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="footer-link hover:text-yoruba-orange transition-colors duration-300">About Us</Link></li>
            <li><Link href="/classes" className="footer-link hover:text-yoruba-orange transition-colors duration-300">Classes</Link></li>
            <li><Link href="/book-club" className="footer-link hover:text-yoruba-orange transition-colors duration-300">Book Club</Link></li>
            <li><Link href="/pricing" className="footer-link hover:text-yoruba-orange transition-colors duration-300">Pricing</Link></li>
            <li><Link href="/contact" className="footer-link hover:text-yoruba-orange transition-colors duration-300">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-exo font-bold mb-4 footer-text text-yoruba-gold">Stay Connected</h3>
          <p className="text-sm font-noto footer-text opacity-90 mb-4">
            Follow us on social media for updates and cultural insights.
          </p>
          <div className="flex space-x-4">
            <a 
              href="https://facebook.com" 
              aria-label="Facebook" 
              className="text-white hover:text-yoruba-gold transition-colors duration-300 transform hover:scale-110"
            >
              <FaFacebook size={24} />
            </a>
            <a 
              href="https://twitter.com" 
              aria-label="Twitter" 
              className="text-white hover:text-yoruba-gold transition-colors duration-300 transform hover:scale-110"
            >
              <FaTwitter size={24} />
            </a>
            <a 
              href="https://instagram.com" 
              aria-label="Instagram" 
              className="text-white hover:text-yoruba-gold transition-colors duration-300 transform hover:scale-110"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-yoruba-gold/30 text-center">
        <p className="text-sm footer-text opacity-80">
          © 2025 Ẹwà Èdè Yorùbá Academy. All rights reserved.
        </p>
        <p className="text-xs footer-text opacity-60 mt-2">
          Empowering communities through language preservation
        </p>
      </div>
    </footer>
  );
}
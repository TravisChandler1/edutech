import Link from 'next/link';
// import NewsletterForm from './NewsletterForm';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-yoruba-navy text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-poppins font-bold mb-4">Ẹwà Èdè Yorùbá</h3>
          <p className="text-sm font-noto">
            Preserving Yoruba language and culture through education and community.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-poppins font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-yoruba-gold transition-colors">About Us</Link></li>
            <li><Link href="/classes" className="hover:text-yoruba-gold transition-colors">Classes</Link></li>
            <li><Link href="/book-club" className="hover:text-yoruba-gold transition-colors">Book Club</Link></li>
            <li><Link href="/pricing" className="hover:text-yoruba-gold transition-colors">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-poppins font-bold mb-4">Stay Connected</h3>
          {/* <NewsletterForm /> */}
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-yoruba-gold"><FaFacebook size={24} /></a>
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-yoruba-gold"><FaTwitter size={24} /></a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-yoruba-gold"><FaInstagram size={24} /></a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-sm">
        <p>© 2025 Ẹwà Èdè Yorùbá Academy. All rights reserved.</p>
      </div>
    </footer>
  );
} 
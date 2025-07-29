import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, Heart, User, LogOut } from 'lucide-react';
import Cart from './Cart';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { userProfile, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold">E-Ticaret</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">Ana Sayfa</Link>
            <Link to="/hakkimizda" className="text-gray-700 hover:text-indigo-600">Hakkımızda</Link>
            <Link to="/urunler" className="text-gray-700 hover:text-indigo-600">Ürünler</Link>
            {isAuthenticated && (
              <Link to="/favorilerim" className="text-gray-700 hover:text-indigo-600 flex items-center">
                <Heart className="h-5 w-5 mr-1" />
                Favorilerim
              </Link>
            )}
            <Link to="/iletisim" className="text-gray-700 hover:text-indigo-600">İletişim</Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600"
                >
                  <User className="h-6 w-6" />
                  <span className="hidden md:block">{userProfile?.username}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/hesabim"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Hesabım
                    </Link>
                    {userProfile?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 inline mr-2" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/kayit" className="text-gray-700 hover:text-indigo-600">
                <User className="h-6 w-6" />
              </Link>
            )}
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-700 hover:text-indigo-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {/* Cart item count will be implemented later */}
            </button>
            
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link to="/" className="block py-2 text-gray-700 hover:text-indigo-600">Ana Sayfa</Link>
            <Link to="/hakkimizda" className="block py-2 text-gray-700 hover:text-indigo-600">Hakkımızda</Link>
            <Link to="/urunler" className="block py-2 text-gray-700 hover:text-indigo-600">Ürünler</Link>
            {isAuthenticated && (
              <Link to="/favorilerim" className="block py-2 text-gray-700 hover:text-indigo-600">Favorilerim</Link>
            )}
            <Link to="/iletisim" className="block py-2 text-gray-700 hover:text-indigo-600">İletişim</Link>
          </div>
        )}
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;
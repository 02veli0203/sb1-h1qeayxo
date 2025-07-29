import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Package, 
  Heart, 
  CreditCard, 
  LogOut, 
  Settings, 
  Bell, 
  ShoppingCart, 
  Trash2,
  Eye,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  Gift
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });
  const { userProfile: authUserProfile, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/giris');
      return;
    }

    // Load favorites
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);

    // Load orders
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);

    // Load user profile
    if (authUserProfile) {
      setUserProfile({
        fullName: authUserProfile.username || '',
        email: authUserProfile.email || '',
        phone: '',
        address: '',
        city: '',
        zipCode: ''
      });
    }
  }, [isAuthenticated, authUserProfile, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const removeFromFavorites = (productId) => {
    const updatedFavorites = favorites.filter(item => item.id !== productId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      const newItem = { ...product, quantity: 1 };
      localStorage.setItem('cart', JSON.stringify([...cart, newItem]));
    }

    alert('Ürün sepete eklendi!');
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert('Profil bilgileri güncellendi!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sipariş Alındı':
        return 'bg-blue-100 text-blue-800';
      case 'Ödeme Alındı':
        return 'bg-green-100 text-green-800';
      case 'Kargoya Verildi':
        return 'bg-purple-100 text-purple-800';
      case 'Teslim Edildi':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Hesabım
              </h1>
              <p className="text-gray-600 mt-2">Hoş geldiniz, {authUserProfile?.username}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-xl">
                <User className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-xl">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-gray-900">{authUserProfile?.username}</h2>
                  <p className="text-gray-600">{authUserProfile?.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    activeTab === 'profile' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Profil Bilgileri</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    activeTab === 'orders' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="h-5 w-5" />
                  <span>Siparişlerim</span>
                  {orders.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                      {orders.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    activeTab === 'favorites' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                  <span>Favorilerim</span>
                  {favorites.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                      {favorites.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    activeTab === 'payments' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Ödeme Yöntemlerim</span>
                </button>

                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center space-x-3 px-6 py-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
                    activeTab === 'notifications' 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  <span>Bildirimlerim</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-6 py-4 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all transform hover:scale-105"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Çıkış Yap</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center mb-8">
                    <Settings className="h-6 w-6 text-indigo-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Profil Bilgileri</h2>
                  </div>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:gri d-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <User className="h-4 w-4 inline mr-2" />
                          Ad Soyad
                        </label>
                        <input
                          type="text"
                          value={userProfile.fullName}
                          onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                          placeholder="Adınız ve soyadınız"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Mail className="h-4 w-4 inline mr-2" />
                          E-posta
                        </label>
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                          placeholder="E-posta adresiniz"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Phone className="h-4 w-4 inline mr-2" />
                          Telefon
                        </label>
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                          placeholder="Telefon numaranız"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <MapPin className="h-4 w-4 inline mr-2" />
                          Şehir
                        </label>
                        <input
                          type="text"
                          value={userProfile.city}
                          onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                          placeholder="Şehir"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adres
                      </label>
                      <textarea
                        value={userProfile.address}
                        onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                        rows={3}
                        placeholder="Tam adresiniz"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
                    >
                      Bilgileri Güncelle
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <div className="flex items-center mb-8">
                    <Package className="h-6 w-6 text-indigo-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Siparişlerim</h2>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">📦</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Henüz siparişiniz yok</h3>
                      <p className="text-gray-600 mb-8">Alışverişe başlamak için ürünler sayfasını ziyaret edin.</p>
                      <button
                        onClick={() => navigate('/urunler')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
                      >
                        Alışverişe Başla
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-all">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">Sipariş #{order.id}</h3>
                              <div className="flex items-center text-gray-600 mt-1">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{order.date}</span>
                              </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-gray-600">Toplam: <span className="font-bold text-gray-900">{order.total} TL</span></p>
                              <p className="text-gray-600">Ödeme: <span className="font-medium">{order.paymentMethod}</span></p>
                            </div>
                            <button className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                              <Eye className="h-4 w-4 mr-2" />
                              Detayları Gör
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <div className="flex items-center mb-8">
                    <Heart className="h-6 w-6 text-indigo-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Favorilerim</h2>
                  </div>
                  
                  {favorites.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">💝</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Favori listeniz boş</h3>
                      <p className="text-gray-600 mb-8">Beğendiğiniz ürünleri favorilere ekleyerek kolayca bulabilirsiniz.</p>
                      <button
                        onClick={() => navigate('/urunler')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
                      >
                        Ürünleri Keşfet
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {favorites.map((product) => (
                        <div key={product.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-all group">
                          <div className="flex space-x-4">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-24 h-24 object-cover rounded-xl cursor-pointer group-hover:scale-105 transition-transform"
                              onClick={() => navigate(`/urun/${product.id}`)}
                            />
                            <div className="flex-1">
                              <h3 
                                className="font-bold text-lg text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
                                onClick={() => navigate(`/urun/${product.id}`)}
                              >
                                {product.name}
                              </h3>
                              
                              <div className="flex items-center mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= (product.rating_avg || 0)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              
                              <div className="mt-3">
                                {product.discountPercentage > 0 ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500 line-through text-sm">
                                      {product.price.toFixed(2)} TL
                                    </span>
                                    <span className="font-bold text-red-600">
                                      {(product.price * (1 - product.discountPercentage / 100)).toFixed(2)} TL
                                    </span>
                                  </div>
                                ) : (
                                  <span className="font-bold text-gray-900">{product.price.toFixed(2)} TL</span>
                                )}
                              </div>
                              
                              <div className="flex space-x-2 mt-4">
                                <button
                                  onClick={() => addToCart(product)}
                                  className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 text-sm font-medium"
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Sepete Ekle
                                </button>
                                <button
                                  onClick={() => removeFromFavorites(product.id)}
                                  className="flex items-center text-red-600 hover:text-red-800 px-4 py-2 rounded-lg hover:bg-red-50 transition-all text-sm font-medium"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Kaldır
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'payments' && (
                <div>
                  <div className="flex items-center mb-8">
                    <CreditCard className="h-6 w-6 text-indigo-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Ödeme Yöntemlerim</h2>
                  </div>
                  
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">💳</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Henüz kayıtlı kart yok</h3>
                    <p className="text-gray-600 mb-8">Hızlı ödeme için kredi kartınızı kaydedebilirsiniz.</p>
                    <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-semibold">
                      <CreditCard className="h-5 w-5 mr-2 inline" />
                      Yeni Kart Ekle
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <div className="flex items-center mb-8">
                    <Bell className="h-6 w-6 text-indigo-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Bildirim Ayarları</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 transition-all">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-3 rounded-xl mr-4">
                          <Mail className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">E-posta Bildirimleri</h3>
                          <p className="text-gray-600 text-sm">Kampanya ve fırsatlardan haberdar olun</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 transition-all">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl mr-4">
                          <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Sipariş Bildirimleri</h3>
                          <p className="text-gray-600 text-sm">Sipariş durumu güncellemeleri</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 transition-all">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-xl mr-4">
                          <Gift className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Özel Teklifler</h3>
                          <p className="text-gray-600 text-sm">Size özel indirim ve teklifler</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 transition-all">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-orange-100 to-red-100 p-3 rounded-xl mr-4">
                          <Shield className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Güvenlik Bildirimleri</h3>
                          <p className="text-gray-600 text-sm">Hesap güvenliği ile ilgili uyarılar</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;
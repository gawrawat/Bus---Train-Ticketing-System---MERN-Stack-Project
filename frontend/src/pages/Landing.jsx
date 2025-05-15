import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, Bus, Train, MapPin, Calendar, ArrowRight, Mail, Phone, Map, Clock, Ticket, Users, Shield, Info, ArrowUp, Facebook, Twitter, Instagram, Linkedin, ArrowDown } from 'lucide-react';

// AnimatedDestinations component
const AnimatedDestinations = ({ cities }) => {
  const [currentCity, setCurrentCity] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCity((prev) => (prev + 1) % cities.length);
    }, 2000); // Change every 2 seconds
    return () => clearInterval(interval);
  }, [cities]);

  return (
    <span className="relative inline-block">
      {cities.map((city, index) => (
        <span 
          key={city}
          className={`absolute left-0 transition-all duration-1000 ${currentCity === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {city}
        </span>
      ))}
    </span>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const cities = [
    "Jaffna", "Batticaloa", "Ampara", "Trincomalee", "Mannar", 
    "Hatton", "Badulla", "Matara", "Anuradhapura", "Polonnaruwa",
    "Hambantota", "Kilinochchi", "Vavuniya", "Mullaithivu", "Gampaha",
    "Kalutara", "Galle", "Matale", "Nuwara Eliya", "Moneragala",
    "Kegalle", "Ratnapura", "Kurunegala", "Puttalam", "Colombo"
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Sample gallery images
  const galleryImages = [
    { id: 1, src: 'https://w0.peakpx.com/wallpaper/56/330/HD-wallpaper-srilanka-ctb-beautiful-bus-drone-nostalgia-sri-sri-lanka-tree-woq.jpg', alt: 'Rural Beauty' },
    { id: 2, src: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957', alt: 'Sri Lankan Bus' },
    { id: 3, src: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?q=80&w=2128&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Nine Arches' },
    { id: 4, src: 'https://www.shutterstock.com/shutterstock/photos/679803412/display_1500/stock-photo-kataragama-sri-lanka-august-a-wild-elephant-waiting-for-hand-outs-of-food-from-679803412.jpg', alt: 'Bus Interior' },
    { id: 5, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Fort_Railway_Station.jpg/1024px-Fort_Railway_Station.jpg', alt: 'Scenic Train Ride' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will contact you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image & Animated Destinations */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/enchanting/q_90,f_auto,c_lfill,w_1600,h_675/enchanting-web/2023/09/shutterstock_1474840397.png" 
            alt="Sri Lanka landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 to-purple-600/40"></div>
        </div>

        {/* Content */}
        <div className="text-center px-4 z-10">
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white flex items-center justify-center">
              <span className="mr-2">Travel to</span>
              <span className="text-yellow-300 min-w-[200px] inline-block text-left h-[1.2em]">
                <AnimatedDestinations cities={cities} />
              </span>
            </h1>
          </div>

          {/* Transport Buttons */}
          <div className="flex flex-col md:flex-row gap-8 justify-center mb-16">
            <Link 
              to="/bus" 
              className="w-32 h-32 md:w-40 md:h-40 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl flex flex-col items-center justify-center shadow-2xl hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Bus className="mb-2" size={40} />
              <span className="text-sm font-semibold">Bus Tickets</span>
            </Link>
            
            <Link 
              to="/train" 
              className="w-32 h-32 md:w-40 md:h-40 bg-blue-400 hover:bg-blue-500 text-white rounded-xl flex flex-col items-center justify-center shadow-2xl hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Train className="mb-2" size={40} />
              <span className="text-sm font-semibold">Train Tickets</span>
            </Link>
          </div>

          <button 
            onClick={() => scrollToSection('services')}
            className="animate-bounce flex flex-col items-center mx-auto text-white/90 hover:text-white transition-colors"
          >
            <span className="mb-1">Explore More</span>
            <ArrowDown size={24} />
          </button>
        </div>
      </div>

      {/* Gallery Section */}
      <div id="gallery" className="py-16 bg-gradient-to-b from-purple-50 to-blue-50 px-4 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-purple-200 opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-16 w-32 h-32 rounded-full bg-blue-200 opacity-20 blur-xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Journey Through Time
            <span className="block mt-2 text-lg font-normal text-purple-600">Visual Chronicles of Sri Lankan Transport</span>
          </h2>
          
          {/* Innovative Scrolling Gallery */}
          <div className="relative h-[500px] w-full mb-12">
            {/* Parallax Background Layer */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <img 
                src="https://www.sltb.lk/images/home/slider/slide1.jpg" 
                alt="Transport Heritage"
                className="w-full h-full object-cover opacity-20 blur-sm"
              />
            </div>
            
            {/* Interactive Card Carousel */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full overflow-x-auto pb-8 scrollbar-hide">
                <div className="flex space-x-8 px-8">
                  {galleryImages.map((image, index) => (
                    <div 
                      key={image.id} 
                      className={`flex-shrink-0 w-80 h-96 rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105 ${index % 2 === 0 ? 'bg-purple-100' : 'bg-blue-100'}`}
                    >
                      <div className="relative h-3/4 overflow-hidden rounded-t-2xl">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <p className="text-white font-medium">{image.alt}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${index % 2 === 0 ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                          <p className="text-sm text-gray-600">Historical Collection</p>
                        </div>
                        <button className={`mt-3 px-4 py-2 rounded-full text-xs font-bold ${index % 2 === 0 ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'} hover:opacity-90 transition-opacity`}>
                          View Story →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-16">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:opacity-90">
              Explore Full Archive
            </button>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div id="history" className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Transportation Heritage
            <span className="block mt-2 text-lg font-normal text-gray-500">Journey Through Sri Lanka's Mobility Evolution</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bus History */}
            <div className="relative overflow-hidden group bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg">
              <div className="p-6 h-full">
                <div className="flex items-center mb-4">
                  <Bus className="text-purple-600 mr-3" size={24} />
                  <h3 className="text-xl font-bold text-purple-800">The Bus Revolution</h3>
                </div>
                
                <div className="mb-4 relative overflow-hidden rounded-lg">
                  <img 
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgd3bzp1Upf8ynAMaC-hTg591ctTzrM8NUkecbSLwV38xwH9gA0Mv6gGu92hYFGsnFg9SUxYGcQt3jxNuFdAqK87zKK9iUzApQzN2NsttUIZJxSOmzfYCRT2pMjJDeOhbmvX8PkoSwYtC4/s400/CLASSIC_LEYLAND_TIGER_CUB_CTB_SLTB_OLD_BUS_HOMAGAMA_DEPOT_CEYLON_TRANSPORT_BOARD_LANGAMA.JPG" 
                    alt="Vintage CTB bus"
                    className="w-full h-48 object-cover transform transition duration-500 group-hover:scale-110"
                  />
                  <span className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                    1950s CTB Bus
                  </span>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-700">
                    <span className="font-semibold text-purple-600">1920s:</span> First motorized buses appeared, replacing bullock carts on Colombo streets.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-purple-600">1958:</span> Ceylon Transport Board established with 300 Leyland buses imported from Britain.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-purple-600">1979:</span> SLTB formed, operating 5,000 buses serving 15 million passengers monthly.
                  </p>
                  <div className="bg-purple-100 p-3 rounded-lg border-l-4 border-purple-500">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold text-purple-700">Did you know?</span> The iconic red CTB buses were painted blue in 2005 to symbolize national unity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Train History */}
            <div className="relative overflow-hidden group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg">
              <div className="p-6 h-full">
                <div className="flex items-center mb-4">
                  <Train className="text-blue-600 mr-3" size={24} />
                  <h3 className="text-xl font-bold text-blue-800">Iron Tracks of Progress</h3>
                </div>
                
                <div className="mb-4 relative overflow-hidden rounded-lg">
                  <img 
                    src="https://i0.wp.com/thuppahis.com/wp-content/uploads/2022/05/Picture5-1.jpg?ssl=1" 
                    alt="First Sri Lankan train"
                    className="w-full h-48 object-cover transform transition duration-500 group-hover:scale-110"
                  />
                  <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Colombo-Ambepussa Line (1864)
                  </span>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-700">
                    <span className="font-semibold text-blue-600">1864:</span> First train chugged from Colombo to Ambepussa (54km) taking 4.5 hours.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-blue-600">1927:</span> Uda Pussellawa line completed, featuring the famous "Loop" engineering marvel.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-blue-600">Today:</span> 1,600km network with 9 lines serving 150,000 daily passengers.
                  </p>
                  <div className="bg-blue-100 p-3 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold text-blue-700">Fun Fact:</span> The Kandy-Badulla line includes the Demodara Loop where the track passes under itself!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <div id="services" className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Comprehensive Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Ticket className="text-purple-600 mr-3" size={24} />
                <h3 className="text-xl font-bold">Online Ticket Booking</h3>
              </div>
              <p className="text-gray-600">
                Book bus and train tickets online from anywhere. Instant confirmation and e-tickets available.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Clock className="text-blue-600 mr-3" size={24} />
                <h3 className="text-xl font-bold">Real-time Tracking</h3>
              </div>
              <p className="text-gray-600">
                Track your bus or train in real-time with our GPS-enabled tracking system.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Map className="text-green-600 mr-3" size={24} />
                <h3 className="text-xl font-bold">Route Planning</h3>
              </div>
              <p className="text-gray-600">
                Find optimal routes with our comprehensive journey planner and maps.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Users className="text-orange-600 mr-3" size={24} />
                <h3 className="text-xl font-bold">Group Bookings</h3>
              </div>
              <p className="text-gray-600">
                Special services for school trips, corporate events, and group travel.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Shield className="text-red-600 mr-3" size={24} />
                <h3 className="text-xl font-bold">Safety Features</h3>
              </div>
              <p className="text-gray-600">
                Emergency alerts, women-only compartments, and travel insurance options.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <Info className="text-yellow-600 mr-3" size={24} />
                <h3 className="text-xl font-bold">Tourist Information</h3>
              </div>
              <p className="text-gray-600">
                Special packages and information for tourists exploring Sri Lanka.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div id="contact" className="py-16 bg-gradient-to-b from-purple-50 to-blue-50 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-purple-200 opacity-10 blur-xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-blue-200 opacity-10 blur-xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
            Let's Connect
          </h2>
          <p className="text-lg text-center mb-12 text-purple-600 max-w-2xl mx-auto">
            Reach out to us through any channel - we're always here to help with your journey
          </p>

          {/* Floating form panel with glass morphism effect */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Visual contact panel */}
              <div className="bg-gradient-to-b from-purple-600 to-blue-600 p-8 text-white relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10"></div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">Contact Channels</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start group">
                      <div className="p-3 bg-white/20 rounded-lg mr-4 group-hover:bg-white/30 transition-all">
                        <Mail className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Email Us</h4>
                        <p className="text-white/90 hover:text-white transition-colors">
                          info@transport.lk
                        </p>
                        <p className="text-white/90 hover:text-white transition-colors">
                          support@transport.lk
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start group">
                      <div className="p-3 bg-white/20 rounded-lg mr-4 group-hover:bg-white/30 transition-all">
                        <Phone className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Call Us</h4>
                        <p className="text-white/90 hover:text-white transition-colors">
                          +94 11 2 345 678
                        </p>
                        <p className="text-white/90 hover:text-white transition-colors">
                          +94 76 123 4567 (24/7 Hotline)
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start group">
                      <div className="p-3 bg-white/20 rounded-lg mr-4 group-hover:bg-white/30 transition-all">
                        <Map className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Visit Us</h4>
                        <p className="text-white/90 hover:text-white transition-colors">
                          No. 123, Transport Avenue
                        </p>
                        <p className="text-white/90 hover:text-white transition-colors">
                          Colombo 05, Sri Lanka
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input type="checkbox" id="newsletter" className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500" />
                      <label htmlFor="newsletter" className="ml-2 text-sm text-gray-600">
                        Subscribe to newsletter
                      </label>
                    </div>
                    
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:opacity-90 flex items-center"
                    >
                      Send Message
                      <ArrowRight className="ml-2" size={18} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Social media links */}
          <div className="mt-12 flex justify-center space-x-6">
            <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow hover:bg-purple-50">
              <Facebook className="text-blue-600" size={20} />
            </a>
            <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow hover:bg-blue-50">
              <Twitter className="text-blue-400" size={20} />
            </a>
            <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow hover:bg-pink-50">
              <Instagram className="text-pink-600" size={20} />
            </a>
            <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow hover:bg-blue-50">
              <Linkedin className="text-blue-700" size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Admin Button */}
      <button
        onClick={() => navigate('/admin/login')}
        className="fixed top-4 left-4 p-2 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 transition-all z-[9999]"
      >
        <Settings className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Landing; 
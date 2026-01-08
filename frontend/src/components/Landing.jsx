import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">💬 ChatApp</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to="/"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Go to Chat
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
              Real-Time Chat Application
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with your friends and colleagues instantly. Send messages, share files, and stay connected in real-time.
            </p>
            {!user && (
              <div className="flex justify-center space-x-4">
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-white text-blue-500 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-blue-500"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-Time Messaging</h3>
              <p className="text-gray-600">
                Experience instant messaging with Socket.io. Your messages are delivered in real-time without any delay.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your conversations are secure with JWT authentication and encrypted connections. Your privacy matters.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">File Sharing</h3>
              <p className="text-gray-600">
                Share images, documents, and files easily. All files are stored securely using MinIO object storage.
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">💬</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Direct Messaging</h4>
                  <p className="text-gray-600">Start one-on-one conversations with any user instantly.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🟢</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Online Status</h4>
                  <p className="text-gray-600">See who's online and available to chat in real-time.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">⌨️</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Typing Indicators</h4>
                  <p className="text-gray-600">Know when someone is typing a message to you.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">📱</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Responsive Design</h4>
                  <p className="text-gray-600">Works seamlessly on desktop, tablet, and mobile devices.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🚀</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Fast & Reliable</h4>
                  <p className="text-gray-600">Built with modern technologies for optimal performance.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🎨</div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Modern UI</h4>
                  <p className="text-gray-600">Beautiful and intuitive interface built with Tailwind CSS.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-20">
            <h2 className="text-3xl font-bold text-center mb-8">Built With Modern Technologies</h2>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">React</div>
                <p className="text-blue-100">Frontend Framework</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Node.js</div>
                <p className="text-blue-100">Backend Runtime</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">MongoDB</div>
                <p className="text-blue-100">Database</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Socket.io</div>
                <p className="text-blue-100">Real-Time Communication</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">💬 ChatApp</h3>
              <p className="text-gray-400">
                A modern real-time chat application built with cutting-edge technologies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Real-Time Messaging</li>
                <li>File Sharing</li>
                <li>Online Status</li>
                <li>Typing Indicators</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Technology</h4>
              <ul className="space-y-2 text-gray-400">
                <li>React & Vite</li>
                <li>Node.js & Express</li>
                <li>MongoDB</li>
                <li>Socket.io</li>
                <li>MinIO</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {!user ? (
                  <>
                    <li>
                      <Link to="/login" className="text-gray-400 hover:text-white transition">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="text-gray-400 hover:text-white transition">
                        Sign Up
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-white transition">
                      Go to Chat
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ChatApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

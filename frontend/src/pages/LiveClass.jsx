/**
 * Página de clase en vivo (modo sincrónico - solo UI simulada)
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import { FiArrowLeft, FiVideo, FiMic, FiMicOff, FiVideoOff, FiUsers, FiMessageSquare } from 'react-icons/fi';
import { useState } from 'react';

const LiveClass = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          {/* Header de la clase */}
          <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/course/${id}`)}
                className="flex items-center text-gray-300 hover:text-white"
              >
                <FiArrowLeft className="mr-2" />
                Volver
              </button>
              <div className="h-6 w-px bg-gray-600"></div>
              <div>
                <h2 className="font-semibold">Clase en Vivo</h2>
                <p className="text-sm text-gray-400">Modo Sincrónico</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FiUsers className="h-5 w-5" />
              <span className="text-sm">45 participantes</span>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex flex-1 overflow-hidden">
            {/* Área de video */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 p-8">
              <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-6 relative">
                <div className="text-center">
                  <FiVideo className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Vista previa de la clase</p>
                  <p className="text-sm text-gray-500 mt-2">
                    (Simulación - En producción se integraría con WebRTC/Zoom/Meet)
                  </p>
                </div>
                {/* Indicador de grabación */}
                <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">EN VIVO</span>
                </div>
              </div>

              {/* Controles */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-4 rounded-full ${
                    audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                  } text-white transition-colors`}
                >
                  {audioEnabled ? <FiMic className="h-6 w-6" /> : <FiMicOff className="h-6 w-6" />}
                </button>
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={`p-4 rounded-full ${
                    videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                  } text-white transition-colors`}
                >
                  {videoEnabled ? <FiVideo className="h-6 w-6" /> : <FiVideoOff className="h-6 w-6" />}
                </button>
                <button
                  onClick={() => setChatOpen(!chatOpen)}
                  className={`p-4 rounded-full ${
                    chatOpen ? 'bg-primary-600' : 'bg-gray-700 hover:bg-gray-600'
                  } text-white transition-colors`}
                >
                  <FiMessageSquare className="h-6 w-6" />
                </button>
                <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors">
                  Salir de la clase
                </button>
              </div>
            </div>

            {/* Panel de chat lateral */}
            {chatOpen && (
              <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="font-semibold text-white">Chat en Vivo</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">Prof. María:</span> Bienvenidos a la clase de hoy
                    </p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">Juan:</span> Buenos días profesor
                    </p>
                  </div>
                </div>
                <div className="p-4 border-t border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Escribe un mensaje..."
                      className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default LiveClass;




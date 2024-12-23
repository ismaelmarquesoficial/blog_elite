import React from 'react';
import { Heart, Calendar, MessageCircle } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 py-16">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1682687220742-aba13b6e50ba')] opacity-10 bg-cover bg-center" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 mb-6">
            <Calendar className="h-4 w-4" />
            <span>14 de Dezembro de 2024</span>
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent mb-2 animate-fade-in">
            Esse dia será sempre marcado em nossas vidas. 
            <span className="inline-block animate-bounce ml-2">😍</span>
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6 text-gray-300">
            <p className="text-lg leading-relaxed animate-slide-up">
              ➡️ Estamos assimilando tudo que está acontecendo, estamos recebendo com muita alegria e de braços abertos cada mensagem de carinho, de bençãos, de afeto que estão transmitindo a nós.
            </p>
            
            <div className="flex items-center justify-center gap-4 animate-fade-in">
              <Heart className="text-red-400 animate-pulse" />
              <p className="text-xl font-semibold text-yellow-400">
                O novo ciclo da ELITE começou da melhor maneira possível.
              </p>
              <Heart className="text-red-400 animate-pulse" />
            </div>
          </div>
          
          <div className="mt-8 flex justify-center gap-4">
          <a href="https://wa.me/5551997158873">
          <button className="px-6 py-3 rounded-full bg-purple-500 text-white font-medium transition-all hover:bg-purple-600 hover:scale-105 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Enviar Mensagem
            </button></a>
          </div>
        </div>
      </div>
    </div>
  );
}
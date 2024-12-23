import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface Evento {
  id: number;
  titulo: string;
  data: string;
  horario: string;
  local: string;
  participantes: number;
  descricao: string;
  imagem: string;
}

export function Eventos() {
  const eventosDoMes: Evento[] = [
    {
      id: 1,
      titulo: "Workshop de Liderança",
      data: "20 Mar 2024",
      horario: "14:00 - 17:00",
      local: "Sala de Treinamento",
      participantes: 30,
      descricao: "Desenvolva habilidades essenciais de liderança com nossos especialistas.",
      imagem: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
    },
    {
      id: 2,
      titulo: "Noite de Jazz no Elite",
      data: "15 Abr 2024",
      horario: "19:00 - 23:00",
      local: "Salão Principal",
      participantes: 80,
      descricao: "Uma noite especial com os melhores músicos de jazz da cidade.",
      imagem: "/eventos/jazz-night.jpg"
    },
    {
      id: 3,
      titulo: "Workshop de Fotografia",
      data: "20 Abr 2024",
      horario: "09:00 - 12:00",
      local: "Estúdio Elite",
      participantes: 15,
      descricao: "Aprenda técnicas avançadas de fotografia com profissionais renomados.",
      imagem: "/eventos/workshop.jpg"
    },
    {
      id: 4,
      titulo: "Degustação de Vinhos",
      data: "25 Abr 2024",
      horario: "20:00 - 22:00",
      local: "Adega Elite",
      participantes: 25,
      descricao: "Seleção especial de vinhos premium com harmonização gastronômica.",
      imagem: "/eventos/wine-tasting.jpg"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
          Próximos Eventos
        </h1>
        <p className="text-gray-400 mt-2">
          Confira nossa programação de eventos exclusivos
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventosDoMes.map((evento) => (
          <div
            key={evento.id}
            className="group bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300"
          >
            <div className="aspect-video relative">
              <img
                src={evento.imagem}
                alt={evento.titulo}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{evento.titulo}</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <Calendar size={16} className="text-purple-400" />
                  {evento.data}
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-yellow-400" />
                  {evento.horario}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-purple-400" />
                  {evento.local}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={16} className="text-yellow-400" />
                  {evento.participantes} participantes
                </p>
              </div>
              
              <p className="mt-4 text-gray-300 text-sm">
                {evento.descricao}
              </p>
              
              <button className="mt-4 w-full bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full hover:bg-purple-500/30 transition-colors flex items-center justify-center gap-2">
                Inscrever-se
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
import React from 'react';
import { PartyPopper, Calendar, Users, MapPin, Camera, Music, Utensils } from 'lucide-react';

const celebrations = [
  {
    title: "Festa de Fim de Ano",
    date: "15 Dez 2024",
    location: "Espaço Celebration",
    attendees: 200,
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    description: "Nossa tradicional celebração de encerramento do ano",
    category: "Corporativo",
    highlights: ["Open Bar", "Live Music", "Buffet Premium"]
  },
  {
    title: "Jantar de Premiação",
    date: "20 Nov 2024",
    location: "Grand Hotel",
    attendees: 150,
    imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf",
    description: "Reconhecimento aos destaques do ano",
    category: "Premiação",
    highlights: ["Cerimônia", "Jantar", "Prêmios"]
  },
  {
    title: "Festival de Verão",
    date: "10 Jan 2025",
    location: "Praia Exclusive",
    attendees: 300,
    imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
    description: "Celebração de verão com toda a equipe",
    category: "Festival",
    highlights: ["Beach Games", "BBQ", "DJ Set"]
  },
  {
    title: "Happy Hour Mensal",
    date: "30 Mar 2024",
    location: "Rooftop Lounge",
    attendees: 80,
    imageUrl: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e",
    description: "Encontro mensal de integração",
    category: "Happy Hour",
    highlights: ["Networking", "Drinks", "Finger Food"]
  }
];

const categoryIcons = {
  Corporativo: PartyPopper,
  Premiação: Camera,
  Festival: Music,
  "Happy Hour": Utensils
};

export function Celebrations() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {celebrations.map((celebration) => {
        const CategoryIcon = categoryIcons[celebration.category] || PartyPopper;
        
        return (
          <div
            key={celebration.title}
            className="group bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300"
          >
            <div className="aspect-video relative">
              <img
                src={celebration.imageUrl}
                alt={celebration.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-purple-500/90 text-white text-sm font-medium flex items-center gap-1">
                <CategoryIcon size={14} />
                {celebration.category}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {celebration.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{celebration.description}</p>

              <div className="space-y-2 text-sm text-gray-400 mb-4">
                <p className="flex items-center gap-2">
                  <Calendar size={16} className="text-purple-400" />
                  {celebration.date}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-yellow-400" />
                  {celebration.location}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={16} className="text-purple-400" />
                  {celebration.attendees} convidados
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {celebration.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-medium"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
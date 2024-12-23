import React from 'react';
import { Calendar, Users, Star, MapPin } from 'lucide-react';

const pastEvents = [
  {
    title: "Tech Summit 2023",
    date: "10 Dez 2023",
    location: "Centro de Convenções",
    attendees: 250,
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    highlights: ["20+ Palestrantes", "Workshops Hands-on", "Networking"]
  },
  {
    title: "Hackathon de Inovação",
    date: "25 Nov 2023",
    location: "Hub de Tecnologia",
    attendees: 120,
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0",
    highlights: ["48 Horas", "15 Projetos", "Prêmios"]
  },
  {
    title: "Workshop Design Thinking",
    date: "15 Out 2023",
    location: "Sala de Treinamento",
    attendees: 45,
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1531498860502-7c67cf02f657",
    highlights: ["Metodologias Ágeis", "Cases Práticos", "Certificação"]
  }
];

export function PastEvents() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pastEvents.map((event) => (
        <div
          key={event.title}
          className="group bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-500/90 text-gray-900 px-2 py-1 rounded-full text-sm font-medium">
              <Star size={14} className="fill-current" />
              {event.rating}
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">
              {event.title}
            </h3>
            
            <div className="space-y-2 text-sm text-gray-400 mb-4">
              <p className="flex items-center gap-2">
                <Calendar size={16} className="text-purple-400" />
                {event.date}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-yellow-400" />
                {event.location}
              </p>
              <p className="flex items-center gap-2">
                <Users size={16} className="text-purple-400" />
                {event.attendees} participantes
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {event.highlights.map((highlight) => (
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
      ))}
    </div>
  );
}
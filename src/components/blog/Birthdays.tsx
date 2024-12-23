import React from 'react';
import { Cake, Users, MapPin, Calendar, Camera } from 'lucide-react';

const birthdayEvents = [
  {
    title: "Festa Surpresa - Maria Silva",
    date: "15 Mar 2024",
    location: "Restaurante Le Bistrot",
    attendees: 35,
    imageUrl: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84",
    highlights: ["Bolo Personalizado", "Decoração Temática", "Música ao Vivo"],
    photos: 124,
    department: "Marketing"
  },
  {
    title: "Celebração Conjunta - Equipe de Design",
    date: "28 Fev 2024",
    location: "Rooftop Garden",
    attendees: 50,
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d",
    highlights: ["Coffee Break", "Karaokê", "Presentes Coletivos"],
    photos: 87,
    department: "Design"
  },
  {
    title: "Happy Birthday Tech Team",
    date: "10 Fev 2024",
    location: "Game Space",
    attendees: 40,
    imageUrl: "https://images.unsplash.com/photo-1533294455009-a77b7557d2d1",
    highlights: ["Game Night", "Pizza Party", "Team Building"],
    photos: 156,
    department: "Tecnologia"
  }
];

export function Birthdays() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {birthdayEvents.map((event) => (
        <div
          key={event.title}
          className="group bg-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300"
        >
          <div className="relative aspect-video">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-purple-500/90 text-white text-sm font-medium flex items-center gap-1">
              <Cake size={14} />
              {event.department}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors">
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
              <p className="flex items-center gap-2">
                <Camera size={16} className="text-yellow-400" />
                {event.photos} fotos
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
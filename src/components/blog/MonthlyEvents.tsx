import React from 'react';
import { Calendar, Users, MapPin } from 'lucide-react';

const monthlyEvents = [
  {
    month: "Janeiro",
    events: [
      {
        title: "Planejamento Anual",
        date: "15 Jan",
        location: "Auditório Principal",
        attendees: 45,
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4"
      }
    ]
  },
  // Add more months...
];

export function MonthlyEvents() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {monthlyEvents.map((month) => (
        <div key={month.month} className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-colors">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">{month.month}</h3>
          {month.events.map((event) => (
            <div key={event.title} className="space-y-3">
              <div className="h-40 rounded-lg overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg font-medium text-white">{event.title}</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <Calendar size={16} />
                  {event.date}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} />
                  {event.location}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={16} />
                  {event.attendees} participantes
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
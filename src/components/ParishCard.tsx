import { Phone, Globe, Mail, Clock, MapPin, Edit, Save } from 'lucide-react';
import type { Parish } from '../types/parish';

interface ParishCardProps {
  parish: Parish;
  onEdit: (parish: Parish) => void;
  onSave: (parish: Parish) => void;
}

export function ParishCard({ parish, onEdit, onSave }: ParishCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{parish.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(parish)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors inline-flex items-center gap-1"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onSave(parish)}
            className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors inline-flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      {parish.photos.length > 0 && (
        <div className="mb-4">
          <img
            src={parish.photos[0]}
            alt={parish.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
          <div>
            <p>{parish.address.street}</p>
            <p>{`${parish.address.city}, ${parish.address.province} ${parish.address.postalCode}`}</p>
            <p>{parish.address.country}</p>
          </div>
        </div>

        {parish.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-gray-500" />
            <a href={`tel:${parish.phone}`} className="text-blue-600 hover:underline">
              {parish.phone}
            </a>
          </div>
        )}

        {parish.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-500" />
            <a href={`mailto:${parish.email}`} className="text-blue-600 hover:underline">
              {parish.email}
            </a>
          </div>
        )}

        {parish.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-500" />
            <a href={parish.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Visit Website
            </a>
          </div>
        )}

        {Object.keys(parish.openingHours).length > 0 && (
          <div className="flex items-start gap-2">
            <Clock className="w-5 h-5 text-gray-500 mt-1" />
            <div className="text-sm">
              {Object.entries(parish.openingHours).map(([day, hours]) => (
                <p key={day}><span className="font-medium">{day}:</span> {hours}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
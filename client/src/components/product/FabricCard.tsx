import React from 'react';
import { getS3ImageUrl } from '../../utils/imageUtils';

// Define the Fabric interface to match the one in FabricsPage
export interface Fabric {
  id: string;
  name: string;
  type: string;
  pricePerMeter: number;
  imageUrl: string;
  description: string;
  availableColors: string[];
  styles: string[];
  composition: string;
  weight: string;
  minOrderLength: number;
}

// Format price utility function
const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null) return '0.00';
  return price.toFixed(2);
};

// Utility function to extract material type from fabric name
const getMaterialTypeFromName = (fabricName: string): string => {
  const normalizedName = fabricName.toLowerCase();
  
  if (normalizedName.includes('cotton')) return 'Cotton';
  if (normalizedName.includes('polyester')) return 'Polyester';
  if (normalizedName.includes('linen')) return 'Linen';
  if (normalizedName.includes('silk')) return 'Silk';
  if (normalizedName.includes('wool')) return 'Wool';
  if (normalizedName.includes('canvas')) return 'Canvas';
  if (normalizedName.includes('fleece')) return 'Fleece';
  if (normalizedName.includes('oxford')) return 'Oxford';
  if (normalizedName.includes('poplin')) return 'Poplin';
  if (normalizedName.includes('bamboo')) return 'Bamboo';
  if (normalizedName.includes('twill')) return 'Twill';
  if (normalizedName.includes('jersey')) return 'Jersey';
  if (normalizedName.includes('softshell')) return 'Softshell';
  
  return 'Cotton';
};

// Function to get fabric image key
const getFabricImageKey = (fabricName: string, fabricType: string): string => {
  if (fabricType && fabricType.toLowerCase() !== 'fabric') {
    return `fabrics/${fabricType}.jpg`;
  }
  
  const materialType = getMaterialTypeFromName(fabricName);
  return `fabrics/${materialType}.jpg`;
};

interface FabricCardProps {
  fabric: Fabric;
  onClick: (fabric: Fabric) => void;
}

const FabricCard: React.FC<FabricCardProps> = ({ fabric, onClick }) => {
  return (
    <div 
      className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-gray-700"
      onClick={() => onClick(fabric)}
    >
      <div className="h-64 overflow-hidden">
        <img
          src={getS3ImageUrl(getFabricImageKey(fabric.name, fabric.type))}
          alt={fabric.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.log("Failed to load:", e.currentTarget.src);
            e.currentTarget.src = fabric.imageUrl || `/api/placeholder/600/600?text=${fabric.type}`;
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1">{fabric.name}</h3>
        <p className="text-gray-400 text-sm h-12 overflow-hidden">
          {fabric.description.substring(0, 60)}
          {fabric.description.length > 60 ? '...' : ''}
        </p>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-teal-400 font-bold">${formatPrice(fabric.pricePerMeter)}/m</span>
          {fabric.availableColors.length > 0 && (
            <div className="flex">
              {/* Make sure each color swatch has a unique key */}
              {fabric.availableColors.slice(0, 3).map((color, index) => (
                <div 
                  key={`${fabric.id}-color-${index}-${color}`} 
                  className="w-4 h-4 rounded-full ml-1"
                  style={{ 
                    backgroundColor: color.toLowerCase(),
                    boxShadow: color.toLowerCase() === 'white' ? 'inset 0 0 0 1px rgba(255,255,255,0.5)' : 'none'
                  }}
                  title={color}
                />
              ))}
              {fabric.availableColors.length > 3 && (
                <span className="text-xs text-gray-400 ml-1">+{fabric.availableColors.length - 3}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
            {fabric.type}
          </span>
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
            {fabric.weight}
          </span>
          {/* Make sure styles have unique keys too */}
          {fabric.styles.slice(0, 1).map((style, index) => (
            <span 
              key={`${fabric.id}-style-${index}-${style}`} 
              className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full"
            >
              {style}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FabricCard;
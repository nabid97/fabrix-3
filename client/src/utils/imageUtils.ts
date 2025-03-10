export const getS3ImageUrl = (key: string): string => {
  // Use full S3 bucket URL instead of relative path
  return `https://fabrix-assets.s3.us-east-1.amazonaws.com/${key}`;
};

export const getFabricImageKey = (fabricType: string): string => {
  // Handle null or undefined
  if (!fabricType) {
    return 'fabrics/Cotton.jpg';
  }
  
  // Normalize the input
  const normalizedType = fabricType.trim().toLowerCase();
  
  // Extract the base fabric type (e.g., "Polyester" from "Recycled Polyester Canvas")
  const baseTypes = ['Cotton', 'Polyester', 'Linen', 'Silk', 'Wool', 'Canvas'];
  
  for (const baseType of baseTypes) {
    if (normalizedType.includes(baseType.toLowerCase())) {
      return `fabrics/${baseType}.jpg`;
    }
  }
  
  // If no match, use Cotton as the default
  return `fabrics/Cotton.jpg`;
};
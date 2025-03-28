export const getS3ImageUrl = (key: string): string => {
  // Use full S3 bucket URL instead of relative path
  return `https://fabrix-assets.s3.us-east-1.amazonaws.com/${key}`;
};

export const getFabricImageKey = (fabricName: string, fabricType: string = ''): string => {
  // Handle null or undefined
  if (!fabricName && !fabricType) {
    return 'fabrics/Cotton.jpg';
  }
  
  // If we have a direct fabric type that's not just "fabric", use it
  if (fabricType && fabricType.toLowerCase() !== 'fabric') {
    const normalizedType = fabricType.trim().toLowerCase();
    
    // Extract the base fabric type
    const baseTypes = ['Cotton', 'Polyester', 'Linen', 'Silk', 'Wool', 'Canvas'];
    
    for (const baseType of baseTypes) {
      if (normalizedType.includes(baseType.toLowerCase())) {
        return `fabrics/${baseType}.jpg`;
      }
    }
  }
  
  // Fallback to trying to extract type from name
  if (fabricName) {
    const normalizedName = fabricName.trim().toLowerCase();
    
    // Check for common fabric types in the name
    const baseTypes = ['Cotton', 'Polyester', 'Linen', 'Silk', 'Wool', 'Canvas'];
    
    for (const baseType of baseTypes) {
      if (normalizedName.includes(baseType.toLowerCase())) {
        return `fabrics/${baseType}.jpg`;
      }
    }
  }
  
  // If no match, use Cotton as the default
  return `fabrics/Cotton.jpg`;
};

/**
 * Get clothing image key based on product name
 */
export const getClothingImageKey = (productName: string): string => {
  if (!productName) return 'clothing/default-clothing.jpg';
  
  const normalizedName = productName.trim().toLowerCase();
  
  // Map common product types to their image files
  const typeMap: Record<string, string> = {
    'polo': 'clothing/premium-polo-shirt.jpg',
    'shirt': 'clothing/business-shirt.jpg',
    't-shirt': 'clothing/classic-tshirt.jpg',
    'hoodie': 'clothing/pullover-hoodie.jpg',
    'jacket': 'clothing/softshell-jacket.jpg',
    'cap': 'clothing/structured-cap.jpg',
    'pullover': 'clothing/quarter-zip-pullover.jpg',
    'vest': 'clothing/performance-vest.jpg'
  };
  
  // Find matching type in product name
  for (const [key, value] of Object.entries(typeMap)) {
    if (normalizedName.includes(key)) {
      return value;
    }
  }
  
  // Default fallback
  return 'clothing/default-clothing.jpg';
};

/**
 * Utility to handle image loading with fallbacks for product images
 * Uses local assets instead of external placeholders
 */
export const getImageWithFallback = (url: string, productName: string) => {
  // If URL is empty or invalid, return appropriate default
  if (!url) {
    // Determine if it's clothing or fabric based on product name
    if (productName.toLowerCase().includes('shirt') || 
        productName.toLowerCase().includes('hoodie') || 
        productName.toLowerCase().includes('cap') || 
        productName.toLowerCase().includes('jacket') ||
        productName.toLowerCase().includes('vest')) {
      return {
        src: getS3ImageUrl(getClothingImageKey(productName)),
        onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          // If even the default clothing image fails, use the local fallback image
          e.currentTarget.src = '/assets/images/default-product.png';
        }
      };
    } else {
      // Assume fabric
      return {
        src: getS3ImageUrl('fabrics/Cotton.jpg'),
        onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          // If fabric image fails, use local fallback
          e.currentTarget.src = '/assets/images/default-fabric.png';
        }
      };
    }
  }
  
  // Return the original URL with fallback handler
  return {
    src: url,
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const target = e.currentTarget;
      
      // Try to determine if this is clothing or fabric
      const isClothing = productName.toLowerCase().includes('shirt') || 
                         productName.toLowerCase().includes('hoodie') || 
                         productName.toLowerCase().includes('cap') || 
                         productName.toLowerCase().includes('jacket') ||
                         productName.toLowerCase().includes('vest');
      
      if (isClothing) {
        // Try a more specific clothing image based on product name
        target.src = getS3ImageUrl(getClothingImageKey(productName));
        target.onerror = () => {
          // If that fails too, use local fallback
          target.src = '/assets/images/default-product.png';
        };
      } else {
        // Try a fabric fallback
        target.src = getS3ImageUrl('fabrics/Cotton.jpg');
        target.onerror = () => {
          // If that fails too, use local fallback
          target.src = '/assets/images/default-fabric.png';
        };
      }
    }
  };
};
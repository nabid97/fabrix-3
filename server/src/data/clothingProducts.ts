export default [
  {
    name: 'T-Shirt',
    description: 'A comfortable cotton t-shirt',
    price: 19.99,
    availableColors: ['red', 'blue', 'green'],
    availableSizes: ['S', 'M', 'L', 'XL'],
    images: ['https://example.com/tshirt.jpg'], // Added images property
  },
  
  {
    name: 'Premium Polo Shirt',
    description: 'High-quality polo shirt made from combed cotton. Perfect for company uniforms and events with custom embroidery options.',
    images: [
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/premium-polo-shirt.jpg',
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/premium-polo-shirt-alt.jpg'
    ],
    price: 24.99,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
    availableColors: ['White', 'Black', 'Navy', 'Red', 'Green', 'Blue'],
    fabricOptions: ['Cotton', 'Cotton-Poly Blend', 'Performance'],
    gender: ['men', 'women', 'unisex'],
    minOrderQuantity: 50,
    weight: 200,
    dimensions: {
      length: 30,
      width: 20,
      height: 2
    },
    customizationOptions: {
      allowsLogo: true,
      logoPositions: ['left-chest', 'right-chest', 'center-chest', 'back'],
      allowsCustomColors: true
    }
  },
  {
    name: 'Business Oxford Shirt',
    description: 'Classic oxford button-down shirt for professional environments. Made with wrinkle-resistant fabric for all-day comfort and a polished look.',
    images: [
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/business-shirt.jpg',
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/business-shirt-alt.jpg'
    ],
    price: 34.99,
    availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
    availableColors: ['White', 'Light Blue', 'Blue', 'Pink', 'Gray'],
    fabricOptions: ['Cotton', 'Cotton-Poly Blend', 'Performance'],
    gender: ['men', 'women'],
    minOrderQuantity: 50,
    weight: 250,
    dimensions: {
      length: 32,
      width: 22,
      height: 2
    },
    customizationOptions: {
      allowsLogo: true,
      logoPositions: ['left-chest', 'right-chest'],
      allowsCustomColors: false
    }
  },
  {
    name: 'Custom T-Shirt',
    description: 'Versatile and comfortable t-shirt made from 100% ringspun cotton. Ideal for teams, events, and promotional merchandise.',
    images: [
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/classic-tshirt.jpg',
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/classic-tshirt-alt.jpg'
    ],
    price: 15.99,
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    availableColors: ['White', 'Black', 'Navy', 'Red', 'Green', 'Blue', 'Yellow', 'Purple', 'Pink', 'Gray'],
    fabricOptions: ['Cotton', 'Cotton-Poly Blend', 'Organic'],
    gender: ['men', 'women', 'unisex'],
    minOrderQuantity: 100,
    weight: 180,
    dimensions: {
      length: 29,
      width: 19,
      height: 1
    },
    customizationOptions: {
      allowsLogo: true,
      logoPositions: ['left-chest', 'right-chest', 'center-chest', 'back', 'sleeve'],
      allowsCustomColors: true
    }
  },
  {
    name: 'Quarter-Zip Pullover',
    description: 'Comfortable quarter-zip pullover perfect for cooler office environments or outdoor corporate events. Features moisture-wicking technology.',
    images: [
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/quarter-zip-pullover.jpg',
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/quarter-zip-pullover-alt.jpg'
    ],
    price: 42.99,
    availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
    availableColors: ['Black', 'Navy', 'Gray', 'Red', 'Green'],
    fabricOptions: ['Performance', 'Fleece', 'Cotton-Poly Blend'],
    gender: ['men', 'women', 'unisex'],
    minOrderQuantity: 50,
    weight: 400,
    dimensions: {
      length: 32,
      width: 24,
      height: 3
    },
    customizationOptions: {
      allowsLogo: true,
      logoPositions: ['left-chest', 'right-chest', 'back'],
      allowsCustomColors: false
    }
  },
  {
    name: 'Corporate Softshell Jacket',
    description: 'Durable and water-resistant softshell jacket with three-layer bonded fabric. Ideal for outdoor corporate events and team building activities.',
    images: [
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/softshell-jacket.jpg',
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/softshell-jacket-alt.jpg'
    ],
    price: 64.99,
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    availableColors: ['Black', 'Navy', 'Gray', 'Red'],
    fabricOptions: ['Performance', 'Waterproof', 'Breathable'],
    gender: ['men', 'women'],
    minOrderQuantity: 25,
    weight: 600,
    dimensions: {
      length: 35,
      width: 26,
      height: 4
    },
    customizationOptions: {
      allowsLogo: true,
      logoPositions: ['left-chest', 'right-chest', 'back', 'sleeve'],
      allowsCustomColors: false
    }
  },
  {
    name: 'Embroidered Cap',
    description: 'Six-panel structured cap with pre-curved visor. Perfect for outdoor events and employee merchandise.',
    images: [
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/structured-cap.jpg',
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/structured-cap-alt.jpg'
    ],
    price: 12.99,
    availableSizes: ['One Size'],
    availableColors: ['Black', 'Navy', 'White', 'Red', 'Gray', 'Blue'],
    fabricOptions: ['Cotton', 'Cotton-Poly Blend', 'Performance'],
    gender: ['unisex'],
    minOrderQuantity: 100,
    weight: 100,
    dimensions: {
      length: 10,
      width: 10,
      height: 5
    },
    customizationOptions: {
      allowsLogo: true,
      logoPositions: ['front', 'side', 'back'],
      allowsCustomColors: true
    }
  },
  {
    name: 'Branded Hoodie',
    description: 'Warm and comfortable hoodie with kangaroo pocket. Great for company merchandise and cool-weather events.',
    images: [
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/pullover-hoodie.jpg',
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/pullover-hoodie-alt.jpg'
    ],
    price: 39.99,
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    availableColors: ['Black', 'Navy', 'Gray', 'Red', 'Blue', 'Green'],
    fabricOptions: ['Cotton', 'Cotton-Poly Blend', 'Fleece'],
    gender: ['men', 'women', 'unisex'],
    minOrderQuantity: 50,
    weight: 550,
    dimensions: {
      length: 32,
      width: 24,
      height: 3
    },
    customizationOptions: {
      allowsLogo: true,
      logoPositions: ['left-chest', 'center-chest', 'back', 'sleeve'],
      allowsCustomColors: true
    }
  },
  {
    name: 'Performance Vest',
    description: 'Lightweight insulated vest that provides core warmth without restricting movement. Ideal for outdoor corporate events.',
    images: [
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/performance-vest.jpg',
      'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/performance-vest-alt.jpg'
    ],
    price: 49.99,
    availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
    availableColors: ['Black', 'Navy', 'Gray', 'Red'],
    fabricOptions: ['Performance', 'Insulated', 'Water-Resistant'],
    gender: ['men', 'women'],
    minOrderQuantity: 25,
    weight: 350,
    dimensions: {
      length: 32,
      width: 24,
      height: 2
    },
    customizationOptions: {
      allowsLogo: true,
      logoPositions: ['left-chest', 'right-chest', 'back'],
      allowsCustomColors: false
    }
  }
];
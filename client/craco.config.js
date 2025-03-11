module.exports = {
  style: {
    postcss: {
      plugins: [
        require('postcss-import'),
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    configure: {
      devtool: 'source-map', // or 'eval-source-map' for development
    },
  },
};
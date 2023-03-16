/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens : {
        'super-large' :"1300px"  
      }
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}

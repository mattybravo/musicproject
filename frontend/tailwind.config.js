/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        exo: ["'Exo 2'", "sans-serif"],
        mont: ["Montserrat", "sans-serif"],
      },
      colors: {
        mpDarker:  "#17153B",
        mpDark:    "#2B284F",
        mpNight:   "#1C1A3F",
        mpDeep:    "#13112D",
        mpBlack:   "#0E0D1C",

        mpBlueDark:   "#2E236C",
        mpBlueHigh:   "#433D8B",

        mpPurple:       "#9966CC",
        mpPurpleSoft:   "#C8ACD6",
        mpPurpleLight:  "#E6D7F0",

        mpAqua:   "#A9FFFF",
        mpSky:    "#89E8FF",
        mpLilac:  "#D0CFFF",

        mpPinkLight: "#FFE8F9",
        mpPink:      "#FFB3C6",
        mpHotPink:   "#FF6F91",
      },

      backgroundImage: {
        // Gradiente 1 — #17153B → #231C54 → #433D8B
        "mp-grad-1": "linear-gradient(90deg, #17153B 0%, #231C54 50%, #433D8B 100%)",

        //Gradiante 1 Modi
        "mp-grad-1-mod": "linear-gradient(90deg, #433D8B 0%, #2E236C 100%)",

        // Gradiente 2 — #2E236C → #C8ACD6
        "mp-grad-2": "linear-gradient(90deg, #2E236C 0%, #C8ACD6 100%)",

        // Gradiente 3 — #433D8B → #89E8FF
        "mp-grad-3": "linear-gradient(90deg, #433D8B 0%, #89E8FF 100%)",
        
        //Gradiante 3 Modi
        "mp-grad-3-mod" : "linear-gradient(90deg, #6692C5 6%, #433DBB 41%, #89E8FF 100%)",

        // Gradiente Footer
        "mp-grad-full": "linear-gradient(to right, #433D8B, #89E8FF 25%, #FFB3C6 50%, #FF6F91)",
      },
    },
  },

  plugins: [],
};

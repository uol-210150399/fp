import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "Inter var",
          "Segoe UI",
          ...fontFamily.sans,
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;

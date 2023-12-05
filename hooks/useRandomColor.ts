// hooks/useRandomColor.ts
import { useEffect, useState } from "react";

const useRandomColor = () => {
  const [randomColor, setRandomColor] = useState<string>("#000000"); // Màu mặc định

  useEffect(() => {
    const generateRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const newColor = generateRandomColor();
    setRandomColor(newColor);
  }, []);
  return { randomColor };
};

export default useRandomColor;

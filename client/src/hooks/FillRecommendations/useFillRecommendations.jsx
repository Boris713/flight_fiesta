import { useEffect, useState } from "react";
import { useCity } from "../../contexts/cityContext/cityContext";

export const useFillRecommendations = (kinds) => {
  const { city } = useCity();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.opentripmap.com/0.1/en/places/radius?radius=15000&lon=${
            city[1]
          }&lat=${city[0]}&kinds=${kinds}&apikey=${
            import.meta.env.VITE_REACT_APP_MAP_API_KEY
          }`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Fetching data failed:", error);
      }
    };

    fetchData();
  }, [city]);

  return data;
};

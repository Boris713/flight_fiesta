import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

const CityContext = React.createContext();

export function useCity() {
  return useContext(CityContext);
}

export function CityProvider({ children }) {
  const [city, setCity] = useState([37.7749, -122.4194]);

  const value = {
    city,
    setCity,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

CityProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

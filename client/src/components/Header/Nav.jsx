import "bootstrap/dist/css/bootstrap.min.css";
import { useCity } from "../../contexts/cityContext/cityContext";
import { Link } from "react-router-dom";

const Nav = ({ children }) => {
  const { setCity } = useCity();

  const changeCity = (latitude, longitude, cityId, name) => {
    setCity({ coords: [latitude, longitude], cityId, name });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div className="dropdown me-3">
            <button
              className="btn btn-primary dropdown-toggle"
              type="button"
              data-toggle="dropdown"
            >
              City
              <span className="caret"></span>
            </button>
            <ul className="dropdown-menu">
              <li>
                <a
                  href="#"
                  onClick={() =>
                    changeCity(37.7749, -122.4194, 1, "San Francisco")
                  }
                >
                  San Francisco
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => changeCity(21.1619, -86.8515, 2, "Cancun")}
                >
                  Cancun
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => changeCity(40.7128, -74.006, 3, "New York")}
                >
                  New York
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => changeCity(48.8566, 2.3522, 4, "Paris")}
                >
                  Paris
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => changeCity(35.6895, 139.6917, 5, "Tokyo")}
                >
                  Tokyo
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => changeCity(51.5074, -0.1278, 6, "London")}
                >
                  London
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() =>
                    changeCity(34.0522, -118.2437, 7, "Los Angeles")
                  }
                >
                  Los Angeles
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => changeCity(41.8781, -87.6298, 8, "Chicago")}
                >
                  Chicago
                </a>
              </li>
            </ul>
          </div>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/liked">
                Liked
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/past-itineraries">
                My Itineraries
              </Link>
            </li>
          </ul>
        </div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/Home">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/itinerary-creator">
              Create New
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;

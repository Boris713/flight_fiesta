import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { useCity } from "../../contexts/cityContext/cityContext";
import { Link } from "react-router-dom";

const Nav = ({ children }) => {
  const { setCity } = useCity();

  const changeCity = (latitude, longitude, cityId) => {
    setCity({ coords: [latitude, longitude], cityId });
  };
  //Nav bar that will show in all places throughout website
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid d-flex justify-content-between">
        <div className="dropdown">
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
              <a href="#" onClick={() => changeCity(21.1619, -86.8515, 2)}>
                Cancun
              </a>
            </li>
            <li>
              <a href="#" onClick={() => changeCity(37.7749, -122.4194, 1)}>
                San Francisco
              </a>
            </li>
            <li>
              <a href="#" onClick={() => changeCity(40.7128, -74.006, 3)}>
                New York
              </a>
            </li>
          </ul>
        </div>
        <div className="mx-auto d-flex flex-grow-1 justify-content-center">
          <form className="form-inline my-2 my-lg-0">
            <div className="input-group">
              <input
                className="form-control"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </div>
            </div>
          </form>
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

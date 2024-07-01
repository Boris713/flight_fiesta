import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

const Nav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid d-flex justify-content-between">
        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            data-toggle="dropdown"
          >
            Dropdown Example
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu">
            <li>
              <a href="#">Cancun</a>
            </li>
            <li>
              <a href="#">San Francisco</a>
            </li>
            <li>
              <a href="#">New York</a>
            </li>
          </ul>
        </div>
        <div className="mx-auto">
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
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <a className="nav-link" href="../../pages/Home/home">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Create New
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;

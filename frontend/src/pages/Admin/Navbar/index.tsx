import { NavLink } from 'react-router-dom';
import './styles.css';
import { hasAnyRoles } from 'util/requests';

const Navbar = () => {
  return (
    <nav className="admin-nav-container">
      <ul>
        <li>
          <NavLink to="/admin/products" className="admin-nav-item ">
            <p>Productos </p>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/categories" className="admin-nav-item ">
            <p>categories </p>
          </NavLink>
        </li>
        {hasAnyRoles(['ROLE_ADMIN']) && (
          <li>
            <NavLink to="/admin/users" className="admin-nav-item ">
              <p>users </p>
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};
export default Navbar;

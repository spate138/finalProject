import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#4caf50',
        color: 'white',
      }}
    >
      <h1>OpenForum</h1>
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Home
        </Link>
        <Link to="/create" style={{ color: 'white', textDecoration: 'none' }}>
          Create Post
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

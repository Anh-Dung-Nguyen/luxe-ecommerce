import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import Btn from '../ui/Btn';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items) || [];
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navLinkStyle = {
    color: "var(--textMuted)", fontSize: "14px", fontWeight: 500, 
    padding: "0.25rem 0", transition: "color 0.2s", textDecoration: "none"
  };

  // --- MENU ADMIN ---
  if (user?.role === 'admin') {
    return (
      <nav style = {{ background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style = {{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to = "/" style = {{ textDecoration: 'none' }}>
            <span style = {{ fontFamily: "var(--fontDisplay)", fontSize: "22px", color: "var(--text)", letterSpacing: "-0.5px" }}>
              Luxe<span style = {{ color: "var(--accent)" }}>.</span> Admin
            </span>
          </Link>
          <div style = {{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <Link to = "/admin-dashboard" style = {navLinkStyle}>
              Admin Dashboard
            </Link>
            <Btn variant = "danger" size = "sm" onClick = {handleLogout}>
              Logout
            </Btn>
          </div>
        </div>
      </nav>
    );
  }

  // --- MENU SELLER ---
  if (user?.role === 'seller') {
    return (
      <nav style = {{ background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style = {{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to = "/" style = {{ textDecoration: 'none' }}>
            <span style = {{ fontFamily: "var(--fontDisplay)", fontSize: "22px", color: "var(--text)", letterSpacing: "-0.5px" }}>
              Luxe<span style = {{ color: "var(--accent)" }}>.</span> Seller 
            </span>
          </Link>
          <div style = {{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <Link to = "/seller-dashboard" style = {navLinkStyle}>
              Seller Dashboard
            </Link>
            <Btn variant = "danger" size = "sm" onClick = {handleLogout}>
              Logout
            </Btn>
          </div>
        </div>
      </nav>
    );
  }

  // --- MENU CLIENT (ou visiteur non connecté) ---
  return (
    <nav style = {{ background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style = {{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to = "/" style = {{ textDecoration: 'none' }}>
          <span style = {{ fontFamily: "var(--fontDisplay)", fontSize: "22px", color: "var(--text)", letterSpacing: "-0.5px" }}>
            Luxe<span style={{ color: "var(--accent)" }}>.</span>
          </span>
        </Link>
        <div style = {{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link to = "/products" style = {navLinkStyle}>
            Shop
          </Link>
        </div>
        <div style = {{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {user && (
            <Link to = "/cart" style = {{ position: "relative", color: "var(--textMuted)", fontSize: "22px", textDecoration: 'none' }}>
              🛒
              {cartCount > 0 && (
                <span style = {{ 
                  position: "absolute", 
                  top: "-4px", 
                  right: "-6px", 
                  background: "var(--accent)", 
                  color: "#1a1207", 
                  borderRadius: "50%", 
                  width: "18px", 
                  height: "18px", 
                  fontSize: "11px", 
                  fontWeight: 700, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center" 
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <div style = {{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link to = "/profile" style = {navLinkStyle}>
                ⚙️ Profile
              </Link>
              <Link to = "/my-orders" style = {navLinkStyle}>
                📦 Orders
              </Link>
              <Btn variant = "ghost" size = "sm" onClick = {handleLogout} style = {{ color: "#fca5a5" }}>
                Logout
              </Btn>
            </div>
          ) : (
            <div style = {{ display: "flex", gap: "8px" }}>
              <Btn variant = "ghost" size = "sm" onClick = {() => navigate('/login')}>
                Login
              </Btn>
              <Btn variant = "primary" size = "sm" onClick = {() => navigate('/register')}>
                Register
              </Btn>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
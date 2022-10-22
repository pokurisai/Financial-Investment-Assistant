import './Header.css';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function Header() {
  const [isUser, setUser] = useState(false);
  useEffect(() => {
    const location = window.location.pathname;
    if(location.includes('userdashboard')){
      setUser(true);
    }
  });

  const logout=()=>{
    localStorage.removeItem("user");
  }
  
  return (
    <nav class="navbar navbar-dark bg-primary">
  <div class="container-fluid">
  {!isUser &&
  <Link to="/admindashboard" className='logo'>FINANCIAL INVESTMENT ASIISTANT</Link>
  }
  {isUser &&
  <Link to="/userdashboard" className='logo'>FINANCIAL INVESTMENT ASIISTANT</Link>
  }
    <div class="d-flex">
      {isUser && 
    <ul class="nav">
      <li class="nav-item">
    <Link to="/userdashboard">Trades</Link>
  </li>
       <li class="nav-item">
    <Link to="/userdashboard/portfolio">Portfolio</Link>
  </li>
  <li class="nav-item">
    <Link to="/userdashboard/update">Update User</Link>
  </li>
  <li class="nav-item">
    <Link to="/login" onClick={logout}>Logout</Link>
  </li>
</ul>
}
{!isUser && 
    <ul class="nav">
  <li class="nav-item">
    <Link to="/login" onClick={logout}>Logout</Link>
  </li>
</ul>
}
    </div>
  </div>
</nav>
  );
}

export default Header;

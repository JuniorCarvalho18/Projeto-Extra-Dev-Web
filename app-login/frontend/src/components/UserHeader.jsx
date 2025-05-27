import React from 'react';

function CloseSidebar() {
  const Sidebar = document.querySelector('.sidebar');

  if (Sidebar) {
    if (Sidebar.style.display === 'flex' || Sidebar.style.display === '') {
      Sidebar.style.display = 'none';
    } else {
      Sidebar.style.display = 'flex';
    }
    Sidebar.style.transition = '0.5s';
  }
}

function UserHeader({ user }) {
  return (
    
    <div className="user-header">
      <h1 id="Header"> Juninho's Blog</h1>
      <div id="menu">
        <i id="burguer" className="material-icons"  onClick={CloseSidebar}>menu</i>
        <img
          src={`Juninho.jfif`}
          alt="Foto"
          className="user-photo"
        />
        <div>
          <h4>{user.fullName}</h4>
          <p>{user.role}</p>
        </div>
      </div>
    </div>
  );
}

export default UserHeader;
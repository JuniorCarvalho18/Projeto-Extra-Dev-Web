import React from 'react';

function CloseSidebar() {
  const Sidebar = document.querySelector('.sidebar');
  const body = document.querySelector('body');
  const burguer = document.querySelector('i');

  if (Sidebar) {
    if (Sidebar.style.display === 'flex' || Sidebar.style.display === '') {
      Sidebar.style.display = 'none';
      body.style.margin = '0';
      burguer.style.left = '20px';
    } else {
      Sidebar.style.display = 'flex';
      body.style.margin = '0 0 0 241px';
      burguer.style.left = '241px';
    }
    Sidebar.style.transition = '0.5s';
  }
}

function UserHeader({ user }) {
  return (
    
    <div className="user-header">
      <div id="Header">
        <i id="burguer" className="material-icons"  onClick={CloseSidebar}>menu</i>
        <h1> Juninho's Blog</h1>
      </div>
      <div id="menu">
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
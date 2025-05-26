import React from 'react';

function UserHeader({ user }) {
  return (
    <div className="user-header">
      <img 
        src={`http://localhost:3001/uploads/${user.photo}`} 
        alt="Foto" 
        className="user-photo" 
    />

      <div>
        <h4>{user.fullName}</h4>
        <p>{user.role}</p>
      </div>
    </div>
  );
}

export default UserHeader;
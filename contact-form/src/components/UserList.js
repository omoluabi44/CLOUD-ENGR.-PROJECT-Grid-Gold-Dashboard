import React from 'react';

const UserList = ({ users }) => {
  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;

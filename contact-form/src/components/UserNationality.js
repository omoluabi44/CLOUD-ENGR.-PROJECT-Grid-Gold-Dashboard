import React from 'react';

const UserNationality = ({ nationalityCounts }) => {
  return (
    <div>
      <h2>Nationality Counts</h2>
      <ul>
        {Object.entries(nationalityCounts).map(([nationality, count]) => (
          <li key={nationality}>{`${nationality}: ${count}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserNationality;

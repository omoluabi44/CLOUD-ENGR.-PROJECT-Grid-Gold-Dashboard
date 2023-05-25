import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';


const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [userList, setUserList] = useState([]);
  const [nationalityCounts, setNationalityCounts] = useState({});
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(' https://2i9pt7222a.execute-api.us-east-2.amazonaws.com/default/ServerlessApplication-Dashboard');
        const data = response.data.body;
        const parsedData = JSON.parse(data);

        const { users, userCount, nationalityCounts, userList, totalUserCount } = parsedData;

        setUserCount(userCount);
        setUserList(userList);
        setNationalityCounts(nationalityCounts);
        setTotalUserCount(totalUserCount);
        setUsers(users);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="dashboard">
        <h2>Cognito User Pool</h2>
        <h3>User Count: {totalUserCount}</h3>
        {users && users.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>User Create Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.Email}</td>
                  <td>{user.UserCreateDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No user data available.</p>
        )}

        <h2>DynamoDB Table</h2>
        <h3>User Count: {userCount}</h3>
        <h3>Nationality Count:</h3>
        {nationalityCounts && Object.keys(nationalityCounts).length > 0 ? (
          <ul>
            {Object.entries(nationalityCounts).map(([nationality, count]) => (
              <li key={nationality}>
                {nationality}: {count}
              </li>
            ))}
          </ul>
        ) : (
          <p>No nationality data available.</p>
        )}
        {userList && userList.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Fullname</th>
                <th>Email</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user, index) => (
                <tr key={index}>
                  <td>{user.Fullname}</td>
                  <td>{user.Email}</td>
                  <td>{user.Age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No user data available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

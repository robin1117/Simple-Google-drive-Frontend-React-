import { useEffect, useState } from "react";
import "./UsersPage.css";
import { baseUrl } from "../baseUrl";
import { useNavigate } from "react-router-dom";
import { useProfileContext } from "../context/profileContext";
import { getProfileApi } from "../apis/getProfileApi";

export default function UsersPage() {
  let { profile, setProfile } = useProfileContext();
  const [users, setUsers] = useState([]);
  let nevigate = useNavigate();

  const logoutUser = (userId) => {
    alert(`Logging out user with ID: ${userId}`);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isLoggedIn: false } : user,
      ),
    );
  };

  useEffect(() => {
    fetchUsers();
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data } = await getProfileApi();

      if (data.error) {
        navigate("/login");
        return;
      }

      setProfile({
        name: data.name ?? "",
        email: data.email ?? "",
        role: data.role ?? "",
        picture: data.picture ?? "",
      });
    } catch (error) {
      console.log(error);
      console.error("Failed to fetch profile:", error);
    }
  }

  async function fetchUsers() {
    try {
      const response = await fetch(`${baseUrl()}/users`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else if (response.status == 403) {
        nevigate("/");
      } else if (response.status == 401) {
        nevigate("/login");
      } else {
        // Handle other error statuses if needed
        console.error("Error fetching users data", response.status);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  }

  return (
    <div className="users-container">
      <h1 className="title">All Users</h1>
      <div> App:{profile.role}</div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th></th>
            {profile.role == "admin" && <th></th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isLoggedIn ? "Logged In" : "Logged Out"}</td>
              <td>
                <button
                  className="logout-button"
                  onClick={() => logoutUser(user.id)}
                  disabled={!user.isLoggedIn}
                >
                  Logout
                </button>
              </td>
              {profile.role == "admin" && (
                <td>
                  <button
                    className="logout-button delete-button"
                    onClick={() => logoutUser(user.id)}
                    disabled={!user.isLoggedIn}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

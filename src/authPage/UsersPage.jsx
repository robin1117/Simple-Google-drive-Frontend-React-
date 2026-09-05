import { useEffect, useState } from "react";
import "./UsersPage.css";
import { useNavigate } from "react-router-dom";
import { useHeaderContext } from "../context/HeaderContext";
import { getProfileApi, getUsersApi } from "../apis/GET_PROFILE_apis";
import { deleteUserWithUserId } from "../apis/deleteUserWithuserId";
import Modal from "react-modal";
import { logoutWithUserIdApi } from "../apis/POST_logout_apis";

Modal.setAppElement("#root");
export default function UsersPage() {
  let { profile, setProfile } = useHeaderContext();
  const [users, setUsers] = useState([]);
  const [isPopUpOpen, setisPopUpOpen] = useState(false);
  const [IdOfDeleteUser, setIdOfDeleteUser] = useState("");
  let nevigate = useNavigate();

  const logoutUser = async (user) => {
    let confirming = confirm(`Logging out user with ID: ${user.email}`);
    if (!confirming) return;

    let data = await logoutWithUserIdApi(user.id);
    console.log(data);
    if (data.status == "200") {
      data.data.message;
      alert(data.data.message);
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data } = await getProfileApi();
      if (data.error) {
        nevigate("/login");
        return;
      }

      setProfile({
        name: data.name ?? "",
        email: data.email ?? "",
        role: data.role ?? "",
        picture: data.picture ?? "",
      });
    } catch (error) {
      console.dir(error);
    }
  }

  async function fetchUsers() {
    try {
      const response = await getUsersApi();
      if (response.status) {
        const data = response.data;
        setUsers(data);
      }
    } catch (err) {
      if (err.status == 403) {
        nevigate("/");
      } else if (err.status == 401) {
        nevigate("/login");
      } else {
        console.error("Error fetching users data", err.status);
      }
    }
  }

  async function userDelete(user, deleteType) {
    let confirming = confirm(
      `You are about to delete user of Id: ${user.email},${deleteType}`,
    );
    if (!confirming) return;
    try {
      let data = await deleteUserWithUserId(user.id, deleteType);
      if (data.statusText == "OK") {
        data.data.message;
        alert(data.data.message);
        setisPopUpOpen(false);
        fetchUsers();
      } else if (data.status == 401) {
        console.log("you are not authorize for this");
      }
    } catch (error) {
      if (error.response.status == 403) {
        setisPopUpOpen(false);
      }
    }
  }

  return (
    <div className="users-container">
      <h1 className="title">All Users</h1>
      <div>
        {" "}
        <b>{profile.name}</b>: ({profile.role})
      </div>
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
              <td>
                {user.name}
                {profile.email.includes(user.email) ? <b>(ME)</b> : ""}
              </td>
              <td>{user.email}</td>
              <td>{user.isLoggedIn ? "Logged In" : "Logged Out"}</td>
              <td>
                <button
                  className="logout-button"
                  onClick={() => logoutUser(user)}
                  disabled={!user.isLoggedIn}
                >
                  Logout
                </button>
              </td>
              {profile.role == "admin" && (
                <td>
                  <button
                    className="logout-button delete-button"
                    onClick={() => {
                      setisPopUpOpen(true);
                      setIdOfDeleteUser(user);
                    }}
                    disabled={profile.email.includes(user.email)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {isPopUpOpen && (
        <div
          onClick={() => setisPopUpOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-amber-400 p-6 rounded-lg shadow-2xl max-w-sm w-full mx-4 flex flex-col items-center gap-4 border border-amber-500"
          >
            <p className="text-gray-900 font-medium text-center">
              Choose the way you want to delete user
            </p>

            {/* बटन कंटेनर */}
            <div className="flex gap-3">
              <button
                className="logout-button delete-button bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                onClick={() => userDelete(IdOfDeleteUser, "hard")}
              >
                hard Delete
              </button>

              <button
                className="logout-button delete-button bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded transition-colors"
                onClick={() => userDelete(IdOfDeleteUser, "soft")}
              >
                Soft Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

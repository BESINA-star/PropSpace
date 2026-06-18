import { useEffect, useState } from "react";
import { getProfile, updateProfile, changePassword } from "../services/authService";

function Profile() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    avatarUrl: "",
    contactPhone: "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await getProfile();
        setForm({
          username: data.username || "",
          email: data.email || "",
          avatarUrl: data.avatarUrl || "",
          contactPhone: data.contactPhone || "",
        });
      } catch (err) {
        setError(err.message || "Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await updateProfile(form);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await changePassword({ oldPassword, newPassword });
      setMessage("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <header className="section-header">
          <h1>Account Settings</h1>
          <p>Update your profile details and password securely.</p>
        </header>

        {loading && <p>Loading...</p>}
        {error && <p className="error-state">{error}</p>}
        {message && <p className="success-state">{message}</p>}

        <form className="profile-form" onSubmit={handleProfileSubmit}>
          <h2>Profile information</h2>

          <label>Username</label>
          <input value={form.username} onChange={(e) => handleChange("username", e.target.value)} />

          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />

          <label>Avatar URL</label>
          <input value={form.avatarUrl} onChange={(e) => handleChange("avatarUrl", e.target.value)} />

          <label>Contact phone</label>
          <input value={form.contactPhone} onChange={(e) => handleChange("contactPhone", e.target.value)} />

          <button type="submit" disabled={loading}>
            Save profile
          </button>
        </form>

        <form className="profile-form" onSubmit={handlePasswordSubmit}>
          <h2>Change password</h2>

          <label>Current password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <label>New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label>Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            Update password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;

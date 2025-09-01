import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";

const ChangePassword = ({ isGoogleUser }) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      setLoading(false);
      return;
    }

    try {
      // Gửi request đổi mật khẩu
      const response = await authApis().post(endpoints['changePassword'], {
        newPassword: formData.newPassword,
      });

      if (response.status === 200) {
        setSuccess("Đổi mật khẩu thành công!");
        // Reset form
        setFormData({
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  if (isGoogleUser) {
    return (
      <div className="general-info-section">
        <h2>Đổi mật khẩu</h2>
        <Alert variant="info">
          Tài khoản của bạn đăng nhập bằng Google, không thể đổi mật khẩu trực tiếp.
          Để thay đổi mật khẩu, vui lòng truy cập tài khoản Google của bạn.
        </Alert>
      </div>
    );
  }

  return (
    <div className="general-info-section">
      <h2>Đổi mật khẩu</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Nhập mật khẩu mới"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Xác nhận mật khẩu mới</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu mới"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="save-button-container">
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
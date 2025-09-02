import { useEffect, useState } from "react";
import MySpinner from "./layouts/MySpinner";
import "../styles/Profile.css";
import { authApis, endpoints } from "../configs/Apis";
import { Alert } from "react-bootstrap";

// Import các component con
import ProfileInfo from "./profile/ProfileInfo";
import ChangePassword from "./profile/ChangePassword";
import CommentedArticle from "./profile/CommentedArticle";
import SavedArticle from "./profile/SavedArticle";

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({});
    const [activeTab, setActiveTab] = useState("profile"); // Tab mặc định là thông tin cá nhân
    const [isGoogleUser, setIsGoogleUser] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await authApis().get(endpoints.profile);
                const userData = response.data;
                setUserProfile(response.data);

                // Kiểm tra xem người dùng có đăng nhập bằng Google không
                setIsGoogleUser(userData.userProviders?.some(provider => provider.providerType === "GOOGLE"));

                setFormData({
                    username: userData.userIdUsername || '',
                    email: userData.userIdEmail || '',
                    birthday: userData.userIdBirthday || '',
                    gender: userData.userIdGender || '',
                    phoneNumber: userData.userIdPhoneNumber || '',
                    address: userData.userIdAddress || '',
                    avatar: userData.userIdAvatar || ''
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(URL.createObjectURL(file));

            setFormData(prev => ({
                ...prev,
                avatar: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Tạo FormData object để gửi cả dữ liệu và file
            const formDataToSend = new FormData();

            // Thêm các trường dữ liệu vào FormData
            formDataToSend.append('userIdUsername', formData.username);
            formDataToSend.append('userIdEmail', formData.email);
            formDataToSend.append('userIdBirthday', formData.birthday);
            formDataToSend.append('userIdGender', formData.gender);
            formDataToSend.append('userIdPhoneNumber', formData.phoneNumber);
            formDataToSend.append('userIdAddress', formData.address);

            // Thêm file avatar nếu có
            if (formData.avatar && formData.avatar instanceof File) {
                formDataToSend.append('avatarFile', formData.avatar);
            }

            // Gửi request với FormData và header đúng
            const response = await authApis().post('/secure/profile', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setError(null);
                // Hiển thị thông báo thành công
                setSuccess("Cập nhật thông tin thành công!");
            } else {
                setError("Failed to update profile");
                setSuccess(null);
            }
        }
        catch (error) {
            console.error('Error updating profile:', error);
            setError(error.message || "An error occurred while updating profile");
        }
        finally {
            setLoading(false);
        }
    };

    // Render component tương ứng với tab đang active
    const renderActiveComponent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileInfo 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    handleSubmit={handleSubmit} 
                />;
            case "password":
                return <ChangePassword isGoogleUser={isGoogleUser} />;
            case "commented":
                return <CommentedArticle />;
            case "saved":
                return <SavedArticle />;
            default:
                return <ProfileInfo 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    handleSubmit={handleSubmit} 
                />;
        }
    };

    return (
        loading ? (<MySpinner />) : (
            <>
                <div className="profile-container">
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}
                    <div className="profile-card">
                        {renderActiveComponent()}

                        <div className="profile-sidebar">
                            <div className="profile-review">
                                <h2>{userProfile?.userIdUsername || formData.username || 'reader2'}</h2>
                            </div>

                            <div className="profile-photo-section">
                                <h3>Ảnh đại diện</h3>
                                <div className="photo-upload">
                                    <div className="profile-image">
                                        <img
                                            src={selectedImage || userProfile?.userIdAvatarUrl || 'https://via.placeholder.com/150'}
                                            alt="Profile"
                                        />
                                    </div>
                                    <label className="upload-button">
                                        <span>Choose Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                    <p className="upload-info">JPG, GIF or PNG. Max size of 800K</p>
                                </div>
                            </div>

                            {/* Menu */}
                            <div className="profile-menu">
                                <ul>
                                    <li 
                                        className={activeTab === "profile" ? "active" : ""}
                                        onClick={() => setActiveTab("profile")}
                                    >
                                        <i className="fas fa-user"></i> Thông tin cá nhân
                                    </li>
                                    <li 
                                        className={activeTab === "password" ? "active" : ""}
                                        onClick={() => setActiveTab("password")}
                                    >
                                        <i className="fas fa-key"></i> Đổi mật khẩu
                                    </li>
                                    <li 
                                        className={activeTab === "commented" ? "active" : ""}
                                        onClick={() => setActiveTab("commented")}
                                    >
                                        <i className="fas fa-comments"></i> Bài viết đã bình luận
                                    </li>
                                    <li 
                                        className={activeTab === "saved" ? "active" : ""}
                                        onClick={() => setActiveTab("saved")}
                                    >
                                        <i className="fas fa-bookmark"></i> Bài viết đã lưu
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    );
}

export default Profile;
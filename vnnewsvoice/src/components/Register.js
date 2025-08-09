import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import Apis, { endpoints } from "../configs/Apis";
import MySpinner from "./layouts/MySpinner";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AppContext } from "../contexts/AppContext";
import useFormValidation from "../hooks/userFormValidation";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AppContext);
    const [loading, setLoading] = useState(false);

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateForm,
        reset,
    } = useFormValidation({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        phoneNumber: ""
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const register = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (values.password !== values.confirmPassword) {
            setMsg("Mật khẩu không khớp");
            return;
        }

        try {
            setLoading(true);
            setMsg("");

            const fieldMapping = {
                'username': 'userIdUsername',
                'password': 'userIdPassword',
                'email': 'userIdEmail',
                'phoneNumber': 'userIdPhoneNumber'
            };
            
            let form = new FormData();
            for (let key in values) {
                // Không gửi confirmPassword lên server
                if (key !== 'confirmPassword') {
                    const mappedKey = fieldMapping[key] || key;
                    form.append(mappedKey, values[key]);
                }
            }

            let res = await Apis.post(endpoints.register, form);
            if (res.status === 200) {
                reset();
                navigate('/login');
            } else {
                setMsg("Đăng ký thất bại");
            }
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            setMsg("Đã xảy ra lỗi khi đăng ký");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5} xl={4}>
                    <h2 className="text-center mb-4">Đăng ký</h2>
                    {msg && <Alert variant="danger">{msg}</Alert>}
                    
                    <Form onSubmit={register}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.email && errors.email}
                                disabled={loading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tên đăng nhập</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.username && errors.username}
                                disabled={loading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.password && errors.password}
                                    disabled={loading}
                                />
                                <Button
                                    variant="link"
                                    className="position-absolute end-0 top-50 translate-middle-y text-muted"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </Button>
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Xác nhận mật khẩu</Form.Label>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.confirmPassword && errors.confirmPassword}
                                disabled={loading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phoneNumber"
                                value={values.phoneNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.phoneNumber && errors.phoneNumber}
                                disabled={loading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phoneNumber}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {loading ? (
                            <MySpinner />
                        ) : (
                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit">
                                    Đăng ký
                                </Button>
                            </div>
                        )}
                    </Form>

                    <div className="text-center mt-3">
                        <p>
                            Đã có tài khoản?{" "}
                            <Link to="/login">Đăng nhập ngay</Link>
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
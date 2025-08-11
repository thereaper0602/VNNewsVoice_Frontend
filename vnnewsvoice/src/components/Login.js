import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import useFormValidation from "../hooks/userFormValidation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import MySpinner from "./layouts/MySpinner";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { login, loginWithGoogle, isLoading, error, clearError, setError, isAuthenticated, navigate } =
        useContext(AppContext);

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateForm,
        reset,
    } = useFormValidation({
        username: "",
        password: "",
    });

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    // Clear errors when component unmounts
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        await login({
            username: values.username,
            password: values.password,
        });
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        await loginWithGoogle(credentialResponse.credential);
    };

    const handleGoogleLoginFailure = () => {
        setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6} lg={5} xl={4}>
                    <h2 className="text-center mb-4">Đăng nhập</h2>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên đăng nhập</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.username && errors.username}
                                disabled={isLoading}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Mật khẩu</Form.Label>
                            <div className="position-relative">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.password && errors.password}
                                    disabled={isLoading}
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

                        {isLoading ? (
                            <MySpinner />
                        ) : (
                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit">
                                    Đăng nhập
                                </Button>
                            </div>
                        )}
                    </Form>

                    <div className="text-center mt-3">
                        <p className="mb-3">Hoặc đăng nhập với</p>
                        <div className="d-flex justify-content-center">
                            <GoogleLogin
                                onSuccess={handleGoogleLoginSuccess}
                                onError={handleGoogleLoginFailure}
                                useOneTap
                                theme="filled_blue"
                                text="signin_with"
                                shape="circle"
                                locale="vi"
                            />
                        </div>
                    </div>

                    <div className="text-center mt-3">
                        <p>
                            Chưa có tài khoản?{" "}
                            <Link to="/register">Đăng ký ngay</Link>
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
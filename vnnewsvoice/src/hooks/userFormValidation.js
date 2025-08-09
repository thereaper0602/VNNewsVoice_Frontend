import { useState } from 'react';

const useFormValidation = (initialValues = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({
            ...touched,
            [name]: true
        });

        validateField(name, values[name]);
    };

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'username':
                if (!value) error = 'Tên đăng nhập là bắt buộc';
                else if (value.length < 3) error = 'Tên đăng nhập phải có ít nhất 3 ký tự';
                break;
            case 'password':
                if (!value) error = 'Mật khẩu là bắt buộc';
                else if (value.length < 3) error = 'Mật khẩu phải có ít nhất 3 ký tự';
                else if (!/\d/.test(value)) error = 'Mật khẩu phải chứa ít nhất 1 số';
                break;
            case 'email':
                if (!value) error = 'Email là bắt buộc';
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email không hợp lệ';
                break;
            default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        return !error;
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
        const newTouched = {};

        // Validate all fields
        Object.keys(values).forEach(name => {
            newTouched[name] = true;
            const isFieldValid = validateField(name, values[name]);
            if (!isFieldValid) isValid = false;
        });

        setTouched(newTouched);
        return isValid;
    };

    const reset = () => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    };

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateForm,
        reset,
        setValues
    };
};

export default useFormValidation;
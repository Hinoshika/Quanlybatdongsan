const API_URL = "http://localhost:5000";

export const login = (values) => {
    return fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
    });
};

export const forgotPassword = (values) => {
    return fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
    });
};

export const verifyOtp = (values) => {
    return fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
    });
};

export const resetPassword = (values) => {
    return fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
    });
};
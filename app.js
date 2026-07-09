/* ===== LEAVETRACK APP.JS ===== */
/* shared javascript for all pages */

var API = "https://leavetrack-backend.onrender.com";

// ---- AUTH HELPERS ----

function getToken() {
    return localStorage.getItem("token");
}

function getRole() {
    return localStorage.getItem("role");
}

function getUsername() {
    return localStorage.getItem("username");
}

function saveAuth(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("username", data.username);
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

function checkAuth() {
    if (!getToken()) {
        window.location.href = "login.html";
    }
}

function checkRole(expectedRole) {
    checkAuth();
    if (getRole() !== expectedRole) {
        alert("You don't have access to this page.");
        if (getRole() === "STUDENT") {
            window.location.href = "student.html";
        } else {
            window.location.href = "teacher.html";
        }
    }
}

// ---- API CALL HELPER ----

function apiCall(method, url, body) {
    var options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    var token = getToken();
    if (token) {
        options.headers["Authorization"] = "Bearer " + token;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    return fetch(API + url, options).then(function (res) {
        if (res.status === 401) {
            alert("Session expired. Please login again.");
            logout();
            return;
        }
        if (res.status === 403) {
            alert("You are not authorized to do this.");
            return;
        }
        // for empty responses (approve/reject)
        var contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return res.json().then(function (data) {
                if (!res.ok) {
                    throw new Error(data.message || "Something went wrong");
                }
                return data;
            });
        } else {
            if (!res.ok) {
                throw new Error("Something went wrong");
            }
            return null;
        }
    });
}

// ---- SHOW MESSAGE ----

function showMsg(id, text, type) {
    var el = document.getElementById(id);
    el.textContent = text;
    el.className = "msg " + (type === "error" ? "msg-error" : "msg-success");
    el.style.display = "block";
}

function hideMsg(id) {
    var el = document.getElementById(id);
    el.style.display = "none";
}

// ---- STATUS CLASS ----

function statusClass(status) {
    if (status === "PENDING") return "status-pending";
    if (status === "APPROVED") return "status-approved";
    if (status === "REJECTED") return "status-rejected";
    return "";
}

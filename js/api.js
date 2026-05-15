const BASE_URL = "https://localhost:7146/api";

async function loginUser(email, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    return await response.json();
}

async function getUsers(page = 1, role = "") {
    const token = localStorage.getItem("token");

    let url = `${BASE_URL}/users?page=${page}&pageSize=10`;

    if (role && role !== "") {
        url += `&role=${role}`;
    }

    const res = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return await res.json();
}
async function deleteUserApi(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const errorData = await res.json(); 
        throw new Error(errorData.error);
    }
}
async function updateUser(id, data) {
    const token = localStorage.getItem("token");

    await fetch(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
}
async function createUser(user) {
    const token = localStorage.getItem("token");
    return await fetch(`${BASE_URL}/Users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(user)
    });
}
async function createFaculty(data) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/faculties`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    console.log("CREATE STATUS 👉", res.status);

    const text = await res.text();
    console.log("CREATE RESPONSE 👉", text);

    if (!res.ok) {
        throw new Error(text);
    }
}
async function getFaculties() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/faculties`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return await res.json();
}
async function updateFaculty(id, data) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/faculties/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }
}
async function deleteFaculty(id) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/faculties/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (res.ok) return;

    const data = await res.json();
    throw new Error(data.error || "Delete failed");
}

async function createCourse(data) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/courses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }

    return await res.text();
}
async function getDoctors() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/users?role=Doctor`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return await res.json();
}

async function getCourses(page = 1) {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/courses?page=${page}&pageSize=10`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

    return await res.json();
}


async function deleteCourse(id) {

    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/courses/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {

        const err = await res.json();

        throw new Error(err.error);
    }
}


//enrolment
async function createEnrollment(data) {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/enrollment`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(data)
        }
    );

    if (!res.ok) {

        const err = await res.json();

        throw new Error(err.error);
    }

    return await res.text();
}


async function getEnrolledStudents(courseId) {

    const res =
        await fetch(`${BASE_URL}/Courses/${courseId}/students`);

    return await res.json();
}
async function getStudents() {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/users?role=Student&pageSize=1000`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    return await res.json();
}
//for enrolment



async function getStudentsByFaculty(facultyId) {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/users/students/by-faculty/${facultyId}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

    return await res.json();
}

async function getCoursesByFaculty(facultyId) {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/courses/by-faculty/${facultyId}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

    return await res.json();
}

async function removeEnrollment(studentId, courseId) {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/enrollment/${studentId}/${courseId}`,
        {
            method: "DELETE",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!res.ok) {

        const err = await res.json();

        throw new Error(err.error);
    }

    return await res.json();
}


//result
async function getStudentResults(studentId) {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/grades/student/${studentId}`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

    return await res.json();
}

async function publishStudentResults(studentId) {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/grades/publish-student/${studentId}`,
        {
            method: "POST",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

    if (!res.ok) {

        const err = await res.text();

        console.log(err);

        throw new Error(err);
    }

    return await res.json();
}

//news
async function createNews(data) {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/news`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(data)
        });

    if (!res.ok) {

        const err = await res.json();

        throw new Error(err.error);
    }

    return true;
}

async function getNews() {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/news`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

    return await res.json();
}

async function deleteNews(id) {

    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/news/${id}`,
        {
            method: "DELETE",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

    if (!res.ok) {

        const err = await res.json();

        throw new Error(err.error);
    }

    return true;
}
//event
async function getEvents() {

    const res = await fetch(
        `${BASE_URL}/events`
    );

    return await res.json();
}

async function createEvent(data) {

    const token = localStorage.getItem('token');

    const res = await fetch(
        `${BASE_URL}/events`,
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

            body: JSON.stringify(data)
        }
    );

    if (!res.ok) {

        const err = await res.text();

        throw new Error(err);
    }
}

async function deleteEvent(id) {

    const token = localStorage.getItem('token');

    const res = await fetch(
        `${BASE_URL}/events/${id}`,
        {
            method: 'DELETE',

            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    if (!res.ok) {

        const err = await res.text();

        throw new Error(err);
    }
}

//ai
async function getAiAnalysis(courseId) {

    const token = localStorage.getItem("token");

    const response = await fetch(

        `${BASE_URL}/admin/ai-analysis/${courseId}`,

        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {

        throw new Error("Failed to load AI analysis");
    }

    return await response.json();
}
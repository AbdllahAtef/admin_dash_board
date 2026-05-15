let currentCoursePage = 1;

document.getElementById('save-course-btn')
.addEventListener('click', async function () {

    const course = {
        code: document.getElementById('course-code').value,
        name: document.getElementById('course-name').value,
        description: document.getElementById('course-description').value,
        doctorId: parseInt(document.getElementById('course-doctor').value),
        facultyId: parseInt(document.getElementById('course-faculty').value)
    };

    if (!course.code || !course.name || !course.description) {
        alert("Please fill all fields");
        return;
    }

    try {

        await createCourse(course);

        alert("Course added successfully ✅");

        toggleModal('modal-add-course');

        document.getElementById('course-code').value = '';
        document.getElementById('course-name').value = '';
        document.getElementById('course-description').value = '';

        await loadCoursesUI(currentCoursePage);

    } catch (err) {

    alert(err.message);

    }
});

async function loadDoctorsDropdown() {

    const doctors = await getDoctors();

    const select = document.getElementById('course-doctor');

    select.innerHTML = '';

    doctors.data.forEach(d => {

        select.innerHTML += `
            <option value="${d.id}">
                ${d.fullName}
            </option>
        `;
    });
}

async function loadFacultiesDropdownForCourses() {

    const faculties = await getFaculties();

    const select = document.getElementById('course-faculty');

    select.innerHTML = '';

    faculties.forEach(f => {

        select.innerHTML += `
            <option value="${f.id}">
                ${f.name}
            </option>
        `;
    });
}

async function loadCoursesUI(page = 1) {

    const res = await getCourses(page);

    console.log("COURSES 👉", res);

    const data = res.data ?? res.items ?? res;
    const total = res.total;
    const pageSize = res.pageSize;

    renderCoursesPagination(total, pageSize, page);

    const tbody = document.getElementById('courses-table-body');

    tbody.innerHTML = '';

    data.forEach(course => {

        tbody.innerHTML += `
            <tr class="border-t border-slate-100">

                <td class="py-5 px-4 font-bold text-primary-container">
                    ${course.code}
                </td>

                <td class="py-5 px-4 font-semibold">
                    ${course.name}
                </td>

                <td class="py-5 px-4">
                    ${course.facultyName ?? '-'}
                </td>

                <td class="py-5 px-4">
                    ${course.doctorName ?? '-'}
                </td>

                <td class="py-5 px-4">

                    <button 
                        class="delete-course-btn text-red-500"
                        data-id="${course.id}">

                        <span class="material-symbols-outlined">
                            delete
                        </span>

                    </button>

                </td>

            </tr>
        `;
    });
}

document.addEventListener("DOMContentLoaded", async function () {

    await loadDoctorsDropdown();

    await loadFacultiesDropdownForCourses();

    await loadCoursesUI(currentCoursePage);
});

function renderCoursesPagination(total, pageSize, currentPage) {

    const container =
        document.getElementById('courses-pagination');

    if (!container) {
        console.log("Pagination container not found");
        return;
    }

    container.innerHTML = '';

    const totalPages = Math.ceil(total / pageSize);

    for (let i = 1; i <= totalPages; i++) {

        const btn = document.createElement('button');

        btn.textContent = i;

        btn.className =
            `px-4 py-2 rounded-xl border ${
                i === currentPage
                ? 'bg-primary-container text-white'
                : 'bg-white'
            }`;

        btn.addEventListener('click', async function () {

            currentCoursePage = i;

            await loadCoursesUI(i);
        });

        container.appendChild(btn);
    }
}

// DELETE
document.querySelector('#courses-table-body')
.addEventListener('click', async function (e) {

    const deleteBtn = e.target.closest('.delete-course-btn');

    if (!deleteBtn) return;

    const id = deleteBtn.dataset.id;

    const confirmDelete =
        confirm("Are you sure you want to delete this course?");

    if (!confirmDelete) return;

    try {

        await deleteCourse(id);

        alert("Course deleted successfully 🗑️");

        await loadCoursesUI(currentCoursePage);

    } catch (err) {

        alert(err.message);
    }
});
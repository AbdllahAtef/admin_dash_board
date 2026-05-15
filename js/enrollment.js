async function loadStudentsByFaculty(facultyId) {

    const res =
        await getStudentsByFaculty(facultyId);

    const students = res.data ?? res;

    const select =
        document.getElementById('enroll-student');

    select.innerHTML = '';

    students.forEach(s => {

        select.innerHTML += `
            <option value="${s.id}">
                ${s.fullName}
            </option>
        `;
    });
}

async function loadCoursesByFaculty(facultyId) {

    const res =
        await getCoursesByFaculty(facultyId);

    const courses = res.data ?? res;

    const select =
        document.getElementById('enroll-course');

    select.innerHTML = '';

    courses.forEach(c => {

        select.innerHTML += `
            <option value="${c.id}">
                ${c.name} (${c.code})
            </option>
        `;
    });

    await loadEnrolledStudents();
}

// SAVE ENROLLMENT
document.getElementById('complete-enrollment-btn')
.addEventListener('click', async function () {

    const data = {

        studentId: parseInt(
            document.getElementById('enroll-student').value
        ),

        courseId: parseInt(
            document.getElementById('enroll-course').value
        )
    };

    try {

        await createEnrollment(data);

        alert("Enrollment completed successfully ✅");

        await loadEnrolledStudents();

    } catch (err) {

        alert(err.message);
    }
});

// LOAD ENROLLED STUDENTS
async function loadEnrolledStudents() {

    const courseId =
        document.getElementById('enroll-course').value;

    if (!courseId) return;

    const res =
        await getEnrolledStudents(courseId);

    const students = res.data ?? res;

    const list =
        document.getElementById('enrolled-list');

    list.innerHTML = '';

    students.forEach(s => {

        list.innerHTML += `
        <div class="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">

            <div class="flex items-center gap-3">

                <img src="images/student-avatar.png "class="w-10 h-10 rounded-full object-cover"/>

                <div>

                    <p class="text-sm font-bold">
                        ${s.fullName}
                    </p>

                    <p class="text-[10px] text-slate-500">
                        Enrolled: ${s.enrolledAt ?? '-'}
                    </p>

                </div>
            </div>

            <button
                class="remove-enrollment-btn text-red-500"
                data-student-id="${s.id}">

                <span class="material-symbols-outlined">
                    person_remove
                </span>

            </button>

        </div>
        `;
    });
}

// COURSE CHANGE
document.getElementById('enroll-course')
.addEventListener('change', async function () {

    await loadEnrolledStudents();
});

// FACULTY CHANGE
document.getElementById('enroll-faculty')
.addEventListener('change', async function () {

    const facultyId = this.value;

    if (!facultyId) return;

    await loadStudentsByFaculty(facultyId);

    await loadCoursesByFaculty(facultyId);
});

// INITIAL LOAD
document.addEventListener("DOMContentLoaded", async function () {

    const faculties =
        await getFaculties();

    const facultySelect =
        document.getElementById('enroll-faculty');

    facultySelect.innerHTML = '';

    faculties.forEach(f => {

        facultySelect.innerHTML += `
            <option value="${f.id}">
                ${f.name}
            </option>
        `;
    });

    if (faculties.length > 0) {

        const firstFacultyId = faculties[0].id;

        await loadStudentsByFaculty(firstFacultyId);

        await loadCoursesByFaculty(firstFacultyId);
    }
});

document.getElementById('enrolled-list')
.addEventListener('click', async function (e) {

    const btn =
        e.target.closest('.remove-enrollment-btn');

    if (!btn) return;

    const studentId =
        btn.dataset.studentId;

    const courseId =
        document.getElementById('enroll-course').value;

    const confirmDelete =
        confirm("Remove this student from course?");

    if (!confirmDelete) return;

    try {

        await removeEnrollment(studentId, courseId);

        alert("Enrollment removed successfully ✅");

        await loadEnrolledStudents();

    } catch (err) {

        alert(err.message);
    }
});
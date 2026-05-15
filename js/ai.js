async function loadAiFaculties() {

    const faculties = await getFaculties();

    const select =
        document.getElementById('ai-faculty-select');

    select.innerHTML = '';

    faculties.forEach(faculty => {

        select.innerHTML += `
            <option value="${faculty.id}">
                ${faculty.name}
            </option>
        `;
    });

    await loadAiCoursesByFaculty();
}

async function loadAiCoursesByFaculty() {

    const facultyId =
        document.getElementById(
            'ai-faculty-select'
        ).value;

    const courses =
        await getCoursesByFaculty(facultyId);

    const select =
        document.getElementById(
            'ai-course-select'
        );

    select.innerHTML = '';

    courses.forEach(course => {

        select.innerHTML += `
            <option value="${course.id}">
                ${course.name}
            </option>
        `;
    });
}
async function analyzeCourseAi() {

    const courseId =
        document.getElementById(
            'ai-course-select'
        ).value;

    const tbody =
        document.getElementById(
            'ai-results-body'
        );

    tbody.innerHTML = '';

    const result =
        await getAiAnalysis(courseId);

    result.forEach(student => {

        tbody.innerHTML += `

        <tr class="border-t border-slate-100">

            <td class="py-4 font-semibold">
                ${student.name}
            </td>

            <td class="py-4">
                ${student.academic_Score}
            </td>

            <td class="py-4">

                <span class="${
                    student.risk_Level === 'High Risk'
                    ? 'text-red-500'
                    : student.risk_Level === 'Medium Risk'
                    ? 'text-orange-500'
                    : 'text-green-600'
                } font-bold">

                    ${student.risk_Level}

                </span>

            </td>

            <td class="py-4 font-bold">
                ${student.fail_Probability}
            </td>

        </tr>
        `;
    });
}

document.getElementById('analyze-ai-btn')
.addEventListener('click', async function () {

    await analyzeCourseAi();
});

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadAiFaculties();
    }
);
document.getElementById('ai-faculty-select')
.addEventListener('change', async function () {

    await loadAiCoursesByFaculty();
});
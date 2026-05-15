let currentTranscriptStudentId = null;

async function loadResultsFaculties() {

    const faculties = await getFaculties();

    const select =
        document.getElementById('results-faculty-filter');

    select.innerHTML = '';

    faculties.forEach(f => {

        select.innerHTML += `
            <option value="${f.id}">
                ${f.name}
            </option>
        `;
    });

    await loadResultsStudents();
}

async function loadResultsStudents() {

    const facultyId =
        document.getElementById(
            'results-faculty-filter'
        ).value;

    const tbody =
        document.getElementById('results-tbody');

    tbody.innerHTML = '';

    if (!facultyId) return;

    const res =
        await getStudentsByFaculty(facultyId);

    const students = res.data ?? res;

    let pending = 0;
    let published = 0;

    students.forEach(student => {

        if (student.isPublished)
            published++;
        else
            pending++;

        tbody.innerHTML += `
        <tr class="bg-slate-50">

            <td class="py-4 pl-4 font-semibold">
                ${student.fullName}
            </td>

            <td>
                ${student.id}
            </td>

            <td>
                ${student.facultyName ?? '-'}
            </td>

            <td>
                <span class="${
                    student.isPublished
                    ? 'text-green-600'
                    : 'text-orange-500'
                } font-bold">

                    ${
                        student.isPublished
                        ? 'Published'
                        : 'Pending'
                    }

                </span>
            </td>

            <td class="pr-4">

                <button
                    onclick="showTranscript(
                        ${student.id},
                        '${student.fullName}',
                        '${student.facultyName}'
                    )"

                    class="text-primary-container font-bold hover:underline">

                    Transcript

                </button>

            </td>

        </tr>
        `;
    });

    document.getElementById('published-count')
        .textContent = published;

    document.getElementById('pending-count')
        .textContent = pending;
}

async function showTranscript(
    studentId,
    fullName,
    facultyName
) {

    currentTranscriptStudentId = studentId;

    document.getElementById('tr-name')
        .textContent = fullName;

    document.getElementById('tr-faculty')
        .textContent = facultyName;

    const results =
        await getStudentResults(studentId);

    const tbody =
        document.getElementById(
            'transcript-results-body'
        );

    tbody.innerHTML = '';

    results.forEach(r => {

        tbody.innerHTML += `
        <tr class="border-t border-slate-100">

            <td class="py-4 font-semibold">
                ${r.courseName}
            </td>

            <td class="py-4">
                ${r.doctorName}
            </td>

            <td class="py-4">
                ${r.midterm}
            </td>

            <td class="py-4">
                ${r.final}
            </td>

            <td class="py-4 font-bold text-primary-container">
                ${r.total}
            </td>

        </tr>
        `;
    });

    toggleModal('modal-transcript');
}

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById('publish-results-btn')
    .addEventListener('click', async function () {

        try {

            await publishStudentResults(
                currentTranscriptStudentId
            );

            alert("Results published successfully ✅");

            toggleModal('modal-transcript');

            await loadResultsStudents();

            currentTranscriptStudentId = null;

        } catch (err) {

            alert(err.message);
        }
    });

});

document.getElementById('results-faculty-filter')
.addEventListener('change', async function () {

    await loadResultsStudents();
});

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadResultsFaculties();
    }
);


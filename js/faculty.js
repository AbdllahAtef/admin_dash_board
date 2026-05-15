let editingFacultyId = null;

// ADD / EDIT
document.getElementById('save-faculty-btn')
.addEventListener('click', async function () {
    
    const name = document.getElementById('faculty-name').value;

    if (!name) {
        alert('Please enter faculty name');
        return;
    }

    try {
        if (editingFacultyId !== null) {
            await updateFaculty(editingFacultyId, { name });
            alert("Faculty updated successfully ✅");
        } else {
            await createFaculty({ name });
            alert("Faculty added successfully ✅");
        }

        toggleModal('modal-add-faculty');

        document.getElementById('faculty-name').value = '';
        document.getElementById('faculty-dean').value = '';
        editingFacultyId = null;

        // ✅ دي أهم سطر
        await loadFacultiesUI();

    } catch (err) {
        alert(err.message);
    }
    console.log("AFTER SAVE → reload faculties");
});


// LOAD UI
async function loadFacultiesUI() {
    const res = await getFaculties();

    console.log("FACULTIES RESPONSE 👉", res);

    const data = res.data ?? res;

    const grid = document.querySelector('#section-faculties .grid');
    console.log("GRID 👉", grid);
    console.log("CHILDREN BEFORE 👉", grid.children.length);    
    grid.innerHTML = "";
    console.log("CLEARED");

    data.forEach(f => {
    const card = document.createElement('div');

    card.className = 'group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm';
    card.dataset.id = f.id; 

    card.innerHTML = `
    <div class="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        
        <!-- ✏️ Edit -->
        <button class="edit-faculty-btn p-2 text-primary-container bg-purple-50 rounded-lg">
            <span class="material-symbols-outlined text-lg">edit</span>
        </button>

        <!-- 🗑️ Delete -->
        <button class="delete-faculty-btn p-2 text-red-600 bg-red-50 rounded-lg">
            <span class="material-symbols-outlined text-lg">delete</span>
        </button>
    </div>

    <div class="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-primary-container mb-4">
        <span class="material-symbols-outlined text-3xl">account_balance</span>
    </div>

    <h3 class="text-lg font-bold mb-1 faculty-name-text">${f.name}</h3>
    <p class="text-xs text-slate-500 mb-4 faculty-dean-text">Dean: -</p>
`;

    grid.appendChild(card);
});
}
document.querySelector('#section-faculties .grid')
.addEventListener('click', function (e) {

    const editBtn = e.target.closest('.edit-faculty-btn');
    if (!editBtn) return;

    const card = editBtn.closest('.bg-white');

    const name = card.querySelector('.faculty-name-text').textContent;

    editingFacultyId = card.dataset.id;

    document.getElementById('faculty-name').value = name;

    toggleModal('modal-add-faculty');
});

// INITIAL LOAD
document.addEventListener("DOMContentLoaded", async function () {
    await loadFacultiesUI();
});

//delete
document.querySelector('#section-faculties .grid')
.addEventListener('click', async function (e) {

    const deleteBtn = e.target.closest('.delete-faculty-btn');
    if (!deleteBtn) return;

    const card = deleteBtn.closest('.bg-white');
    const id = card.dataset.id;

    const confirmDelete = confirm("Are you sure you want to delete this faculty?");
    if (!confirmDelete) return;

    try {
        await deleteFaculty(id);

        alert("Faculty deleted successfully 🗑️");

        await loadFacultiesUI(); 

    } catch (err) {
        alert(err.message);
    }
});
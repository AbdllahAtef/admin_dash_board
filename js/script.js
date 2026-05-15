let usersCache = [];
let editingUserId = null;
let facultiesMap = {};
let currentFilter = "";
function showSection(sectionId) {
    document.querySelectorAll('.section-content').forEach(el => el.classList.remove('active'));
    document.getElementById('section-' + sectionId).classList.add('active');

    if (sectionId === 'users') {
        loadUsers();
    }
    
    document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('text-[#8B1A6B]', 'bg-purple-50', 'border-l-4', 'border-[#8B1A6B]');
        el.classList.add('text-slate-600');
    });
    
    const sidebarLinks = document.querySelectorAll('.nav-link');
    sidebarLinks.forEach(link => {
        const spanText = link.querySelector('span:last-child').textContent.toLowerCase();
        if (spanText.includes(sectionId === 'dashboard' ? 'dashboard' : sectionId.replace('-', ' '))) {
            link.classList.add('text-[#8B1A6B]', 'bg-purple-50', 'border-l-4', 'border-[#8B1A6B]');
            link.classList.remove('text-slate-600');
        }
    });

    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.replace('text-[#8B1A6B]', 'text-slate-400');
        const mobileText = el.querySelector('span:last-child').textContent.toLowerCase();
        const targetText = sectionId === 'dashboard' ? 'home' : sectionId;
        if (mobileText.includes(targetText)) {
            el.classList.replace('text-slate-400', 'text-[#8B1A6B]');
        }
    });
}

window.toggleModal = function (id) {
    const modal = document.getElementById(id);

    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
        modal.classList.add('flex'); 
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

// Show/Hide Faculty based on Role
const roleInput = document.getElementById('input-role');

if (roleInput) {
    roleInput.addEventListener('change', function () {
        const facultyDiv = document.getElementById('faculty-div');

        if (facultyDiv) {
            facultyDiv.style.display = this.value === 'Admin' ? 'none' : 'block';
        }
    });
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {

        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('bg-purple-500', 'text-white');
            b.classList.add('bg-slate-50', 'text-slate-600');
        });

        this.classList.remove('bg-slate-50', 'text-slate-600');
        this.classList.add('bg-purple-500', 'text-white');

        const text = this.textContent.trim();

        if (text === "All") currentFilter = "";
        else if (text === "Students") currentFilter = "Student";
        else if (text === "Doctors") currentFilter = "Doctor";
        else if (text === "Admins") currentFilter = "Admin";

        console.log("FILTER:", currentFilter); 

        loadUsers(1); 
    });
});

// Save User
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById('save-user-btn').addEventListener('click', async function () {
        console.log("SAVE CLICKED 🔥");

        const name = document.getElementById('input-name').value;
        const nationalId = document.getElementById('input-nationalid').value;
        const email = document.getElementById('input-email').value;
        const role = document.getElementById('input-role').value;
        const facultyId = parseInt(document.getElementById('input-faculty').value);
        const password = document.getElementById('input-password').value;

        if (!name || !nationalId || !email) {
            alert('Please fill all fields');
            return;
        }

        const user = {
            fullName: name,
            nationalId: nationalId,
            email: email,
            role: role,
            facultyId: facultyId
        };

        if (!editingUserId) {
            user.password = password;
        }

        if (editingUserId) {
            await updateUser(editingUserId, user);
            editingUserId = null;
        } else {
            await createUser(user);
        }

        toggleModal('modal-add-user');
        await loadUsers();
    });


    // reset
    document.getElementById('input-name').value = '';
    document.getElementById('input-nationalid').value = '';
    document.getElementById('input-email').value = '';
    document.getElementById('input-password').value = '';
});



// Event Image Random on Refresh
const eventImages = [
    'images/event1.jpeg',
    'images/event2.jpg',
    'images/event3.jpg',
    'images/event4.jpg'
];

const randomImg = eventImages[Math.floor(Math.random() * eventImages.length)];
document.getElementById('event-slider-img').src = randomImg;



let currentPage = 1;

async function loadUsers(page = 1) {
    currentPage = page;

    const res = await getUsers(page, currentFilter);

    const users = res.data;
    const totalPages = Math.ceil(res.total / res.pageSize);

    usersCache = users;

    const tbody = document.querySelector("#section-users tbody");
    tbody.innerHTML = "";

    users.forEach(u => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
        <td class="py-4 pl-4 font-semibold">${u.fullName}</td>
        <td class="text-sm">${u.nationalId ?? '-'}</td>
        <td class="text-sm">${u.email}</td>
        <td class="text-sm">${u.role}</td>
        <td class="text-sm">${u.facultyName ?? '-'}</td>
        <td>
            <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                Active
            </span>
        </td>
        <td class="pr-4">
            <button onclick="editUser(${u.id})" class="mr-2">✏️</button>
            <button onclick="deleteUser(${u.id})">🗑️</button>
        </td>
        `;

        tbody.appendChild(tr);
    });

    renderPagination(totalPages); 
}
//delete user
async function deleteUser(id) {
    if (!confirm("Are you sure?")) return;

    try {
        await deleteUserApi(id);
        alert("Deleted successfully");
        await loadUsers();
    } catch (err) {
        alert(err.message); 
    }
}
//edit user
function editUser(id) {
    const user = usersCache.find(u => u.id === id);

    if (!user) return;

    document.getElementById('input-name').value = user.fullName;
    document.getElementById('input-nationalid').value = user.nationalId;
    document.getElementById('input-email').value = user.email;
    document.getElementById('input-role').value = user.role;
    document.getElementById('input-password').parentElement.style.display = 'none';
    document.getElementById('input-faculty').value = user.facultyId;

    editingUserId = id; 

    toggleModal('modal-add-user');
}

async function loadFaculties() {
    const faculties = await getFaculties();

    faculties.forEach(f => {
        facultiesMap[f.id] = f.name;
    });
}


//get faculty
async function loadFacultiesDropdown() {
    const res = await getFaculties();

    const select = document.getElementById("input-faculty");
    select.innerHTML = "";

    res.forEach(f => {
        const option = document.createElement("option");
        option.value = f.id;
        option.textContent = f.name;
        select.appendChild(option);
    });
}
document.addEventListener("DOMContentLoaded", async function () {
    await loadFacultiesDropdown();
    await loadUsers();
    await loadFacultiesUI();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {

            const text = this.textContent.trim();

            if (text === "All") currentFilter = "";
            else if (text === "Students") currentFilter = "Student";
            else if (text === "Doctors") currentFilter = "Doctor";
            else if (text === "Admins") currentFilter = "Admin";

            loadUsers(1);
        });
    });

});

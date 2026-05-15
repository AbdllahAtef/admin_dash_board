
function renderPagination(totalPages) {
    const container = document.getElementById("pagination");
    container.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");

        btn.textContent = i;
        btn.className = "px-3 py-1 border rounded";

        if (i === currentPage) {
            btn.classList.add("bg-purple-500", "text-white");
        }

        btn.onclick = () => loadUsers(i);

        container.appendChild(btn);
    }
}

//add user
function openAddUserModal() {
    editingUserId = null;

    document.getElementById('password-div').style.display = 'block';

    toggleModal('modal-add-user');
}

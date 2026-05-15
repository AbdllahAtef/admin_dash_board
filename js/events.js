async function loadEvents() {

    const events = await getEvents();

    const list =
        document.getElementById('events-list');

    list.innerHTML = '';

    events.forEach(e => {

        const date =
            new Date(e.eventDate)
            .toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });

        list.innerHTML += `

        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">

            <div class="flex justify-between items-center gap-4">

                <div class="flex-1">

                    <h4 class="font-bold text-lg mb-1">
                        ${e.title}
                    </h4>

                    <p class="text-sm text-slate-500">
                        ${e.description}
                    </p>

                    <p class="text-xs text-slate-400 mt-2">
                        ${date}
                    </p>

                </div>

                <button
                    class="delete-event-btn text-red-500"
                    data-id="${e.id}">

                    <span class="material-symbols-outlined">
                        delete
                    </span>

                </button>

            </div>

        </div>
        `;
    });
}

// delete
document.getElementById('events-list')
.addEventListener('click', async function (e) {

    const btn =
        e.target.closest('.delete-event-btn');

    if (!btn) return;

    const id = btn.dataset.id;

    const confirmDelete =
        confirm("Delete this event?");

    if (!confirmDelete) return;

    try {

        await deleteEvent(id);

        alert("Event deleted successfully 🗑️");

        await loadEvents();

    } catch (err) {

        alert(err.message);
    }
});

// save
document.getElementById('save-event-btn')
.addEventListener('click', async function () {

    const data = {

        title:
            document.getElementById('event-title').value,

        description:
            document.getElementById('event-location').value,

        eventDate:
            document.getElementById('event-date').value
    };

    if (
        !data.title ||
        !data.description ||
        !data.eventDate
    ) {

        alert("Please fill all fields");

        return;
    }

    try {

        await createEvent(data);

        alert("Event added successfully ✅");

        toggleModal('modal-add-event');

        document.getElementById('event-title').value = '';

        document.getElementById('event-location').value = '';

        document.getElementById('event-date').value = '';

        await loadEvents();

    } catch (err) {

        alert(err.message);
    }
});

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadEvents();
    }
);
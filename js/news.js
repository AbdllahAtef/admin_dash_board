async function loadNews() {

    const news = await getNews();

    const list =
        document.getElementById('news-list');

    list.innerHTML = '';

    news.forEach(n => {

        const date =
            new Date(n.createdAt)
            .toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit'
            });

        list.innerHTML += `
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-start">

            <div class="flex-1 pr-4">

                <div class="flex justify-between items-start mb-2">

                    <h4 class="font-bold text-lg">
                        ${n.title}
                    </h4>

                    <div class="flex items-center gap-3">

                        <span class="px-3 py-1 bg-purple-100 text-primary-container rounded-full text-xs font-bold">

                            ${date}

                        </span>

                        <button
                            class="delete-news-btn text-red-500"
                            data-id="${n.id}">

                            <span class="material-symbols-outlined">
                                delete
                            </span>

                        </button>

                    </div>

                </div>

                <p class="text-sm text-slate-500">
                    ${n.content}
                </p>

            </div>

        </div>
        `;
    });
}
document.getElementById('news-list')
.addEventListener('click', async function (e) {

    const btn =
        e.target.closest('.delete-news-btn');

    if (!btn) return;

    const id = btn.dataset.id;

    const confirmDelete =
        confirm("Delete this news?");

    if (!confirmDelete) return;

    try {

        await deleteNews(id);

        alert("News deleted successfully 🗑️");

        await loadNews();

    } catch (err) {

        alert(err.message);
    }
});

// save
document.getElementById('save-news-btn')
.addEventListener('click', async function () {

    const data = {

        title:
            document.getElementById('news-title').value,

        content:
            document.getElementById('news-desc').value
    };

    if (!data.title || !data.content) {

        alert("Please fill all fields");
        return;
    }

    try {

        await createNews(data);

        alert("News added successfully ✅");

        toggleModal('modal-add-news');

        document.getElementById('news-title').value = '';
        document.getElementById('news-desc').value = '';

        await loadNews();

    } catch (err) {

        alert(err.message);
    }
});

// tabs
function switchTab(tab) {

    document.getElementById('news-list')
    .classList.toggle('hidden', tab !== 'news');

    document.getElementById('events-list')
    .classList.toggle('hidden', tab !== 'events');

    document.getElementById('tab-news').className =
        tab === 'news'
        ? 'pb-3 font-bold text-primary-container border-b-2 border-primary-container text-sm'
        : 'pb-3 font-bold text-slate-400 text-sm';

    document.getElementById('tab-events').className =
        tab === 'events'
        ? 'pb-3 font-bold text-primary-container border-b-2 border-primary-container text-sm'
        : 'pb-3 font-bold text-slate-400 text-sm';
}

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadNews();
    }
);
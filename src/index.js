document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("guest-form");
    const guestList = document.getElementById("guest-list");
    const nameInput = document.getElementById("guest-name");
    const categoryInput = document.getElementById("guest-category");

    // Load guests from localStorage
    let guests = JSON.parse(localStorage.getItem("guests")) || [];

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const category = categoryInput.value;
        const timestamp = new Date().toLocaleDateString();

        if (!name) return;

        if (guests.length >= 10) {
            alert("Guest list is limited to 10 people.");
            return;
        }

        const guest = {
            id: Date.now(),
            name,
            category,
            timestamp,
            attending: false
        };
        guests.push(guest);
        saveAndRender();
        form.reset();
    });

    function saveAndRender() {
        localStorage.setItem("guests", JSON.stringify(guests));
        renderList();
    }

    function renderList() {
        guestList.innerHTML = ""; 

        guests.forEach((guest) => {
            const li = document.createElement("li");
            li.className = `category-${guest.category}`;
            if (guest.attending) {
                li.classList.add("attending");
            }

            const nameSpan = document.createElement("span");
            nameSpan.textContent = `${guest.name} (${guest.category}) - Added on: ${guest.timestamp}`;

            const statusSpan = document.createElement("span");
            statusSpan.textContent = ` RSVP: ${guest.attending ? "Attending" : "Not Attending"}`;

            const btnContainer = document.createElement("div");
            btnContainer.className = "buttons";

            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = "Toggle RSVP";
            toggleBtn.onclick = () => {
                guest.attending = !guest.attending;
                saveAndRender();
            };

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Remove";
            deleteBtn.onclick = () => {
                guests = guests.filter(g => g.id !== guest.id);
                saveAndRender();
            };

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.onclick = () => {
                const newName = prompt("Enter new name:", guest.name);
                if (newName) {
                    guest.name = newName.trim();
                    saveAndRender();
                }
            };
            
            btnContainer.append(toggleBtn, deleteBtn, editBtn);
            li.append(nameSpan, statusSpan, btnContainer);
            guestList.appendChild(li);
        });
    }

    // Initial load
    renderList();
});

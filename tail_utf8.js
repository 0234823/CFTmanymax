            <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--theme-main); font-family: var(--font-college); font-size: 1.5rem; margin-bottom: 0.5rem; letter-spacing: 1px;">Detalles</h4>
                <p><strong>Temporada Reclutamiento:</strong> ${p.recruitedSeason || 'Desconocido'}</p>
                <p><strong>Temporadas Jugadas:</strong> ${p.seasons ? p.seasons.join(', ') : 'Ninguna'}</p>
                <p><strong>Miembro HOF:</strong> ${p.isHOF ? 'SÃ­ (' + p.hofYear + ')' : 'No'}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px;">
                <h4 style="color: var(--theme-main); font-family: var(--font-college); font-size: 1.5rem; margin-bottom: 0.5rem; letter-spacing: 1px;">PalmarÃ©s</h4>
                <p style="white-space: pre-line; color: var(--text-muted);">${p.palmares || 'Sin registros adicionales.'}</p>
            </div>
        `;

        modal.style.display = "block";
    };

    const closeProfileModal = document.querySelector(".close-profile-modal");
    if(closeProfileModal) {
        closeProfileModal.addEventListener("click", () => {
            document.getElementById("player-profile-modal").style.display = "none";
        });
    }
    
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("player-profile-modal");
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });


});
    }

    if(lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            currentLightboxIndex = (currentLightboxIndex < mediaItems.length - 1) ? currentLightboxIndex + 1 : 0;
            updateLightboxContent();
        

    // --- GAME ADMIN LOGIC ---
    const adminGamesList = document.getElementById("admin-games-list");
    const formGameTitle = document.getElementById("form-game-title");
    const btnNewGame = document.getElementById("btn-new-game");
    const btnCancelGame = document.getElementById("btn-cancel-game");

    function renderAdminGamesList() {
        if(!adminGamesList) return;
        adminGamesList.innerHTML = "";
        games.forEach(g => {
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.innerHTML = `
                <div class="admin-list-item-info">
                    <strong>${g.opponent}</strong> <span>(${g.date})</span>
                </div>
                <div class="admin-list-actions">
                    <button type="button" class="btn-edit" data-id="${g.id}" title="Editar"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn-delete" data-id="${g.id}" title="Eliminar"><i class="fas fa-trash"></i></button>
                </div>
            `;
            adminGamesList.appendChild(item);
        });

        adminGamesList.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.currentTarget.getAttribute("data-id"));
                editGame(id);
            });
        });

        adminGamesList.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.currentTarget.getAttribute("data-id"));
                deleteGame(id);
            });
        });
    }

    function editGame(id) {
        const g = games.find(x => x.id === id);
        if(!g) return;
        
        document.getElementById("g-id").value = g.id;
        document.getElementById("g-opponent").value = g.opponent;
        document.getElementById("g-date").value = g.date;
        document.getElementById("g-time").value = g.time || "";
        document.getElementById("g-location").value = g.location || "";
        document.getElementById("g-status").value = g.status;
        
        if (formGameTitle) formGameTitle.textContent = "Editar Partido";
        adminGamesList.style.display = "none";
        const adminHeader = document.querySelector("#tab-game .admin-list-header");
        if(adminHeader) adminHeader.style.display = "none";
        formGame.style.display = "flex";
    }

    function deleteGame(id) {
        if(confirm("Â¿EstÃ¡s seguro de que deseas eliminar este partido?")) {
            games = games.filter(g => g.id !== id);
            saveToLocalStorage();
            renderGames();
            renderAdminGamesList();
        }
    }

    if(btnNewGame) {
        btnNewGame.addEventListener("click", () => {
            formGame.reset();
            document.getElementById("g-id").value = "";
            if (formGameTitle) formGameTitle.textContent = "Agregar Partido";
            adminGamesList.style.display = "none";
            const adminHeader = document.querySelector("#tab-game .admin-list-header");
            if(adminHeader) adminHeader.style.display = "none";
            formGame.style.display = "flex";
        });
    }

    if(btnCancelGame) {
        btnCancelGame.addEventListener("click", () => {
            formGame.style.display = "none";
            adminGamesList.style.display = "flex";
            const adminHeader = document.querySelector("#tab-game .admin-list-header");
            if(adminHeader) adminHeader.style.display = "flex";
        });
    }

    // Call renderAdminGamesList along with renderAdminPlayersList when admin modal opens
    renderAdminGamesList();

    // Patch formGame submit inside our script: We redefine it by replacing its old submit behavior, 
    // or we just define a new function but JavaScript prevents duplicate submit listeners easily if we just clone it.
    // Instead of cloning, we can just intercept inside. Wait, the old listener still exists. We should let javascript handle the old one but fix its code directly using regex before this block. I'll add a regex replacement later.

    // --- MEDIA ADMIN LOGIC ---
    const adminMediaList = document.getElementById("admin-media-list");
    const formMedia = document.getElementById("form-media");
    const btnNewMedia = document.getElementById("btn-new-media");
    const btnCancelMedia = document.getElementById("btn-cancel-media");

    function renderAdminMediaList() {
        if(!adminMediaList) return;
        adminMediaList.innerHTML = "";
        mediaItems.forEach((m, idx) => {
            const isVideo = m.type === "video" || m.src.startsWith("data:video");
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.style.flexDirection = "column";
            item.style.alignItems = "flex-start";
            
            item.innerHTML = `
                <div style="display: flex; gap: 10px; width: 100%; margin-bottom: 5px; align-items: center;">
                    <div style="width: 50px; height: 50px; background: #000; overflow: hidden; border-radius: 5px;">
                        ${isVideo ? `<video src="${m.src}" style="width:100%; height:100%; object-fit:cover;"></video>` : `<img src="${m.src}" style="width:100%; height:100%; object-fit:cover;">`}
                    </div>
                    <div class="admin-list-item-info">
                        <strong>${m.team ? m.team : "Ambos"}</strong>
                    </div>
                </div>
                <div class="admin-list-actions" style="width: 100%; justify-content: flex-end;">
                    <button type="button" class="btn-delete-media" data-index="${idx}" title="Eliminar"><i class="fas fa-trash"></i></button>
                </div>
            `;
            adminMediaList.appendChild(item);
        });

        adminMediaList.querySelectorAll(".btn-delete-media").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.currentTarget.getAttribute("data-index"));
                if(confirm("Â¿Eliminar este archivo?")) {
                    mediaItems.splice(idx, 1);
                    saveMediaToLocalStorage();
                    renderMedia();
                    renderAdminMediaList();
                }
            });
        });
    }

    if(btnNewMedia) {
        btnNewMedia.addEventListener("click", () => {
            formMedia.reset();
            document.getElementById("m-id").value = "";
            adminMediaList.style.display = "none";
            const adminHeader = document.querySelector("#tab-media .admin-list-header");
            if(adminHeader) adminHeader.style.display = "none";
            formMedia.style.display = "flex";
        });
    }

    if(btnCancelMedia) {
        btnCancelMedia.addEventListener("click", () => {
            formMedia.style.display = "none";
            adminMediaList.style.display = "grid";
            const adminHeader = document.querySelector("#tab-media .admin-list-header");
            if(adminHeader) adminHeader.style.display = "flex";
        });
    }

    if(formMedia) {
        formMedia.addEventListener("submit", (e) => {
            e.preventDefault();
            const fileInput = document.getElementById("m-file");
            const team = document.getElementById("m-team").value;

            if(fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                const type = file.type.startsWith("video") ? "video" : "image";
                const reader = new FileReader();
                reader.onload = function(evt) {
                    mediaItems.unshift({ type: type, src: evt.target.result, team: team });
                    saveMediaToLocalStorage();
                    renderMedia();
                    renderAdminMediaList();
                    btnCancelMedia.click();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    renderAdminMediaList();

    // Media Filter and View Toggle
    const mediaViewBtn = document.getElementById('btn-media-view');
    if(mediaViewBtn) {
        mediaViewBtn.addEventListener('click', () => {
            const grid = document.getElementById('media-grid');
            if(grid) {
                grid.classList.toggle('individual-view');
                if(grid.classList.contains('individual-view')) {
                    mediaViewBtn.innerHTML = '<i class="fas fa-th"></i> Vista Mosaico';
                } else {
                    mediaViewBtn.innerHTML = '<i class="fas fa-th-large"></i> Vista Individual';
                }
            }
        });
    }

    // Player Profile Modal Function
    window.openPlayerProfile = function(id) {
        const p = players.find(x => x.id === id);
        if(!p) return;

        const modal = document.getElementById("player-profile-modal");
        const content = document.getElementById("player-profile-content");

        content.innerHTML = `
            <div style="text-align: center;">
                <h2 style="font-family: var(--font-college); color: var(--accent-gold); font-size: 2.5rem; letter-spacing: 2px; margin-bottom: 0;">#${p.number} ${p.name}</h2>
                <h4 style="color: var(--text-main); margin-bottom: 1rem; font-size: 1.1rem; opacity: 0.9;">${p.position} | ${p.team}</h4>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--theme-main); font-family: var(--font-college); font-size: 1.5rem; margin-bottom: 0.5rem; letter-spacing: 1px;">Detalles</h4>
                <p><strong>Temporada Reclutamiento:</strong> ${p.recruitedSeason || 'Desconocido'}</p>
                <p><strong>Temporadas Jugadas:</strong> ${p.seasons ? p.seasons.join(', ') : 'Ninguna'}</p>
                <p><strong>Miembro HOF:</strong> ${p.isHOF ? 'SÃ­ (' + p.hofYear + ')' : 'No'}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px;">
                <h4 style="color: var(--theme-main); font-family: var(--font-college); font-size: 1.5rem; margin-bottom: 0.5rem; letter-spacing: 1px;">PalmarÃ©s</h4>
                <p style="white-space: pre-line; color: var(--text-muted);">${p.palmares || 'Sin registros adicionales.'}</p>
            </div>
        `;

        modal.style.display = "block";
    };

    const closeProfileModal = document.querySelector(".close-profile-modal");
    if(closeProfileModal) {
        closeProfileModal.addEventListener("click", () => {
            document.getElementById("player-profile-modal").style.display = "none";
        });
    }
    
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("player-profile-modal");
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });


});
    }

    if(btnAddMedia) {
        btnAddMedia.addEventListener('click', () => {
            const adminAuthModal = document.getElementById("admin-auth-modal");
            const adminPasswordInput = document.getElementById("admin-password");
            const authError = document.getElementById("auth-error");

            if(adminAuthModal) {
                adminPasswordInput.value = "";
                authError.style.display = "none";
                adminAuthModal.style.display = "block";
                adminAuthModal.setAttribute('data-target', 'media');
            }
        

    // --- GAME ADMIN LOGIC ---
    const adminGamesList = document.getElementById("admin-games-list");
    const formGameTitle = document.getElementById("form-game-title");
    const btnNewGame = document.getElementById("btn-new-game");
    const btnCancelGame = document.getElementById("btn-cancel-game");

    function renderAdminGamesList() {
        if(!adminGamesList) return;
        adminGamesList.innerHTML = "";
        games.forEach(g => {
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.innerHTML = `
                <div class="admin-list-item-info">
                    <strong>${g.opponent}</strong> <span>(${g.date})</span>
                </div>
                <div class="admin-list-actions">
                    <button type="button" class="btn-edit" data-id="${g.id}" title="Editar"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn-delete" data-id="${g.id}" title="Eliminar"><i class="fas fa-trash"></i></button>
                </div>
            `;
            adminGamesList.appendChild(item);
        });

        adminGamesList.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.currentTarget.getAttribute("data-id"));
                editGame(id);
            });
        });

        adminGamesList.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.currentTarget.getAttribute("data-id"));
                deleteGame(id);
            });
        });
    }

    function editGame(id) {
        const g = games.find(x => x.id === id);
        if(!g) return;
        
        document.getElementById("g-id").value = g.id;
        document.getElementById("g-opponent").value = g.opponent;
        document.getElementById("g-date").value = g.date;
        document.getElementById("g-time").value = g.time || "";
        document.getElementById("g-location").value = g.location || "";
        document.getElementById("g-status").value = g.status;
        
        if (formGameTitle) formGameTitle.textContent = "Editar Partido";
        adminGamesList.style.display = "none";
        const adminHeader = document.querySelector("#tab-game .admin-list-header");
        if(adminHeader) adminHeader.style.display = "none";
        formGame.style.display = "flex";
    }

    function deleteGame(id) {
        if(confirm("Â¿EstÃ¡s seguro de que deseas eliminar este partido?")) {
            games = games.filter(g => g.id !== id);
            saveToLocalStorage();
            renderGames();
            renderAdminGamesList();
        }
    }

    if(btnNewGame) {
        btnNewGame.addEventListener("click", () => {
            formGame.reset();
            document.getElementById("g-id").value = "";
            if (formGameTitle) formGameTitle.textContent = "Agregar Partido";
            adminGamesList.style.display = "none";
            const adminHeader = document.querySelector("#tab-game .admin-list-header");
            if(adminHeader) adminHeader.style.display = "none";
            formGame.style.display = "flex";
        });
    }

    if(btnCancelGame) {
        btnCancelGame.addEventListener("click", () => {
            formGame.style.display = "none";
            adminGamesList.style.display = "flex";
            const adminHeader = document.querySelector("#tab-game .admin-list-header");
            if(adminHeader) adminHeader.style.display = "flex";
        });
    }

    // Call renderAdminGamesList along with renderAdminPlayersList when admin modal opens
    renderAdminGamesList();

    // Patch formGame submit inside our script: We redefine it by replacing its old submit behavior, 
    // or we just define a new function but JavaScript prevents duplicate submit listeners easily if we just clone it.
    // Instead of cloning, we can just intercept inside. Wait, the old listener still exists. We should let javascript handle the old one but fix its code directly using regex before this block. I'll add a regex replacement later.

    // --- MEDIA ADMIN LOGIC ---
    const adminMediaList = document.getElementById("admin-media-list");
    const formMedia = document.getElementById("form-media");
    const btnNewMedia = document.getElementById("btn-new-media");
    const btnCancelMedia = document.getElementById("btn-cancel-media");

    function renderAdminMediaList() {
        if(!adminMediaList) return;
        adminMediaList.innerHTML = "";
        mediaItems.forEach((m, idx) => {
            const isVideo = m.type === "video" || m.src.startsWith("data:video");
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.style.flexDirection = "column";
            item.style.alignItems = "flex-start";
            
            item.innerHTML = `
                <div style="display: flex; gap: 10px; width: 100%; margin-bottom: 5px; align-items: center;">
                    <div style="width: 50px; height: 50px; background: #000; overflow: hidden; border-radius: 5px;">
                        ${isVideo ? `<video src="${m.src}" style="width:100%; height:100%; object-fit:cover;"></video>` : `<img src="${m.src}" style="width:100%; height:100%; object-fit:cover;">`}
                    </div>
                    <div class="admin-list-item-info">
                        <strong>${m.team ? m.team : "Ambos"}</strong>
                    </div>
                </div>
                <div class="admin-list-actions" style="width: 100%; justify-content: flex-end;">
                    <button type="button" class="btn-delete-media" data-index="${idx}" title="Eliminar"><i class="fas fa-trash"></i></button>
                </div>
            `;
            adminMediaList.appendChild(item);
        });

        adminMediaList.querySelectorAll(".btn-delete-media").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.currentTarget.getAttribute("data-index"));
                if(confirm("Â¿Eliminar este archivo?")) {
                    mediaItems.splice(idx, 1);
                    saveMediaToLocalStorage();
                    renderMedia();
                    renderAdminMediaList();
                }
            });
        });
    }

    if(btnNewMedia) {
        btnNewMedia.addEventListener("click", () => {
            formMedia.reset();
            document.getElementById("m-id").value = "";
            adminMediaList.style.display = "none";
            const adminHeader = document.querySelector("#tab-media .admin-list-header");
            if(adminHeader) adminHeader.style.display = "none";
            formMedia.style.display = "flex";
        });
    }

    if(btnCancelMedia) {
        btnCancelMedia.addEventListener("click", () => {
            formMedia.style.display = "none";
            adminMediaList.style.display = "grid";
            const adminHeader = document.querySelector("#tab-media .admin-list-header");
            if(adminHeader) adminHeader.style.display = "flex";
        });
    }

    if(formMedia) {
        formMedia.addEventListener("submit", (e) => {
            e.preventDefault();
            const fileInput = document.getElementById("m-file");
            const team = document.getElementById("m-team").value;

            if(fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                const type = file.type.startsWith("video") ? "video" : "image";
                const reader = new FileReader();
                reader.onload = function(evt) {
                    mediaItems.unshift({ type: type, src: evt.target.result, team: team });
                    saveMediaToLocalStorage();
                    renderMedia();
                    renderAdminMediaList();
                    btnCancelMedia.click();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    renderAdminMediaList();

    // Media Filter and View Toggle
    const mediaViewBtn = document.getElementById('btn-media-view');
    if(mediaViewBtn) {
        mediaViewBtn.addEventListener('click', () => {
            const grid = document.getElementById('media-grid');
            if(grid) {
                grid.classList.toggle('individual-view');
                if(grid.classList.contains('individual-view')) {
                    mediaViewBtn.innerHTML = '<i class="fas fa-th"></i> Vista Mosaico';
                } else {
                    mediaViewBtn.innerHTML = '<i class="fas fa-th-large"></i> Vista Individual';
                }
            }
        });
    }

    // Player Profile Modal Function
    window.openPlayerProfile = function(id) {
        const p = players.find(x => x.id === id);
        if(!p) return;

        const modal = document.getElementById("player-profile-modal");
        const content = document.getElementById("player-profile-content");

        content.innerHTML = `
            <div style="text-align: center;">
                <h2 style="font-family: var(--font-college); color: var(--accent-gold); font-size: 2.5rem; letter-spacing: 2px; margin-bottom: 0;">#${p.number} ${p.name}</h2>
                <h4 style="color: var(--text-main); margin-bottom: 1rem; font-size: 1.1rem; opacity: 0.9;">${p.position} | ${p.team}</h4>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--theme-main); font-family: var(--font-college); font-size: 1.5rem; margin-bottom: 0.5rem; letter-spacing: 1px;">Detalles</h4>
                <p><strong>Temporada Reclutamiento:</strong> ${p.recruitedSeason || 'Desconocido'}</p>
                <p><strong>Temporadas Jugadas:</strong> ${p.seasons ? p.seasons.join(', ') : 'Ninguna'}</p>
                <p><strong>Miembro HOF:</strong> ${p.isHOF ? 'SÃ­ (' + p.hofYear + ')' : 'No'}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px;">
                <h4 style="color: var(--theme-main); font-family: var(--font-college); font-size: 1.5rem; margin-bottom: 0.5rem; letter-spacing: 1px;">PalmarÃ©s</h4>
                <p style="white-space: pre-line; color: var(--text-muted);">${p.palmares || 'Sin registros adicionales.'}</p>
            </div>
        `;

        modal.style.display = "block";
    };

    const closeProfileModal = document.querySelector(".close-profile-modal");
    if(closeProfileModal) {
        closeProfileModal.addEventListener("click", () => {
            document.getElementById("player-profile-modal").style.display = "none";
        });
    }
    
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("player-profile-modal");
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });


});
    }

    // Removed old media upload logic

    // Initialize media
    renderMedia();



    // --- GAME ADMIN LOGIC ---
    const adminGamesList = document.getElementById("admin-games-list");
    const formGameTitle = document.getElementById("form-game-title");
    const btnNewGame = document.getElementById("btn-new-game");
    const btnCancelGame = document.getElementById("btn-cancel-game");

    function renderAdminGamesList() {
        if(!adminGamesList) return;
        adminGamesList.innerHTML = "";
        games.forEach(g => {
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.innerHTML = `
                <div class="admin-list-item-info">
                    <strong>${g.opponent}</strong> <span>(${g.date})</span>
                </div>
                <div class="admin-list-actions">
                    <button type="button" class="btn-edit" data-id="${g.id}" title="Editar"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn-delete" data-id="${g.id}" title="Eliminar"><i class="fas fa-trash"></i></button>
                </div>
            `;
            adminGamesList.appendChild(item);
        });

        adminGamesList.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.currentTarget.getAttribute("data-id"));
                editGame(id);
            });
        });

        adminGamesList.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(e.currentTarget.getAttribute("data-id"));
                deleteGame(id);
            });
        });
    }

    function editGame(id) {
        const g = games.find(x => x.id === id);
        if(!g) return;
        
        document.getElementById("g-id").value = g.id;
        document.getElementById("g-opponent").value = g.opponent;
        document.getElementById("g-date").value = g.date;
        document.getElementById("g-time").value = g.time || "";
        document.getElementById("g-location").value = g.location || "";
        document.getElementById("g-status").value = g.status;
        
        if (formGameTitle) formGameTitle.textContent = "Editar Partido";
        adminGamesList.style.display = "none";
        const adminHeader = document.querySelector("#tab-game .admin-list-header");
        if(adminHeader) adminHeader.style.display = "none";
        formGame.style.display = "flex";
    }

    function deleteGame(id) {
        if(confirm("Â¿EstÃ¡s seguro de que deseas eliminar este partido?")) {
            games = games.filter(g => g.id !== id);
            saveToLocalStorage();
            renderGames();
            renderAdminGamesList();
        }
    }

    if(btnNewGame) {
        btnNewGame.addEventListener("click", () => {
            formGame.reset();
            document.getElementById("g-id").value = "";
            if (formGameTitle) formGameTitle.textContent = "Agregar Partido";
            adminGamesList.style.display = "none";
            const adminHeader = document.querySelector("#tab-game .admin-list-header");
            if(adminHeader) adminHeader.style.display = "none";
            formGame.style.display = "flex";
        });
    }

    if(btnCancelGame) {
        btnCancelGame.addEventListener("click", () => {
            formGame.style.display = "none";
            adminGamesList.style.display = "flex";
            const adminHeader = document.querySelector("#tab-game .admin-list-header");
            if(adminHeader) adminHeader.style.display = "flex";
        });
    }

    // Call renderAdminGamesList along with renderAdminPlayersList when admin modal opens
    renderAdminGamesList();

    // Patch formGame submit inside our script: We redefine it by replacing its old submit behavior, 
    // or we just define a new function but JavaScript prevents duplicate submit listeners easily if we just clone it.
    // Instead of cloning, we can just intercept inside. Wait, the old listener still exists. We should let javascript handle the old one but fix its code directly using regex before this block. I'll add a regex replacement later.

    // --- MEDIA ADMIN LOGIC ---
    const adminMediaList = document.getElementById("admin-media-list");
    const formMedia = document.getElementById("form-media");
    const btnNewMedia = document.getElementById("btn-new-media");
    const btnCancelMedia = document.getElementById("btn-cancel-media");

    function renderAdminMediaList() {
        if(!adminMediaList) return;
        adminMediaList.innerHTML = "";
        mediaItems.forEach((m, idx) => {
            const isVideo = m.type === "video" || m.src.startsWith("data:video");
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.style.flexDirection = "column";
            item.style.alignItems = "flex-start";
            
            item.innerHTML = `
                <div style="display: flex; gap: 10px; width: 100%; margin-bottom: 5px; align-items: center;">
                    <div style="width: 50px; height: 50px; background: #000; overflow: hidden; border-radius: 5px;">
                        ${isVideo ? `<video src="${m.src}" style="width:100%; height:100%; object-fit:cover;"></video>` : `<img src="${m.src}" style="width:100%; height:100%; object-fit:cover;">`}
                    </div>
                    <div class="admin-list-item-info">
                        <strong>${m.team ? m.team : "Ambos"}</strong>
                    </div>
                </div>
                <div class="admin-list-actions" style="width: 100%; justify-content: flex-end;">
                    <button type="button" class="btn-delete-media" data-index="${idx}" title="Eliminar"><i class="fas fa-trash"></i></button>
                </div>
            `;
            adminMediaList.appendChild(item);
        });

        adminMediaList.querySelectorAll(".btn-delete-media").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = parseInt(e.currentTarget.getAttribute("data-index"));
                if(confirm("Â¿Eliminar este archivo?")) {
                    mediaItems.splice(idx, 1);
                    saveMediaToLocalStorage();
                    renderMedia();
                    renderAdminMediaList();
                }
            });
        });
    }

    if(btnNewMedia) {
        btnNewMedia.addEventListener("click", () => {
            formMedia.reset();
            document.getElementById("m-id").value = "";
            adminMediaList.style.display = "none";
            const adminHeader = document.querySelector("#tab-media .admin-list-header");
            if(adminHeader) adminHeader.style.display = "none";
            formMedia.style.display = "flex";
        });
    }

    if(btnCancelMedia) {
        btnCancelMedia.addEventListener("click", () => {
            formMedia.style.display = "none";
            adminMediaList.style.display = "grid";
            const adminHeader = document.querySelector("#tab-media .admin-list-header");
            if(adminHeader) adminHeader.style.display = "flex";
        });
    }

    if(formMedia) {
        formMedia.addEventListener("submit", (e) => {
            e.preventDefault();
            const fileInput = document.getElementById("m-file");
            const team = document.getElementById("m-team").value;

            if(fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                const type = file.type.startsWith("video") ? "video" : "image";
                const reader = new FileReader();
                reader.onload = function(evt) {
                    mediaItems.unshift({ type: type, src: evt.target.result, team: team });
                    saveMediaToLocalStorage();
                    renderMedia();
                    renderAdminMediaList();
                    btnCancelMedia.click();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    renderAdminMediaList();

    // Media Filter and View Toggle
    const mediaViewBtn = document.getElementById('btn-media-view');
    if(mediaViewBtn) {
        mediaViewBtn.addEventListener('click', () => {
            const grid = document.getElementById('media-grid');
            if(grid) {
                grid.classList.toggle('individual-view');
                if(grid.classList.contains('individual-view')) {
                    mediaViewBtn.innerHTML = '<i class="fas fa-th"></i> Vista Mosaico';
                } else {
                    mediaViewBtn.innerHTML = '<i class="fas fa-th-large"></i> Vista Individual';
                }
            }
        });
    }

    // Player Profile Modal Function
    window.openPlayerProfile = function(id) {
        const p = players.find(x => x.id === id);
        if(!p) return;

        const modal = document.getElementById("player-profile-modal");
        const content = document.getElementById("player-profile-content");

        content.innerHTML = `
            <div style="text-align: center;">
                <h2 style="font-family: var(--font-college); color: var(--accent-gold); font-size: 2.5rem; letter-spacing: 2px; margin-bottom: 0;">#${p.number} ${p.name}</h2>
                <h4 style="color: var(--text-main); margin-bottom: 1rem; font-size: 1.1rem; opacity: 0.9;">${p.position} | ${p.team}</h4>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--theme-main); font-family: var(--font-college); font-size: 1.5rem; margin-bottom: 0.5rem; letter-spacing: 1px;">Detalles</h4>
                <p><strong>Temporada Reclutamiento:</strong> ${p.recruitedSeason || 'Desconocido'}</p>
                <p><strong>Temporadas Jugadas:</strong> ${p.seasons ? p.seasons.join(', ') : 'Ninguna'}</p>
                <p><strong>Miembro HOF:</strong> ${p.isHOF ? 'SÃ­ (' + p.hofYear + ')' : 'No'}</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px;">
                <h4 style="color: var(--theme-main); font-family: var(--font-college); font-size: 1.5rem; margin-bottom: 0.5rem; letter-spacing: 1px;">PalmarÃ©s</h4>
                <p style="white-space: pre-line; color: var(--text-muted);">${p.palmares || 'Sin registros adicionales.'}</p>
            </div>
        `;

        modal.style.display = "block";
    };

    const closeProfileModal = document.querySelector(".close-profile-modal");
    if(closeProfileModal) {
        closeProfileModal.addEventListener("click", () => {
            document.getElementById("player-profile-modal").style.display = "none";
        });
    }
    
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("player-profile-modal");
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });


});

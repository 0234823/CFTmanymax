document.addEventListener("DOMContentLoaded", () => {
    
    // --- Initial Data Defaults ---
    const defaultPlayers = [
        {
            id: Date.now() + 1,
            name: "Manuel Silva",
            nickname: "Flash",
            number: 11,
            position: "WR",
            status: "active",
            team: "Verdes",
            seasons: ["Primavera 2024", "Invierno 2024", "Verano 2025"],
            isHOF: false,
            imgUrl: "logo-verde.png",
            recruitedSeason: "Primavera 2024",
            palmares: ""
        },
        {
            id: Date.now() + 2,
            name: "Diego Ortiz",
            nickname: "Cañón",
            number: 12,
            position: "QB",
            status: "active",
            team: "Verdes",
            seasons: ["Verano 2025", "Invierno 2026"],
            isHOF: false,
            imgUrl: "logo-verde.png",
            recruitedSeason: "Primavera 2024",
            palmares: ""
        },
        {
            id: Date.now() + 3,
            name: "Jorge Torres",
            nickname: "Roca",
            number: 55,
            position: "R",
            status: "active",
            team: "Rojos",
            seasons: ["Primavera 2021", "Invierno 2023"],
            isHOF: false,
            imgUrl: "logo-rojo.png",
            recruitedSeason: "Primavera 2021",
            palmares: ""
        },
        {
            id: Date.now() + 4,
            name: "Carlos Ramírez",
            nickname: "Speedy",
            number: 21,
            position: "RB",
            status: "past",
            team: "Verdes",
            seasons: ["Primavera 2021", "Invierno 2023"],
            isHOF: true,
            hofYear: "Clase 2023",
            hofDesc: "Corredor estrella. Campeón anotador en 3 temporadas consecutivas.",
            imgUrl: "logo-verde.png",
            recruitedSeason: "Primavera 2024",
            palmares: ""
        }
    ];

    const defaultGames = [
        { id: Date.now() + 6, opponent: "vs. Cuervos", date: "2024-10-24", time: "20:00", location: "Campo Deportivo Central", result: "", status: "upcoming", season: "Otoño 2024", type: "Jornada 1", team: "Ambos" },
        { id: Date.now() + 7, opponent: "vs. Titanes", date: "2024-10-31", time: "19:30", location: "Estadio Norte", result: "", status: "upcoming", season: "Otoño 2024", type: "Jornada 2", team: "Verdes" },
        { id: Date.now() + 8, opponent: "vs. Bulldogs", date: "2024-10-17", time: "", location: "Estadio Norte", result: "24 - 14", status: "result-win", season: "Otoño 2024", type: "Semifinal", team: "Ambos" }
    ];

    const defaultHofResults = [
        { id: Date.now() + 10, season: "Invierno 2024", team: "Chilaquiles Rojos", title: "Campeones", desc: "El origen de una nueva leyenda, el primer campeonato." },
        { id: Date.now() + 11, season: "Otoño 2023", team: "Chilaquiles Verdes", title: "Semifinal vs Osos", desc: "Un juego reñido que definió el pase a finales." },
        { id: Date.now() + 12, season: "Verano 2022", team: "Chilaquiles Verdes", title: "Campeones", desc: "Dominio absoluto del equipo original." },
        { id: Date.now() + 13, season: "Primavera 2021", team: "Chilaquiles Verdes", title: "Fundación", desc: "El inicio de CFT en las ligas competitivas." }
    ];

    // Load from LocalStorage
    let players = JSON.parse(localStorage.getItem('cft_players')) || defaultPlayers;
    let games = JSON.parse(localStorage.getItem('cft_games')) || defaultGames;
    let mediaItems = JSON.parse(localStorage.getItem('cft_media')) || [];
    let hofResults = JSON.parse(localStorage.getItem('cft_hofResults')) || defaultHofResults;
    
    // Asignar IDs a resultados heredados si no tienen
    hofResults.forEach((h, index) => {
        if(!h.id) h.id = Date.now() + 1000 + index;
    });

    function saveToLocalStorage() {
        localStorage.setItem('cft_players', JSON.stringify(players));
        localStorage.setItem('cft_games', JSON.stringify(games));
        localStorage.setItem('cft_media', JSON.stringify(mediaItems));
        localStorage.setItem('cft_hofResults', JSON.stringify(hofResults));
    }

    // --- Populate Seasons Checkboxes ---
    const seasonsGrid = document.getElementById('p-seasons-grid');
    const availableSeasons = [];
    const seasonTypes = ["Invierno", "Primavera", "Verano", "Otoño"];
    for (let year = 2021; year <= 2026; year++) {
        for (let type of seasonTypes) {
            availableSeasons.push(`${type} ${year}`);
        }
    }

    if(seasonsGrid) {
        availableSeasons.forEach(season => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.color = 'var(--text-muted)';
            label.style.fontSize = '0.85rem';
            label.innerHTML = `<input type="checkbox" value="${season}" name="player-seasons" style="margin-right: 5px;"> ${season}`;
            seasonsGrid.appendChild(label);
        });
    }

    // --- Theme Switcher ---
    const btnVerde = document.getElementById("btn-verde");
    const btnRojo = document.getElementById("btn-rojo");
    const body = document.body;

    if(btnVerde && btnRojo) {
        btnVerde.addEventListener("click", () => {
            body.classList.remove("theme-rojo");
            btnVerde.classList.add("active");
            btnRojo.classList.remove("active");
            document.getElementById("historia-verdes").style.display = "block";
            document.getElementById("historia-rojos").style.display = "none";
            renderPlayers();
            renderMedia();
            renderGames();
        });

        btnRojo.addEventListener("click", () => {
            body.classList.add("theme-rojo");
            btnRojo.classList.add("active");
            btnVerde.classList.remove("active");
            document.getElementById("historia-verdes").style.display = "none";
            document.getElementById("historia-rojos").style.display = "block";
            renderPlayers();
            renderMedia();
            renderGames();
        });
    }

    // --- Roster Filters & Rendering ---
    const playersContainer = document.getElementById("players-container");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const sortSelect = document.getElementById("sort-select");
    const posSelect = document.getElementById("pos-select");

    let currentFilter = "active"; // 'active' or 'past'
    let currentSort = "name-asc";
    let currentPos = "all";

    if(filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                filterBtns.forEach(b => b.classList.remove("active"));
                e.target.classList.add("active");
                currentFilter = e.target.getAttribute("data-filter");
                renderPlayers();
            });
        });
    }

    if(sortSelect) sortSelect.addEventListener("change", (e) => { currentSort = e.target.value; renderPlayers(); });
    if(posSelect) posSelect.addEventListener("change", (e) => { currentPos = e.target.value; renderPlayers(); });

    function getActiveThemeTeam() {
        return body.classList.contains("theme-rojo") ? "Rojos" : "Verdes";
    }

    function renderPlayers() {
        if(!playersContainer) return;
        const currentThemeTeam = getActiveThemeTeam();
        
        let filtered = players.filter(p => p.status === currentFilter);
        
        // Filter by team match (Ambos fits in both)
        filtered = filtered.filter(p => p.team === currentThemeTeam || p.team === "Ambos");

        // Filter by position
        if (currentPos !== "all") {
            if (currentPos === "DEF") {
                filtered = filtered.filter(p => ["LB", "CB", "R"].includes(p.position));
            } else if (currentPos === "RB") {
                filtered = filtered.filter(p => ["RB", "HB"].includes(p.position));
            } else {
                filtered = filtered.filter(p => p.position === currentPos);
            }
        }

        // Sort
        filtered.sort((a, b) => {
            if (currentSort === "name-asc") return a.name.localeCompare(b.name);
            if (currentSort === "name-desc") return b.name.localeCompare(a.name);
            if (currentSort === "number-asc") return (parseInt(a.number) || 0) - (parseInt(b.number) || 0);
            return 0;
        });

        playersContainer.innerHTML = "";
        
        if (filtered.length === 0) {
            playersContainer.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1; text-align:center;">No hay jugadores en esta categoría.</p>`;
            return;
        }

        filtered.forEach(p => {
            const starsHTML = Array(parseInt(p.stars) || 3).fill('<i class="fas fa-star" style="color: var(--accent-gold); font-size:0.8rem;"></i>').join('');
            const isCapt = p.isCaptain ? '<span style="background:var(--accent-gold); color:#000; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:0.8rem; margin-left:5px;">C</span>' : '';
            
            const card = document.createElement("div");
            card.className = "player-card";
            card.onclick = () => window.openPlayerProfile(p.id);
            card.innerHTML = `
                <div style="width: 100%; height: 250px; overflow: hidden; border-radius: 8px; margin-bottom: 1rem;">
                    <img src="${p.imgUrl || 'logo-'+currentThemeTeam.toLowerCase()+'.png'}" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div style="margin-bottom:0.5rem;">${starsHTML}</div>
                <h3 style="font-family: var(--font-college); color: #fff; font-size: 1.5rem; margin:0;">${p.name} ${isCapt}</h3>
                <span style="color: var(--text-muted); font-size: 0.9rem;">#${p.number} | ${p.position}</span>
            `;
            playersContainer.appendChild(card);
        });
    }

    // --- Player Profile Modal Function ---
    window.openPlayerProfile = function(id) {
        const p = players.find(x => String(x.id) === String(id));
        if(!p) return;

        const modal = document.getElementById("player-profile-modal");
        const content = document.getElementById("player-profile-content");
        if(!modal || !content) return;

        content.innerHTML = `
            <div style="text-align: center;">
                <h2 style="font-family: var(--font-college); color: var(--accent-gold); font-size: 2.5rem; letter-spacing: 2px; margin-bottom: 0;">#${p.number} ${p.name}</h2>
                <h4 style="color: var(--text-main); margin-bottom: 1rem; font-size: 1.1rem; opacity: 0.9;">${p.position} | ${p.team}</h4>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <h4 style="color: var(--theme-main); font-family: var(--font-college); font-size: 1.5rem; margin-bottom: 0.5rem; letter-spacing: 1px;">Detalles</h4>
                <p><strong>Temporada Reclutamiento:</strong> ${p.recruitedSeason || 'Desconocido'}</p>
                <p><strong>Temporadas Jugadas:</strong> ${p.seasons ? p.seasons.join(', ') : 'Ninguna'}</p>
                <p><strong>Miembro HOF:</strong> ${p.isHOF ? 'Sí (' + p.hofYear + ')' : 'No'}</p>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px;">
                <h4 style="color: var(--theme-main); font-family: var(--font-college); font-size: 1.5rem; margin-bottom: 0.5rem; letter-spacing: 1px;">Palmarés</h4>
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

    // --- Games & Calendar Rendering ---
    const gamesContainer = document.getElementById("games-container");
    const calendarBtnContainer = document.getElementById("calendar-btn-container");
    const btnShowAllGames = document.getElementById("btn-show-all-games");
    let showAllGames = false;
    
    if (btnShowAllGames) {
        btnShowAllGames.addEventListener('click', () => {
            showAllGames = true;
            renderGames();
            if(calendarBtnContainer) calendarBtnContainer.style.display = 'none';
        });
    }

    function renderGames() {
        if(!gamesContainer) return;
        const currentThemeTeam = getActiveThemeTeam();
        let filteredGames = games.filter(g => !g.team || g.team === currentThemeTeam || g.team === "Ambos");
        
        // Sort specifically: Newest date first
        filteredGames.sort((a,b) => new Date(b.date) - new Date(a.date));
        
        gamesContainer.innerHTML = "";
        
        if(filteredGames.length === 0) {
            gamesContainer.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1; text-align:center;">No hay juegos programados para la selección actual.</p>`;
            return;
        }

        let displayGames = showAllGames ? filteredGames : filteredGames.slice(0, 3);
        if(!showAllGames && filteredGames.length > 3 && calendarBtnContainer) {
            calendarBtnContainer.style.display = 'block';
        } else if (calendarBtnContainer) {
            calendarBtnContainer.style.display = 'none';
        }

        displayGames.forEach(g => {
            let statusBadge = "";
            let borderColor = "rgba(255,255,255,0.1)";
            if(g.status === "result-win") {
                statusBadge = `<span style="background: var(--cft-verde-main); color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">VICTORIA${g.result ? ' ' + g.result : ''}</span>`;
                borderColor = "var(--cft-verde-main)";
            } else if(g.status === "result-loss") {
                statusBadge = `<span style="background: var(--cft-rojo-main); color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">DERROTA${g.result ? ' ' + g.result : ''}</span>`;
                borderColor = "var(--cft-rojo-main)";
            } else {
                statusBadge = `<span style="background: rgba(255,255,255,0.1); color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold;">PRÓXIMO</span>`;
            }

            const el = document.createElement("div");
            el.className = "game-card";
            el.style.cssText = `background: rgba(255,255,255,0.03); border: 1px solid ${borderColor}; border-radius: 8px; padding: 1.5rem; text-align: center; display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;`;
            el.innerHTML = `
                <div>${statusBadge}</div>
                <h3 style="font-family: var(--font-college); color: #fff; font-size: 1.8rem; letter-spacing: 1px; margin: 0;">${g.opponent}</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: -10px; margin-bottom: 5px;">${g.season || ''} <span style="color:var(--accent-gold); font-weight:600;">${g.type ? '| ' + g.type : ''}</span></p>
                <div style="color: var(--accent-gold); font-size: 1.1rem; font-weight: 600;">
                    <i class="far fa-calendar-alt"></i> ${g.date} ${g.time ? `<br><i class="far fa-clock"></i> `+g.time : ''}
                </div>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0;"><i class="fas fa-map-marker-alt"></i> ${g.location}</p>
            `;
            gamesContainer.appendChild(el);
        });
    }

    // --- Media Rendering ---
    const mediaGrid = document.getElementById("media-grid");
    
    function renderMedia() {
        if(!mediaGrid) return;
        const currentThemeTeam = getActiveThemeTeam();
        mediaGrid.innerHTML = "";
        
        let filteredMedia = mediaItems.filter(m => m.team === currentThemeTeam || m.team === "Ambos");

        if (filteredMedia.length === 0) {
            mediaGrid.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1;">No hay media disponible.</p>`;
            return;
        }

        filteredMedia.forEach((m, idx) => {
            const isVideo = m.type === "video" || m.src.startsWith("data:video");
            const el = document.createElement("div");
            el.className = "media-item";
            el.style.cssText = `width: 100%; aspect-ratio: 1; border-radius: 8px; overflow: hidden; cursor: pointer; border: 1px solid rgba(255,255,255,0.1);`;
            
            if(isVideo) {
                el.innerHTML = `<video src="${m.src}" style="width:100%; height:100%; object-fit:cover;" muted></video><div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:white; font-size:2rem; pointer-events:none; opacity:0.8;"><i class="fas fa-play-circle"></i></div>`;
            } else {
                el.innerHTML = `<img src="${m.src}" style="width:100%; height:100%; object-fit:cover;">`;
            }
            
            el.onclick = () => openLightbox(idx, filteredMedia);
            
            // Re-apply position relative for the play button absolute positioning to work over it
            el.style.position = "relative"; 
            
            mediaGrid.appendChild(el);
        });
    }

    // --- Hall Of Fame Rendering ---
    const hofContainer = document.getElementById("hof-container");
    
    function renderHOF() {
        if(!hofContainer) return;
        hofContainer.innerHTML = "";
        const hofPlayers = players.filter(p => p.isHOF);
        
        if (hofPlayers.length === 0) {
            hofContainer.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1;">No hay miembros del Salón de la Fama aún.</p>`;
            return;
        }

        hofPlayers.forEach(p => {
            const el = document.createElement("div");
            el.className = "hof-card";
            el.style.cssText = `background: rgba(255,255,255,0.03); border: 1px solid var(--accent-gold); border-radius: 8px; padding: 1.5rem; text-align: center;`;
            el.innerHTML = `
                <div style="width: 100px; height: 100px; overflow: hidden; border-radius: 50%; border: 3px solid var(--accent-gold); margin: 0 auto 1rem;">
                    <img src="${p.imgUrl || 'logo-verde.png'}" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <h3 style="font-family: var(--font-college); color: #fff; font-size: 1.5rem; margin:0;">${p.name}</h3>
                <h4 style="color: var(--accent-gold); margin-bottom: 0.5rem;">${p.hofYear}</h4>
                <p style="color: var(--text-muted); font-size: 0.9rem;">${p.hofDesc || ''}</p>
            `;
            hofContainer.appendChild(el);
        });
    }

    // HOF Tabs logic
    const hofTabBtns = document.querySelectorAll('.hof-tab-btn');
    const hofTabContents = document.querySelectorAll('.hof-tab-content');
    
    if(hofTabBtns) {
        hofTabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                hofTabBtns.forEach(b => b.classList.remove('active'));
                hofTabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                const targetId = btn.getAttribute('data-hoftab');
                const content = document.getElementById(targetId);
                if(content) content.classList.add('active');
            });
        });
    }

    // --- Media Lightbox ---
    const lightboxModal = document.getElementById("lightbox-modal");
    const lightboxContainer = document.getElementById("lightbox-media-container");
    const closeLightboxBtn = document.querySelector(".close-lightbox");
    let lbMediaList = [];
    let lbIndex = 0;

    function openLightbox(index, mediaList) {
        lbMediaList = mediaList;
        lbIndex = index;
        updateLightbox();
        if(lightboxModal) lightboxModal.style.display = "block";
    }

    function updateLightbox() {
        if(!lightboxContainer || lbMediaList.length === 0) return;
        const m = lbMediaList[lbIndex];
        const isVideo = m.type === "video" || m.src.startsWith("data:video");
        
        lightboxContainer.innerHTML = isVideo ? 
            `<video src="${m.src}" controls autoplay style="max-width:100%; max-height:80vh; border-radius:8px;"></video>` : 
            `<img src="${m.src}" style="max-width:100%; max-height:80vh; border-radius:8px;">`;
    }

    if(closeLightboxBtn) {
        closeLightboxBtn.onclick = () => {
            if(lightboxModal) lightboxModal.style.display = "none";
            lightboxContainer.innerHTML = ""; // Stop videos
        };
    }

    const lbPrev = document.getElementById("lightbox-prev");
    const lbNext = document.getElementById("lightbox-next");
    if(lbPrev) lbPrev.onclick = () => { lbIndex = (lbIndex > 0) ? lbIndex - 1 : lbMediaList.length - 1; updateLightbox(); };
    if(lbNext) lbNext.onclick = () => { lbIndex = (lbIndex < lbMediaList.length - 1) ? lbIndex + 1 : 0; updateLightbox(); };

    // --- Global Modal Close ---
    window.addEventListener("click", (e) => {
        if(e.target === lightboxModal) {
            lightboxModal.style.display = "none";
            lightboxContainer.innerHTML = "";
        }
    });

    // ============================================
    // === ADMIN SECTION & MODALS ===
    // ============================================

    const btnAdmin = document.getElementById("btn-admin");
    const adminAuthModal = document.getElementById("admin-auth-modal");
    const modalCloseBtns = document.querySelectorAll(".close-modal");
    
    if(btnAdmin) {
        btnAdmin.addEventListener("click", (e) => {
            e.preventDefault();
            adminAuthModal.style.display = "block";
            document.getElementById("admin-password").value = "";
            document.getElementById("auth-error").style.display = "none";
        });
    }

    if(modalCloseBtns) {
        modalCloseBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.target.closest('.modal').style.display = "none";
            });
        });
    }

    const btnAuthSubmit = document.getElementById("btn-auth-submit");
    const adminModal = document.getElementById("admin-modal");

    if(btnAuthSubmit) {
        btnAuthSubmit.addEventListener("click", () => {
            const pwd = document.getElementById("admin-password").value;
            // Simple hardcoded key for front-end demonstration or "cft2024"
            if(pwd === "cft" || pwd === "cft2024" || pwd === "admin") {
                adminAuthModal.style.display = "none";
                adminModal.style.display = "block";
                
                renderAdminPlayersList();
                renderAdminGamesList();
                renderAdminMediaList();
                if(typeof renderAdminHofResultsList === "function") renderAdminHofResultsList();
            } else {
                document.getElementById("auth-error").style.display = "block";
            }
        });
    }

    // Admin Tabs
    const adminTabBtns = document.querySelectorAll(".tab-btn");
    if(adminTabBtns) {
        adminTabBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                adminTabBtns.forEach(b => b.classList.remove("active"));
                document.querySelectorAll(".admin-tabs ~ .tab-content").forEach(c => c.classList.remove("active"));
                e.target.classList.add("active");
                document.getElementById(e.target.getAttribute("data-tab")).classList.add("active");
            });
        });
    }

    // --- FORM LOGIC: PLAYER ---
    const adminPlayersList = document.getElementById("admin-players-list");
    const formPlayer = document.getElementById("form-player");
    const btnNewPlayer = document.getElementById("btn-new-player");
    const btnCancelPlayer = document.getElementById("btn-cancel-player");

    function renderAdminPlayersList() {
        if(!adminPlayersList) return;
        adminPlayersList.innerHTML = "";
        players.forEach(p => {
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.style.cssText = `background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); padding:0.8rem; border-radius:8px; display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;`;
            item.innerHTML = `
                <div><strong>${p.name}</strong> <span style="color:var(--text-muted);">#${p.number}</span></div>
                <div>
                    <button class="btn-edit-player" data-id="${p.id}" style="background:transparent; color:white; border:none; cursor:pointer; margin-right:10px; font-size:1rem;">✏️ Editar</button>
                    <button class="btn-delete-player" data-id="${p.id}" style="background:transparent; color:var(--cft-rojo-main); border:none; cursor:pointer; font-size:1rem;">🗑️ Borrar</button>
                </div>
            `;
            adminPlayersList.appendChild(item);
        });

        document.querySelectorAll(".btn-edit-player").forEach(btn => {
            btn.onclick = (e) => editPlayer(parseInt(e.currentTarget.getAttribute("data-id")));
        });
        document.querySelectorAll(".btn-delete-player").forEach(btn => {
            btn.onclick = (e) => deletePlayer(parseInt(e.currentTarget.getAttribute("data-id")));
        });
    }

    const hofCheckbox = document.getElementById("p-ishof");
    const hofFields = document.getElementById("p-hof-fields");
    if(hofCheckbox && hofFields) {
        hofCheckbox.addEventListener("change", (e) => {
            hofFields.style.display = e.target.checked ? "flex" : "none";
        });
    }

    if(btnNewPlayer) {
        btnNewPlayer.onclick = () => {
            formPlayer.reset();
            document.getElementById("p-id").value = "";
            if(hofFields) hofFields.style.display = "none";
            adminPlayersList.style.display = "none";
            document.querySelector("#tab-player .admin-list-header").style.display = "none";
            formPlayer.style.display = "block";
        };
    }

    if(btnCancelPlayer) {
        btnCancelPlayer.onclick = () => {
            formPlayer.style.display = "none";
            adminPlayersList.style.display = "flex";
            document.querySelector("#tab-player .admin-list-header").style.display = "flex";
        };
    }

    function deletePlayer(id) {
        if(confirm("¿Seguro que deseas eliminar este jugador?")) {
            players = players.filter(p => String(p.id) !== String(id));
            saveToLocalStorage();
            renderPlayers();
            renderHOF();
            renderAdminPlayersList();
        }
    }

    function editPlayer(id) {
        const p = players.find(x => String(x.id) === String(id));
        if(!p) return;
        
        document.getElementById("p-id").value = p.id;
        document.getElementById("p-name").value = p.name;
        document.getElementById("p-nickname").value = p.nickname || "";
        document.getElementById("p-number").value = p.number;
        document.getElementById("p-position").value = p.position;
        document.getElementById("p-status").value = p.status;
        document.getElementById("p-team").value = p.team;
        document.getElementById("p-stars").value = p.stars || 3;
        document.getElementById("p-captain").checked = !!p.isCaptain;
        document.getElementById("p-recruited").value = p.recruitedSeason || "";
        document.getElementById("p-palmares").value = p.palmares || "";
        
        document.getElementById("p-ishof").checked = p.isHOF;
        if(hofFields) hofFields.style.display = p.isHOF ? "flex" : "none";
        document.getElementById("p-hof-year").value = p.hofYear || "";
        document.getElementById("p-hof-desc").value = p.hofDesc || "";

        // Checkboxes
        document.querySelectorAll("input[name='player-seasons']").forEach(cb => {
            cb.checked = (p.seasons && p.seasons.includes(cb.value));
        });

        adminPlayersList.style.display = "none";
        document.querySelector("#tab-player .admin-list-header").style.display = "none";
        formPlayer.style.display = "block";
    }

    if(formPlayer) {
        formPlayer.addEventListener("submit", (e) => {
            e.preventDefault();
            const pId = document.getElementById("p-id").value;
            
            // Get seasons
            const checkedSeasons = [];
            document.querySelectorAll("input[name='player-seasons']:checked").forEach(cb => checkedSeasons.push(cb.value));
            
            // Get photo if any
            const photoFile = document.getElementById("p-photo").files[0];
            
            const pData = {
                name: document.getElementById("p-name").value,
                nickname: document.getElementById("p-nickname").value,
                number: document.getElementById("p-number").value,
                position: document.getElementById("p-position").value,
                status: document.getElementById("p-status").value,
                team: document.getElementById("p-team").value,
                stars: document.getElementById("p-stars").value,
                isCaptain: document.getElementById("p-captain").checked,
                recruitedSeason: document.getElementById("p-recruited").value,
                palmares: document.getElementById("p-palmares").value,
                isHOF: document.getElementById("p-ishof").checked,
                hofYear: document.getElementById("p-hof-year").value,
                hofDesc: document.getElementById("p-hof-desc").value,
                seasons: checkedSeasons
            };
            
            // Helper to final save
            const finishPlayerSave = (imgUrl) => {
                if(pId) {
                    const p = players.find(x => String(x.id) === String(pId));
                    Object.assign(p, pData);
                    if(imgUrl) p.imgUrl = imgUrl; // update only if new image
                } else {
                    pData.id = Date.now();
                    pData.imgUrl = imgUrl || (pData.team === 'Rojos' ? 'logo-rojo.png' : 'logo-verde.png');
                    players.push(pData);
                }
                saveToLocalStorage();
                renderPlayers();
                renderHOF();
                renderAdminPlayersList();
                if(btnCancelPlayer) btnCancelPlayer.click();
            };

            if(photoFile) {
                const reader = new FileReader();
                reader.onload = (evt) => finishPlayerSave(evt.target.result);
                reader.readAsDataURL(photoFile);
            } else {
                finishPlayerSave(null);
            }
        });
    }

    // --- FORM LOGIC: GAME ---
    const adminGamesList = document.getElementById("admin-games-list");
    const formGame = document.getElementById("form-game");
    const btnNewGame = document.getElementById("btn-new-game");
    const btnCancelGame = document.getElementById("btn-cancel-game");
    const btnDeleteGameForm = document.getElementById("btn-delete-game-form");

    function renderAdminGamesList() {
        if(!adminGamesList) return;
        adminGamesList.innerHTML = "";
        games.forEach(g => {
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.style.cssText = `background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); padding:0.8rem; border-radius:8px; display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;`;
            item.innerHTML = `
                <div><strong>${g.opponent}</strong> <span style="color:var(--text-muted);">(${g.date})</span></div>
                <div>
                    <button class="btn-edit-game" data-id="${g.id}" style="background:transparent; color:white; border:none; cursor:pointer; margin-right:10px; font-size:1rem;">✏️ Editar</button>
                    <button class="btn-delete-game" data-id="${g.id}" style="background:transparent; color:var(--cft-rojo-main); border:none; cursor:pointer; font-size:1rem;">🗑️ Borrar</button>
                </div>
            `;
            adminGamesList.appendChild(item);
        });

        document.querySelectorAll(".btn-edit-game").forEach(btn => {
            btn.onclick = (e) => editGame(parseInt(e.currentTarget.getAttribute("data-id")));
        });
        document.querySelectorAll(".btn-delete-game").forEach(btn => {
            btn.onclick = (e) => deleteGame(parseInt(e.currentTarget.getAttribute("data-id")));
        });
    }

    if(btnNewGame) {
        btnNewGame.onclick = () => {
            formGame.reset();
            document.getElementById("g-id").value = "";
            adminGamesList.style.display = "none";
            document.querySelector("#tab-game .admin-list-header").style.display = "none";
            if(btnDeleteGameForm) btnDeleteGameForm.style.display = "none";
            formGame.style.display = "block";
        };
    }

    if(btnCancelGame) {
        btnCancelGame.onclick = () => {
            formGame.style.display = "none";
            adminGamesList.style.display = "flex";
            document.querySelector("#tab-game .admin-list-header").style.display = "flex";
        };
    }

    function editGame(id) {
        const g = games.find(x => String(x.id) === String(id));
        if(!g) return;
        
        document.getElementById("g-id").value = g.id;
        document.getElementById("g-opponent").value = g.opponent;
        document.getElementById("g-date").value = g.date;
        document.getElementById("g-time").value = g.time || "";
        document.getElementById("g-location").value = g.location || "";
        document.getElementById("g-result").value = g.result || "";
        document.getElementById("g-status").value = g.status;
        document.getElementById("g-season").value = g.season || "";
        document.getElementById("g-type").value = g.type || "";
        document.getElementById("g-team").value = g.team || "Ambos";
        
        adminGamesList.style.display = "none";
        document.querySelector("#tab-game .admin-list-header").style.display = "none";
        if(btnDeleteGameForm) btnDeleteGameForm.style.display = "block";
        formGame.style.display = "block";
    }

    function deleteGame(id) {
        if(confirm("¿Seguro que deseas eliminar este partido?")) {
            games = games.filter(g => String(g.id) !== String(id));
            saveToLocalStorage();
            renderGames();
            renderAdminGamesList();
        }
    }

    if(btnDeleteGameForm) {
        btnDeleteGameForm.onclick = () => {
            const id = document.getElementById("g-id").value;
            if(id) {
                if(confirm("¿Seguro que deseas eliminar este partido?")) {
                    games = games.filter(g => String(g.id) !== String(id));
                    saveToLocalStorage();
                    renderGames();
                    renderAdminGamesList();
                    btnCancelGame.click();
                }
            }
        };
    }

    if(formGame) {
        formGame.addEventListener("submit", (e) => {
            e.preventDefault();
            const gId = document.getElementById("g-id").value;
            const gData = {
                opponent: document.getElementById("g-opponent").value,
                date: document.getElementById("g-date").value,
                time: document.getElementById("g-time").value,
                location: document.getElementById("g-location").value,
                result: document.getElementById("g-result").value,
                status: document.getElementById("g-status").value,
                season: document.getElementById("g-season").value,
                type: document.getElementById("g-type").value,
                team: document.getElementById("g-team").value
            };

            if(gId) {
                const g = games.find(x => String(x.id) === String(gId));
                Object.assign(g, gData);
            } else {
                gData.id = Date.now();
                games.push(gData);
            }

            saveToLocalStorage();
            renderGames();
            renderAdminGamesList();
            btnCancelGame.click();
        });
    }

    // --- FORM LOGIC: MEDIA ---
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
            item.style.cssText = `background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); padding:0.5rem; border-radius:8px; display:flex; flex-direction:column; gap:5px;`;
            item.innerHTML = `
                <div style="width:100px; height:60px; background:#000; align-self:center; border-radius:4px; overflow:hidden;">
                     ${isVideo ? `<video src="${m.src}" style="width:100%; height:100%; object-fit:cover;"></video>` : `<img src="${m.src}" style="width:100%; height:100%; object-fit:cover;">`}
                </div>
                <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                    <span>${m.team || 'Ambos'}</span>
                    <button class="btn-delete-media" data-index="${idx}" style="background:transparent; color:var(--cft-rojo-main); border:none; cursor:pointer; font-size:1rem;">🗑️ Borrar</button>
                </div>
            `;
            adminMediaList.appendChild(item);
        });

        document.querySelectorAll(".btn-delete-media").forEach(btn => {
            btn.onclick = (e) => {
                if(confirm("¿Eliminar este archivo?")) {
                    mediaItems.splice(parseInt(e.currentTarget.getAttribute("data-index")), 1);
                    saveToLocalStorage();
                    renderMedia();
                    renderAdminMediaList();
                }
            };
        });
    }

    // Add media button from media section (front-end)
    const btnAddMediaFront = document.getElementById("btn-add-media");
    if(btnAddMediaFront) {
        btnAddMediaFront.addEventListener("click", () => {
             // force open admin modal for media insertion directly
             adminAuthModal.style.display = "block";
             document.getElementById("admin-password").value = "";
        });
    }

    if(btnNewMedia) {
        btnNewMedia.onclick = () => {
            formMedia.reset();
            adminMediaList.style.display = "none";
            document.querySelector("#tab-media .admin-list-header").style.display = "none";
            formMedia.style.display = "block";
        };
    }

    if(btnCancelMedia) {
        btnCancelMedia.onclick = () => {
            formMedia.style.display = "none";
            adminMediaList.style.display = "grid";
            document.querySelector("#tab-media .admin-list-header").style.display = "flex";
        };
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
                    saveToLocalStorage();
                    renderMedia();
                    renderAdminMediaList();
                    btnCancelMedia.click();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- FORM LOGIC: HOF RESULTS ---
    const adminHofresList = document.getElementById("admin-hofres-list");
    const formHofres = document.getElementById("form-hofres");
    const btnNewHofres = document.getElementById("btn-new-hofres");
    const btnCancelHofres = document.getElementById("btn-cancel-hofres");
    const btnDeleteHofresForm = document.getElementById("btn-delete-hofres-form");

    function renderAdminHofResultsList() {
        if(!adminHofresList) return;
        adminHofresList.innerHTML = "";
        hofResults.forEach(r => {
            const item = document.createElement("div");
            item.className = "admin-list-item";
            item.style.cssText = `background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); padding:0.8rem; border-radius:8px; display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;`;
            item.innerHTML = `
                <div><strong>${r.title}</strong> <span style="color:var(--text-muted);">(${r.season})</span></div>
                <div>
                    <button class="btn-edit-hofres" data-id="${r.id}" style="background:transparent; color:white; border:none; cursor:pointer; margin-right:10px; font-size:1rem;">✏️ Editar</button>
                    <button class="btn-delete-hofres" data-id="${r.id}" style="background:transparent; color:var(--cft-rojo-main); border:none; cursor:pointer; font-size:1rem;">🗑️ Borrar</button>
                </div>
            `;
            adminHofresList.appendChild(item);
        });

        document.querySelectorAll(".btn-edit-hofres").forEach(btn => {
            btn.onclick = (e) => editHofResult(parseInt(e.currentTarget.getAttribute("data-id")));
        });
        document.querySelectorAll(".btn-delete-hofres").forEach(btn => {
            btn.onclick = (e) => deleteHofResult(parseInt(e.currentTarget.getAttribute("data-id")));
        });
    }

    if(btnNewHofres) {
        btnNewHofres.onclick = () => {
            formHofres.reset();
            document.getElementById("r-id").value = "";
            adminHofresList.style.display = "none";
            document.querySelector("#tab-hofres .admin-list-header").style.display = "none";
            if(btnDeleteHofresForm) btnDeleteHofresForm.style.display = "none";
            formHofres.style.display = "block";
        };
    }

    if(btnCancelHofres) {
        btnCancelHofres.onclick = () => {
            formHofres.style.display = "none";
            adminHofresList.style.display = "flex";
            document.querySelector("#tab-hofres .admin-list-header").style.display = "flex";
        };
    }

    function editHofResult(id) {
        const r = hofResults.find(x => String(x.id) === String(id));
        if(!r) return;
        
        document.getElementById("r-id").value = r.id;
        document.getElementById("r-season").value = r.season;
        document.getElementById("r-team").value = r.team;
        document.getElementById("r-title").value = r.title;
        document.getElementById("r-desc").value = r.desc;
        
        adminHofresList.style.display = "none";
        document.querySelector("#tab-hofres .admin-list-header").style.display = "none";
        if(btnDeleteHofresForm) btnDeleteHofresForm.style.display = "block";
        formHofres.style.display = "block";
    }

    function deleteHofResult(id) {
        if(confirm("¿Seguro que deseas eliminar este resultado histórico?")) {
            hofResults = hofResults.filter(r => String(r.id) !== String(id));
            saveToLocalStorage();
            renderHofResults();
            renderAdminHofResultsList();
        }
    }

    if(btnDeleteHofresForm) {
        btnDeleteHofresForm.onclick = () => {
            const id = document.getElementById("r-id").value;
            if(id) {
                if(confirm("¿Seguro que deseas eliminar este resultado histórico?")) {
                    hofResults = hofResults.filter(r => String(r.id) !== String(id));
                    saveToLocalStorage();
                    renderHofResults();
                    renderAdminHofResultsList();
                    btnCancelHofres.click();
                }
            }
        };
    }

    if(formHofres) {
        formHofres.addEventListener("submit", (e) => {
            e.preventDefault();
            const rId = document.getElementById("r-id").value;
            const rData = {
                season: document.getElementById("r-season").value,
                team: document.getElementById("r-team").value,
                title: document.getElementById("r-title").value,
                desc: document.getElementById("r-desc").value
            };

            if(rId) {
                const r = hofResults.find(x => String(x.id) === String(rId));
                Object.assign(r, rData);
            } else {
                rData.id = Date.now();
                hofResults.push(rData);
            }

            saveToLocalStorage();
            renderHofResults();
            renderAdminHofResultsList();
            btnCancelHofres.click();
        });
    }

    // --- Render HOF Results (Torneos) ---
    const hwContainer = document.getElementById("resultados-container");
    function renderHofResults() {
        if(!hwContainer) return;
        hwContainer.innerHTML = "";
        
        if (hofResults.length === 0) {
            hwContainer.innerHTML = `<p style="color:var(--text-muted);">No hay resultados registrados.</p>`;
            return;
        }

        hofResults.forEach(r => {
            const hCard = document.createElement("div");
            hCard.style.cssText = `background: rgba(255,255,255,0.03); border-left: 4px solid var(--accent-gold); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem;`;
            hCard.innerHTML = `
                <h3 style="font-family: var(--font-college); color: #fff; font-size: 1.5rem; margin:0 0 0.5rem 0;">${r.season} - ${r.team}</h3>
                <h4 style="color: var(--accent-gold); margin-bottom: 0.5rem;">${r.title}</h4>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin:0;">${r.desc}</p>
            `;
            hwContainer.appendChild(hCard);
        });
    }

    // Initialize Front-end On Load
    renderPlayers();
    renderGames();
    renderMedia();
    renderHOF();
    renderHofResults();
});


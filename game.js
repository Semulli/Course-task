 // --- Data ---
      const POKEMONS = [
        { id: "bulbasaur", name: "Bulbasaur", emoji: "🌿" },
        { id: "charmander", name: "Charmander", emoji: "🔥" },
        { id: "squirtle", name: "Squirtle", emoji: "💧" },
      ];

    
      const WINS_AGAINST = {
        bulbasaur: "squirtle",
        charmander: "bulbasaur",
        squirtle: "charmander",
      };

      const choicesEl = document.getElementById("choices");
      const youEmoji = document.getElementById("youEmoji");
      const youName = document.getElementById("youName");
      const youHint = document.getElementById("youHint");

      const cpuEmoji = document.getElementById("cpuEmoji");
      const cpuName = document.getElementById("cpuName");
      const cpuHint = document.getElementById("cpuHint");

      const resultEl = document.getElementById("result");

      const youScoreEl = document.getElementById("youScore");
      const cpuScoreEl = document.getElementById("cpuScore");
      const resetBtn = document.getElementById("resetBtn");

      // --- BOM: localStorage ---
      const STORAGE_KEY = "pokemon_battle_state_v1";

      let state = loadState();
 

      // --- init ---
      renderChoices();
      syncScoreUI();

      resetBtn.addEventListener("click", () => {
        const ok = window.confirm("Score sıfırlansın?");
        if (!ok) return;

        state = { you: 0, cpu: 0 };
        saveState(state);

        youEmoji.textContent = "❔";
        youName.textContent = "—";
        youHint.textContent = "Select a pokemon";

        cpuEmoji.textContent = "❔";
        cpuName.textContent = "—";
        cpuHint.textContent = "Waiting...";

        setResult("Pick one to start!", "draw");
        syncScoreUI();
      });

      function renderChoices() {
        choicesEl.innerHTML = "";

        POKEMONS.forEach((p) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "choice";
          btn.innerHTML = `
            <div class="emoji">${p.emoji}</div>
            <div class="name">${p.name}</div>
            <div class="hint">Click to choose</div>
          `;

          btn.addEventListener("click", () => playRound(p.id));
          choicesEl.appendChild(btn);
        });
      }

      function playRound(playerId) {
        const player = POKEMONS.find((x) => x.id === playerId);
        const cpu = POKEMONS[Math.floor(Math.random() * POKEMONS.length)];

        // DOM update (your pick)
        youEmoji.textContent = player.emoji;
        youName.textContent = player.name;
        youHint.textContent = "Locked ✅";

        // CPU "thinking" (BOM: setTimeout)
        cpuHint.textContent = "Thinking...";
        cpuEmoji.textContent = "⏳";
        cpuName.textContent = "Comp";

        setTimeout(() => {
          cpuEmoji.textContent = cpu.emoji;
          cpuName.textContent = cpu.name;
          cpuHint.textContent = "Chosen ✅";

          const outcome = decideWinner(player.id, cpu.id);

          if (outcome === "win") {
            state.you++;

           


            

            setResult("You WIN! 🎉", "win");
          } else if (outcome === "lose") {
            state.cpu++;
            setResult("You LOSE 😅", "lose");
          } else {
            // draw
            setResult("DRAW 🤝", "draw");
          }

          saveState(state);
          syncScoreUI();
        }, 450);
      }

      function decideWinner(playerId, cpuId) {
        if (playerId === cpuId) return "draw";
        if (WINS_AGAINST[playerId] === cpuId) return "win";
        return "lose";
      }

      function setResult(text, type) {
        resultEl.textContent = text;
        resultEl.classList.remove("win", "lose", "draw");
        resultEl.classList.add(type);
      }

      function syncScoreUI() {
        youScoreEl.textContent = String(state.you ?? 0);
        cpuScoreEl.textContent = String(state.cpu ?? 0);
      }

      function loadState() {
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const parsed = raw ? JSON.parse(raw) : null;
          if (!parsed || typeof parsed !== "object") return { you: 0, cpu: 0 };
          return {
            you: Number(parsed.you) || 0,
            cpu: Number(parsed.cpu) || 0,
           
          };
        } catch {
          return { you: 0, cpu: 0}
        }
      }

      function saveState(s) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      }

     

     
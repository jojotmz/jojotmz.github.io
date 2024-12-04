function generateTeams() {
    const selectedPlayers = [];
    const checkboxes = document.querySelectorAll('#playerForm input[type="checkbox"]:checked');

    checkboxes.forEach(checkbox => {
        selectedPlayers.push(checkbox.value);
    });

    if (selectedPlayers.length < 4) {
        alert("Please select at least 4 players.");
        return;
    }

    let previousTeams = [];  // To keep track of previous team compositions
    let playerHistory = {};   // To track how many times a player was in each team

    const generateUniqueTeams = () => {
        let shuffled = [...selectedPlayers].sort(() => Math.random() - 0.5);

        // Create teams by splitting the shuffled array
        let teamA = shuffled.slice(0, Math.ceil(selectedPlayers.length / 2));
        let teamB = shuffled.slice(Math.ceil(selectedPlayers.length / 2));

        // Sort teams to ensure consistent ordering
        teamA.sort();
        teamB.sort();

        // Ensure no duplicate teams (players must not repeat in the same team as much as possible)
        while (isDuplicateTeam(teamA, teamB, previousTeams) || !maximizeTeamDiversity(teamA, teamB, playerHistory)) {
            shuffled = [...selectedPlayers].sort(() => Math.random() - 0.5);
            teamA = shuffled.slice(0, Math.ceil(selectedPlayers.length / 2));
            teamB = shuffled.slice(Math.ceil(selectedPlayers.length / 2));

            teamA.sort();
            teamB.sort();
        }

        return { teamA, teamB };
    };

    const isDuplicateTeam = (teamA, teamB, previousTeams) => {
        return previousTeams.some(({ teamA: prevTeamA, teamB: prevTeamB }) => {
            return (
                (arraysEqual(teamA, prevTeamA) && arraysEqual(teamB, prevTeamB)) ||
                (arraysEqual(teamA, prevTeamB) && arraysEqual(teamB, prevTeamA))
            );
        });
    };

    const maximizeTeamDiversity = (teamA, teamB, playerHistory) => {
        // Ensure maximum diversity by checking how many times a player has been in each team
        let diversityScore = 0;

        teamA.forEach(player => {
            if (!playerHistory[player]) playerHistory[player] = { teamA: 0, teamB: 0 };
            playerHistory[player].teamA++;
            diversityScore += playerHistory[player].teamA;
        });

        teamB.forEach(player => {
            if (!playerHistory[player]) playerHistory[player] = { teamA: 0, teamB: 0 };
            playerHistory[player].teamB++;
            diversityScore += playerHistory[player].teamB;
        });

        // We want a higher diversity score, meaning more even distribution
        return diversityScore > selectedPlayers.length * 2;  // Modify as needed for a higher threshold
    };

    const arraysEqual = (arr1, arr2) => {
        return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
    };

    let resultHTML = "";

    for (let i = 1; i <= 3; i++) {
        const { teamA, teamB } = generateUniqueTeams();
        resultHTML += `<div class="team-set"><h2>Set ${i}</h2>`;

        // Apply rainbow effect only to Alice and Bob if they're in the same team
        resultHTML += `<p><strong>Team A:</strong> ${highlightRainbow(teamA).join(', ')}</p>`;
        resultHTML += `<p><strong>Team B:</strong> ${highlightRainbow(teamB).join(', ')}</p></div>`;

        previousTeams.push({ teamA, teamB });
    }

    document.getElementById('teams').innerHTML = resultHTML;
}

// Function to apply rainbow animation only if Alice and Bob are together
function highlightRainbow(team) {
    return team.map(player => {
        // Check if Alice and Bob are in the same team
        if (team.includes("Alice") && team.includes("Bob") && (player === "Alice" || player === "Bob")) {
            return `<span class="rainbow">${player}</span>`; // Apply rainbow animation only to Alice and Bob
        }
        return player; // Keep other players without animation
    });
}

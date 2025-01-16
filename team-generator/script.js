/* GERADOR DE TIMES HONESTO PRO VOLEIZINHO

           .--._.--.
          ( O     O )
          /   . .   \
         .`._______.'.
        /(           )\
      _/  \  \   /  /  \_
   .~   `  \  \ /  /  '   ~.
  {    -.   \  V  /   .-    }
_ _`.    \  |  |  |  /    .'_ _
>_       _} |  |  | {_       _<
 /. - ~ ,_-'  .^.  `-_, ~ - .\
         '-'|/   \|`-`

@Author: jojotmz
 */

function generateTeams() {
    const players = Array.from(document.querySelectorAll('#playerForm input:checked')).map(input => input.value);
    const numPlayers = players.length;

    if (numPlayers < 6 || numPlayers > 10) {
        alert("Please select between 6 and 10 players.");
        return;
    }

    const teamsDiv = document.getElementById('teams');
    teamsDiv.innerHTML = '';

    let checkSize;
    switch (numPlayers) {
        case 6:
        case 7:
            checkSize = 3;
            break;
        case 8:
        case 9:
            checkSize = 4;
            break;
        case 10:
            checkSize = 5;
            break;
    }

    for (let matchNum = 1; matchNum <= 3; matchNum++) {
        let teamA = null;
        let teamB = null;
        let allTeamCombosForThisMatch = new Set();
        const teamSize = Math.floor(numPlayers / 2);
        shuffleArray(players);

        let possibleTeamsA = getCombinations(players, teamSize);
        for (let i = 0; i < 3; i++) {
            shuffleArray(possibleTeamsA);
        }
        const maxCombinationsToCheck = Math.min(50, possibleTeamsA.length);

        for (let i = 0; i < maxCombinationsToCheck; i++) {
            const possibleTeamA = possibleTeamsA[i];
            const possibleTeamB = players.filter(player => !possibleTeamA.includes(player));

            if (possibleTeamB.length !== teamSize && numPlayers % 2 !== 0) continue;

            const comboStringA = possibleTeamA.sort().join(',');
            const comboStringB = possibleTeamB.sort().join(',');

            if (!allTeamCombosForThisMatch.has(comboStringA) && !allTeamCombosForThisMatch.has(comboStringB)) {
                if(!allTeamCombos.has(comboStringA) && !allTeamCombos.has(comboStringB)){
                    teamA = possibleTeamA;
                    teamB = possibleTeamB;
                    allTeamCombosForThisMatch.add(comboStringA);
                    allTeamCombosForThisMatch.add(comboStringB);
                    allTeamCombos.add(comboStringA);
                    allTeamCombos.add(comboStringB);
                    break;
                }
            }
        }

        if (!teamA) {
            let randomIndex = Math.floor(Math.random() * possibleTeamsA.length);
            teamA = possibleTeamsA[randomIndex];
            teamB = players.filter(player => !teamA.includes(player));
            allTeamCombosForThisMatch = new Set();
        }

        const matchDiv = document.createElement('div');
        matchDiv.classList.add('team-set');

        const matchTitle = document.createElement('h2');
        matchTitle.textContent = `Match ${matchNum}:`;
        matchDiv.appendChild(matchTitle);

        const teamADiv = document.createElement('div');
        const teamATitle = document.createElement('strong');
        teamATitle.textContent = "Team A: ";
        const teamAPlayers = document.createElement('span');
        teamAPlayers.textContent = teamA.join(', ');
        teamADiv.appendChild(teamATitle);
        teamADiv.appendChild(teamAPlayers);
        matchDiv.appendChild(teamADiv);

        const teamBDiv = document.createElement('div');
        const teamBTitle = document.createElement('strong');
        teamBTitle.textContent = "Team B: ";
        const teamBPlayers = document.createElement('span');
        teamBPlayers.textContent = teamB.join(', ');
        teamBDiv.appendChild(teamBTitle);
        teamBDiv.appendChild(teamBPlayers);
        matchDiv.appendChild(teamBDiv);

        teamsDiv.appendChild(matchDiv);
    }
}

let allTeamCombos = new Set();

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getCombinations(array, k) {
    const result = [];
    function combine(start, chosen) {
        if (chosen.length === k) {
            result.push([...chosen]);
            return;
        }
        for (let i = start; i < array.length; i++) {
            chosen.push(array[i]);
            combine(i + 1, chosen);
            chosen.pop();
        }
    }
    combine(0, []);
    return result;
}
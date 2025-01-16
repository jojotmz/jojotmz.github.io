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


const NUM_MATCHES = 3;
const MIN_PLAYERS = 6;
const MAX_PLAYERS = 10;
const MAX_COMBINATIONS_TO_CHECK = 50;

let allTeamCombos = new Set();

function generateTeams() {
    const players = Array.from(document.querySelectorAll('#playerForm input:checked')).map(input => input.value);
    const numPlayers = players.length;

    if (numPlayers < MIN_PLAYERS || numPlayers > MAX_PLAYERS) {
        alert(`Please select between ${MIN_PLAYERS} and ${MAX_PLAYERS} players.`);
        return;
    }

    const teamsDiv = document.getElementById('teams');
    teamsDiv.innerHTML = '';

    const teamSize = Math.floor(numPlayers / 2);

    for (let matchNum = 1; matchNum <= NUM_MATCHES; matchNum++) {
        const { teamA, teamB } = findTeamsForMatch(players, teamSize);
        if (!teamA) continue;

        renderMatch(teamsDiv, matchNum, teamA, teamB);
    }
}

function findTeamsForMatch(players, teamSize) {
    let teamA = null;
    let teamB = null;
    let allTeamCombosForThisMatch = new Set();

    shuffleArray(players);
    let possibleTeamsA = getCombinations(players, teamSize);

    if(possibleTeamsA.length > MAX_COMBINATIONS_TO_CHECK){
        for (let i = 0; i < 3; i++) {
            shuffleArray(possibleTeamsA);
        }
    }

    const combinationsToCheck = Math.min(MAX_COMBINATIONS_TO_CHECK, possibleTeamsA.length);

    for (let i = 0; i < combinationsToCheck; i++) {
        const possibleTeamA = possibleTeamsA[i];
        const possibleTeamB = players.filter(player => !possibleTeamA.includes(player));

        if (possibleTeamB.length !== teamSize && players.length % 2 !== 0) continue;

        const comboStringA = possibleTeamA.sort().join(',');
        const comboStringB = possibleTeamB.sort().join(',');

        if (!allTeamCombosForThisMatch.has(comboStringA) && !allTeamCombosForThisMatch.has(comboStringB) &&
            !allTeamCombos.has(comboStringA) && !allTeamCombos.has(comboStringB)) {
            teamA = possibleTeamA;
            teamB = possibleTeamB;
            allTeamCombosForThisMatch.add(comboStringA);
            allTeamCombosForThisMatch.add(comboStringB);
            allTeamCombos.add(comboStringA);
            allTeamCombos.add(comboStringB);
            break;
        }
    }

    if (!teamA) {
        let randomIndex = Math.floor(Math.random() * possibleTeamsA.length);
        teamA = possibleTeamsA[randomIndex];
        teamB = players.filter(player => !teamA.includes(player));
        allTeamCombosForThisMatch = new Set();
    }

    return { teamA, teamB };
}

function renderMatch(teamsDiv, matchNum, teamA, teamB) {
    const matchDiv = document.createElement('div');
    matchDiv.classList.add('team-set');
    matchDiv.innerHTML = `
        <h2>Match ${matchNum}:</h2>
        <div><strong>Team A: </strong><span>${teamA.join(', ')}</span></div>
        <div><strong>Team B: </strong><span>${teamB.join(', ')}</span></div>
    `;
    teamsDiv.appendChild(matchDiv);
}

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
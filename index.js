const coopBtn = document.querySelector('#coop-btn');
const attckBtn = document.querySelector('#attck-btn');

const roundSpan = document.querySelector('#round-span');
const playerSpan = document.querySelector('#player-span');
const compSpan = document.querySelector('#comp-span');

const playerBadges = document.querySelectorAll('#player-badges>div');
const compBadges = document.querySelectorAll('#comp-badges>div');
// console.log('playerBadges', playerBadges);

const compStyleChoices = document.querySelectorAll('#comp-style>button');
const currStyleSpan = document.querySelector('#current-comp-style');
console.log(compStyleChoices);

let round = 0;
let playerScore = 0;
let compScore = 0;
const playerChoices = [];

//Computer play styles

//random
const random = () => {
    return Math.random() < 0.5;
};

//nice
const nice = () => {
    const playerAttcks = playerChoices.filter((didCoop) => !didCoop);
    if (playerAttcks.length >= 3 && !playerChoices[round - 1]) return false;
    return true;
};

//fair
const friendlyTitForTat = () => {
    if (round === 0 || playerChoices[round - 1]) return true;
    return false;
};

//tough, but fair
const meanTitForTat = () => {
    if (round !== 0 && playerChoices[round - 1]) return true;
    return false;
};

//vengeful
const friendlyButVengeful = () => {
    if (playerChoices.includes(false)) return false;
    return true;
};

//fair, but vengeful
const titForTatWithAVengeance = () => {
    if (round === 0) return true;
    const playerAttcks = playerChoices.filter((didCoop) => !didCoop);
    if (playerAttcks.length < 3 && playerChoices[round - 1]) {
        return true;
    }
    return false;
};

const playRound = (playerDidCoop, compStyle) => {
    const compDidCoop = compStyle();

    playerBadges[round].classList.remove('badge-primary');
    compBadges[round].classList.remove('badge-primary');

    if (playerDidCoop) {
        playerBadges[round].classList.add('badge-success');
        // console.log('You clicked the coop button.');
        if (compDidCoop) {
            compBadges[round].classList.add('badge-success');
            // playerScore = playerScore + 3;
            playerScore += 3;
            compScore += 3;
        } else {
            compBadges[round].classList.add('badge-error');
            compScore += 5;
        }
    } else {
        playerBadges[round].classList.add('badge-error');
        // console.log('You clicked the attack button.');
        if (compDidCoop) {
            compBadges[round].classList.add('badge-success');
            playerScore += 5;
        } else {
            compBadges[round].classList.add('badge-error');
            playerScore++;
            compScore++;
        }
    }
    round++;

    roundSpan.textContent = round;
    playerSpan.textContent = playerScore;
    compSpan.textContent = compScore;

    playerChoices.push(playerDidCoop);
    // console.log(playerChoices);

    // console.log(
    //     `Player score: ${playerScore}, Computer score: ${compScore}, Round: ${round}`
    // );

    if (round >= 10) {
        setTimeout(() => {
            alert(
                playerScore > compScore
                    ? 'You won!'
                    : playerScore === compScore
                    ? "It's a tie!"
                    : 'You lost!'
            );
            round = 0;
            playerScore = 0;
            compScore = 0;

            roundSpan.textContent = round;
            playerSpan.textContent = playerScore;
            compSpan.textContent = compScore;
            playerChoices.length = 0;

            for (badge of playerBadges) {
                badge.classList.remove('badge-success', 'badge-error');
                badge.classList.add('badge-primary');
            }
            for (badge of compBadges) {
                badge.classList.remove('badge-success', 'badge-error');
                badge.classList.add('badge-primary');
            }
            // console.log(
            //     'Game reset:',
            //     `Player score: ${playerScore}, Computer score: ${compScore}, Round: ${round}`
            // );
        }, 500);
    }
};

let compStyle = nice;

for (style of compStyleChoices) {
    style.addEventListener('click', (e) => {
        console.log(e.target.id);

        switch (e.target.id) {
            case 'random':
                compStyle = random;
                currStyleSpan.textContent = 'Random';
                break;
            case 'nice':
                compStyle = nice;
                currStyleSpan.textContent = 'Nice';
                break;
            case 'fair':
                compStyle = friendlyTitForTat;
                currStyleSpan.textContent = 'Fair';

                break;
            case 'tough':
                compStyle = meanTitForTat;
                currStyleSpan.textContent = 'Tough, but fair';

                break;
            case 'vengeful':
                compStyle = friendlyButVengeful;
                currStyleSpan.textContent = 'Vengeful';

                break;
            case 'fair-vengeful':
                compStyle = titForTatWithAVengeance;
                currStyleSpan.textContent = 'Fair, but vengeful';

                break;
        }
    });
}

coopBtn.addEventListener('click', () => playRound(true, compStyle));
attckBtn.addEventListener('click', () => playRound(false, compStyle));

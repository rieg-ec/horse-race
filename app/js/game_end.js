let suits = {'s': 'SPADES', 'c': 'CLUBS', 'h': 'HEARTS', 'd': 'DIAMONDS'}
// winner retrieved from localStorage
let winner_ls = window.localStorage.getItem('winner')
if (winner_ls == undefined) {
  window.location.href = '../index.html'
}
window.localStorage.removeItem('winner')
let winner = suits[winner_ls]

document.querySelector('.winner-header').innerText = winner

document.querySelector('button[name="play-again"]').onclick = () => {
  window.location.href = '../html/game.html'
}

document.querySelector('button[name="back-to-menu"]').onclick = () => {
  window.location.href = '../index.html'
}

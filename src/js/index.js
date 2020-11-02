let switch_mode_button = document.querySelector('[name=change-mode]')
let mode = 0 // mode starts at Links Down

function startGame () {
  window.localStorage.setItem('game_mode', mode)
  // // TODO: is having an option to change number of players useful?
  window.localStorage.setItem('n_of_players', '4')
  window.localStorage.setItem('links_size', '6')
  window.localStorage.setItem('track_size', '7')
  window.location.href = './game.html'
}

function switchMode () {
  if (switch_mode_button.innerText == 'Links Down') {
    switch_mode_button.innerText = 'Links Up'
    mode = 1
  } else {
    switch_mode_button.innerText = 'Links Down'
    mode = 0
  }
}

// change game title on orientation change event to avoid space issues
window.addEventListener('orientationchange', (event) => {
  let orientation = event.target.screen.orientation.angle
  if (orientation == '90' || orientation == '-90') {
    document.querySelector('.game-title').innerText = 'Horse Race Game'
  } else {
    document.querySelector('.game-title').innerText = 'Horse Race'
  }
})

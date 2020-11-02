
// script to dynamically render the game html
// based on localStorage parameters

// TODO: uncomment and handle localstorage being empty
// try {
//   const n_of_players = window.localStorage.getItem('n_of_players')
//   const game_mode = window.localStorage.getItem('game_mode')
//   const links_size = window.localStorage.getItem('links_size')
//   const track_size = window.localStorage.getItem('track_size')
//   const ll = window.localStorage.getItem('asdas')
//   console.log(ll)
// } catch (e) {console.log(e)}

const n_of_players = window.localStorage.getItem('n_of_players')
const game_mode = window.localStorage.getItem('game_mode')
const links_size = window.localStorage.getItem('links_size')
const track_size = window.localStorage.getItem('track_size')

if (n_of_players == null ||
    game_mode == null ||
    links_size == null ||
    track_size == null) {
      window.location.href = '../html/index.html'
    }

const game_table = document.querySelector('.game-table')
const topcards_container = document.querySelector('.topcards-container')

for (let i = 0; i < links_size; i++) {
  // create link cards
  let link_card_container = document.createElement('div')
  link_card_container.classList.add('link-card-container')

  let link_card = document.createElement('div')
  link_card.classList.add('link-card', 'is-face-down')
  link_card.setAttribute('id', `link-card-${i}`)

  let vertical_face_down = document.createElement('div')
  vertical_face_down.classList.add('vertical-face-down')

  link_card.appendChild(vertical_face_down)
  link_card_container.appendChild(link_card)

  topcards_container.appendChild(link_card_container)
}

for (let i = 0; i < n_of_players; i++) {
  let horse_card = document.createElement('div')
  horse_card.classList.add('horse-card')
  horse_card.setAttribute('id', `horse-card-${i}`)

  let card_track = document.createElement('div')
  card_track.classList.add('card-track')
  card_track.setAttribute('id', `card-track-${i}`)

  for (let x = 0; x < track_size; x++ ) {
    let track_card_position_container = document.createElement('div')
    track_card_position_container.classList.add('track-card-position-container')
    track_card_position_container.setAttribute('id', `track-card-position-container-${x}`)

    let track_card_position = document.createElement('div')
    track_card_position.classList.add('track-card-position')
    track_card_position_container.setAttribute('id', `track-card-position-${x}`)

    track_card_position_container.appendChild(track_card_position)
    card_track.appendChild(track_card_position_container)
  }

  game_table.appendChild(card_track)
  game_table.appendChild(horse_card)
}

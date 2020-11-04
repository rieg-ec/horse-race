// here we write the game logics

const wait = (delay) => new Promise(resolve => setTimeout(resolve, delay))

// Fissher-Yates sorting algorithm
const shuffle = (arr) => {
  // for N cards, pick random number K from 1 to N, and append the  Kth
  // position counting from right to left to a new array, until there's
  // no cards left in original array
  let random_array = []
  let initial_arr = Array.from(arr)
  for (let i = 0; i < arr.length; i++) {
    let idx = (initial_arr.length - 1) - Math.floor(Math.random() * (initial_arr.length - 1))
    random_array.push(initial_arr[idx])
    initial_arr.splice(idx, 1)
  }
  return random_array
}

const suits = shuffle(['s', 'h', 'c', 'd'])


class Track {
  constructor(index, suit) {
    this.index = index
    this.card = document.querySelector(`#horse-card-${index}`)
      // each card starts in first cell
    this.position = 0
    this.direction = 1
    this.updateCarsdUI()
    this.distance_traveled = 0
    this.winner = false
  }

  move(direction) {
    // direction means if move is positive (meaning it gets closer to win,
    // whether it means moving right or left)
    if (direction) {
      this.distance_traveled += 1
      if (this.distance_traveled == (this.cells.length * 2) - 2) {
        this.winner = true
      }
      if (this.position == this.cells.length - 1) {
        // card in last cell
        // switch direction if haven't yet
        if (this.direction) {
          this.direction = -1
          document.querySelector(`#horse-card-${this.index}`).
            classList.add('is-going-left')
        }
        this.position += this.direction
        this.updatePosition()
      } else if (!(this.position == 0 && this.direction == -1)) {
        this.position += this.direction
        this.updatePosition()
      }
    } else {
      this.distance_traveled -= 1
      if (this.position == this.cells.length - 1) {
        // switch direction if haven't yet
        // if direction is -1, must reset to 1
        if (this.direction == -1) {
          this.direction = 1
          document.querySelector(`#horse-card-${this.index}`).
            classList.remove('is-going-left')
        }
        this.position -= this.direction
        this.updatePosition()
      } else if (!(this.position == 0 && this.direction == 1)) {
        this.position -= this.direction
        this.updatePosition()
      }
    }
  }

  updatePosition() {
    this.card.style.left = this.cells[this.position].x + 'px'
    this.card.style.top = this.cells[this.position].y + 'px'
  }

  updateCarsdUI() {
    // method to update cards ui whenever there's a change not related to
    // game e.g resizing.
    this.card_width = document.querySelector(
      '.track-card-position').clientWidth;
    this.card_height = document.querySelector(
      '.track-card-position').clientHeight;
    this.track = document.querySelector(
      `#card-track-${this.index}`);

    this.cells = []
    for (let cell of this.track.querySelectorAll('.track-card-position')) {
      let rect = cell.getBoundingClientRect()
      let pos = {
        x: rect.x,
        y: rect.y,
      }
      this.cells.push(pos)
    }

    this.card.style.width = this.card_width + 'px'
    this.card.style.height = this.card_height + 'px'

    this.card.style.left = this.cells[this.position].x + 'px'
    this.card.style.top = this.cells[this.position].y + 'px'
  }
}

class Game {

  constructor(n_of_players, game_mode, links_size) {
    this.links_size = links_size
    this.game_mode = game_mode
    // link counter
    this.link_counter_tag = document.querySelector('.link-counter')
    this.link_counter = 0
    // cards counter
    this.cards_left_tag = document.querySelector('.cards-left')
    this.cards_left_counter = parseInt(this.cards_left_tag.innerText, 10)

    this.links = []

    this.createNewDeck()
    this.getNewLinksFromDeck(true)
    // after drawing from deck, we want draw pile to keep facing down at
    // game start:
    this.tracks = {}
    for (let i = 0; i < n_of_players; i++) {
      let track = new Track(i, suits[i])
        // dictionary containing card suit as key and respective track as value
      this.tracks[suits[i]] = track
    }
    // attr. to prevent player from clicking before animations have finished
    this.ready = true
  }


  async getNewLinksFromDeck (init = false) {
    // init is true when game starts and delays are not useful
    let init_delay = false
    if (init) {init_delay = 1} // 1 ms of delay at game start
    // method to remove face up childs from link elements and change html
    // class to face down, css handles the animation
    this.links = [] // reset
    let link_elements = []
    for (let i = 0; i < this.links_size; i++) {
      let card = this.getCardFromDeck()
      this.links.push(card)
      link_elements.push(document.querySelector(`#link-card-${i}`))
    }

    await wait(init_delay || 800)
    // flip cards down:
    link_elements.forEach(element => {
      element.classList.add('is-face-down')
    })

    await wait(init_delay || 500)
    // remove old face up card div:
    link_elements.forEach(element => {
      element.querySelectorAll('.vertical-face-up').forEach(
        element => element.remove())
    })

    // add new face up card div:
    link_elements.forEach((element, index) => {
      let [rank, suit] = this.links[index]
      element.appendChild(createCard(rank, suit))
    })
    // if game mode is links up, flip them up back again:
    if (this.game_mode == '1') {
      await wait(init_delay || 700)
      link_elements.forEach(element => {
        element.classList.remove('is-face-down')
        element.classList.add('is-face-up')
      })
    }
  }

  createNewDeck() {
    // creates new deck without links and aces
    const ranks = [
      '2', '3', '4', '5', '6', '7',
      '8', '9', '10', '11', '12', '13'
    ]

    this.deck = []
    for (let suit of suits) {
      for (let rank of ranks) {
        let card = [rank, suit]
          // check if card is not in links
        if (!this.links.includes(card)) {
          // prevent cards from duplicating when creating a new deck with
          // already existing link cards
          this.deck.push(card)
        }
      }
    }
    // add a 'depth' feel to the deck
    this.depth = 7

    let drawcard = document.querySelector('.draw-card')

    // draw card must have biggest zindex
    drawcard.style.zIndex = this.depth + 1
    drawcard.style.right = 0

    let drawpile = document.querySelector('.draw-pile')

    for (let i = 0; i < this.depth; i++) {
      let filler = document.createElement('div')
      filler.classList.add('filler-blank', 'is-face-down')
      // change z index so last created filler (which gets inserted before all
      // the others) has lowest zindex:
      filler.style.zIndex = this.depth-i
      let face_down_card = document.createElement('div')
      // make empty blank card to fill the depth
      face_down_card.classList.add('vertical-face-down')
      // add blank card to filler div
      filler.appendChild(face_down_card)
      filler.style.right = i*2 + 'px'
      drawpile.insertBefore(filler, drawpile.firstChild)
    }

    this.cards_left_counter = this.deck.length
    this.cards_left_tag.innerText = this.link_counter
  }

  getCardFromDeck() {
    // check if there are any cards left
    if (this.deck.length == 0) {
      this.createNewDeck()
    }

    let randomIndex = Math.floor(Math.random() * this.deck.length)
    let card = this.deck.splice(randomIndex, 1)[0]
    // deck sizes at which depth change occurs
    if (this.deck.length == 40 ||
        this.deck.length == 30 ||
        this.deck.length == 20 ||
        this.deck.length == 10 ||
        this.deck.length == 7 ||
        this.deck.length == 5 ||
        this.deck.length == 2) {
          // remove empty filler from left to right
          let drawpile = document.querySelector('.draw-pile')
          drawpile.removeChild(drawpile.firstChild)
          // move the stack a bit to the left by
          // adding pixels to style attr 'right' to each card
          Array.from(document.querySelector('.draw-pile').children).
            forEach((element, index) => {
              let old_param = window.getComputedStyle(element).
                getPropertyValue('right')
              element.style.right = parseInt(old_param.slice(0, -2), 10) + 2 + 'px'
            })
        }

    this.cards_left_counter -= 1
    this.cards_left_tag.innerText = this.cards_left_counter

    return card
  }

  linkUIAnimation (link_index) {
    let link_card = document.querySelector(`#link-card-${link_index}`)
    if (this.game_mode == '0') {
      // if game mode is 'Links Up' then links are already facing up, then after
      // being used they must flip down
      link_card.classList.remove(
        'is-face-down')
    } else {
      link_card.classList.add('is-current-link')
      if (link_index > 0) {
        document.querySelector(`#link-card-${link_index - 1}`).
          classList.remove('is-current-link')
      }
    }
  }

  async play() {
    this.link_counter++
    this.link_counter_tag.innerText = `${this.link_counter}/5`
    this.ready = false
    if (this.link_counter == 5) {
      /*
        order of events:
        1) user plays and link_counter is 5
        2) link card turns face up
        3) horse with same link suit moves negative
        4) link counter update to 0/5
        5) if all links are facing up, links are renewed
      */

      // get link id index to make ui changes to it:
      let link_index = this.links_size - (this.links.length)
      // link card in line:
      let card = this.links.splice(0, 1)[0]
      // make ui animation:
      this.linkUIAnimation(link_index)

      await wait(1000)

      this.link_counter = 0
      this.link_counter_tag.innerText = '0/5'
      this.tracks[card[1]].move(0) // negative direction

      if (this.links.length == 0) {
        await this.getNewLinksFromDeck()
      }

    } else {

      let draw_card = document.querySelector('.draw-card')
      if (this.deck.length == 0) {
        // flip last card down
        draw_card.classList.add('is-face-down')
        await wait(600)
      }

      // if deck got empty, it will refill with blank fillers
      let card = this.getCardFromDeck()

      if (draw_card.querySelector('.vertical-face-up') !== null) {
        draw_card.querySelector('.vertical-face-up').remove()
      }

      // add face up card
      draw_card.appendChild(createCard(card[0], card[1]))

      if (Array.from(draw_card.classList).includes('is-face-down')) {
        // if previously we flipped draw card down due to
        // deck refill, flip it back up
        await wait(600)
        draw_card.classList.remove('is-face-down')
      }

      await wait(800)
      this.tracks[card[1]].move(1) // positive direction

      if (this.tracks[card[1]].winner) {
        await wait(1000)
        window.localStorage.setItem('winner', card[1])
        window.location.href = '../html/game_end.html'
      }
    }

    this.ready = true

  }
}

window.onload = function () {

  document.querySelectorAll('.horse-card').forEach((element, index) => {
    let suit = suits[index]
    // cards.js function
    element.appendChild(createHorizontalCard('a', suit))
  })

  const game = new Game(parseInt(n_of_players, 10), game_mode, links_size)

  window.addEventListener('resize', () => {
    // update cards ui when divs size change
    for (let [key, value] of Object.entries(game.tracks)) {
      game.tracks[key].updateCarsdUI()
    }
  })

  document.querySelectorAll('.card-track').forEach((element) => {
    element.addEventListener('click', () => {
      // add little delay to prevent error double click
      if (game.ready) {
        game.play()
      }
    })
  })
}

const iconSuits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');

const createCardElement = (tag, attrs, childs) => {
  // receives tag (div, span, button etc), attributes in attrs dictionary
  // and childs in a list, which can be text or an html element
  let elem = document.createElement(tag);

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      elem.setAttribute(key, value);
    }
  }


  if (childs) {
    childs.forEach((child) => {
      if (typeof(child) == 'string') {
        elem.appendChild(document.createTextNode(child));
      } else {
        elem.appendChild(child);
      }
    })

  }

  return elem;
}

const div = (attrs, childs) => createCardElement('div', attrs, childs);

const createCard = (rank_, suit_) => {
  let rank = rank_.toUpperCase();
  let suitIdx = ['s', 'h', 'c', 'd'].indexOf(suit_);
  let suit = iconSuits[suitIdx];
  let card_element = div({
    'class': 'vertical-face-up',
    'id': `${rank_}-${suit_}`,
    },
    [
      div({ 'class': 'card-middle' },
      [
        div({ 'class': 'card-corner-rank' }, [rank]),
        div({ 'class': 'card-corner-suit' }, [suit]),
      ]),
    ]);
  // set font color to red if suit is diamonds or hearts
  if (['h', 'd'].includes(suit_)) {
    card_element.style.color = 'red'
  }
  return card_element;
}

const createHorizontalCard = (rank_, suit_) => {
  let rank = rank_.toUpperCase();
  let suitIdx = ['s', 'h', 'c', 'd'].indexOf(suit_);
  let suit = iconSuits[suitIdx];
  let card_element = div({
    'class': 'horizontal-face-up',
    'id': `${rank_}-${suit_}`
    },
    [
    div({ 'class': 'card-middle' },
      [
        div({ 'class': 'card-corner-rank' }, [rank]),
        div({ 'class': 'card-corner-suit' }, [suit]),
      ]),
    ]);
  // set font color to red if card suit is hearts or diamonds
  if (['h', 'd'].includes(suit_)) {
    card_element.style.color = 'red';
  }
  return card_element;

}

var Suit;
(function (Suit) {
    Suit[Suit["Clubs"] = 0] = "Clubs";
    Suit[Suit["Diamonds"] = 1] = "Diamonds";
    Suit[Suit["Hearts"] = 2] = "Hearts";
    Suit[Suit["Spades"] = 3] = "Spades";
})(Suit || (Suit = {}));
;
class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
    get suitName() {
        return Suit[this.suit];
    }
    get rankName() {
        return Card.rankNames[this.rank - 1];
    }
    get imageName() {
        let s, r;
        if (this.rank === 1 || this.rank > 10) {
            r = this.rankName.charAt(0);
        }
        else {
            r = this.rank + '';
        }
        s = this.suitName.charAt(0);
        return r + s + '.svg';
    }
    get name() {
        return this.rankName + ' of ' + this.suitName;
    }
}
Card.rankNames = [
    'Ace',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'Jack',
    'Queen',
    'King',
];
class Deck {
    constructor() {
        this.cards = [];
        for (let s = 0; s < 4; s++) {
            for (let r = 1; r <= 13; r++) {
                this.cards.push(new Card(r, s));
            }
        }
    }
    shuffle() {
        for (let i = this.cards.length; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            [this.cards[i - 1], this.cards[j]] = [this.cards[j], this.cards[i - 1]];
        }
    }
    draw() {
        return this.cards.shift();
    }
}
;
;
let Ranks = {
    ROYAL_FLUSH: {
        name: 'Royal Flush',
        payout: 1500,
    },
    STRAIGHT_FLUSH: {
        name: 'Straight Flush',
        payout: 1250,
    },
    FOUR_OF_KIND: {
        name: 'Four of Kind',
        payout: 1000,
    },
    FULL_HOUSE: {
        name: 'Full House',
        payout: 750,
    },
    FLUSH: {
        name: 'Flush',
        payout: 500,
    },
    STRAIGHT: {
        name: 'Straight',
        payout: 250,
    },
    THREE_OF_KIND: {
        name: 'Three of Kind',
        payout: 100,
    },
    TWO_PAIR: {
        name: 'Two Pair',
        payout: 75,
    },
    JACKS: {
        name: 'Jacks',
        payout: 50,
    },
    LOSE: {
        name: 'Better luck next time',
        payout: 0,
    },
};
;
class Kinds {
    constructor(cards) {
        this.kinds = {};
        cards.forEach(c => {
            let r = c.rank;
            if (this.kinds[r] === undefined)
                this.kinds[r] = [];
            this.kinds[r].push(c);
        });
    }
    has(numOfKinds) {
        let kg = this.all(numOfKinds);
        if (kg)
            return kg[0];
        return false;
    }
    all(numOfKinds) {
        let result = [];
        for (let rank of Object.keys(this.kinds)) {
            if (this.kinds[rank].length === numOfKinds) {
                result.push({
                    cards: this.kinds[rank],
                    rank: +rank,
                });
            }
        }
        if (result.length === 0)
            return false;
        return result;
    }
}
class Hand {
    constructor(cards) {
        if (cards !== undefined) {
            this.cards = cards;
        }
        else {
            this.cards = [];
        }
    }
    isFlush() {
        let suit = this.cards[0].suit;
        return this.cards.every(c => c.suit === suit);
    }
    isStraight() {
        return this.isAceHighStraight() || this.isAceLowStraight();
    }
    isAceHighStraight() {
        let high, low, ranks = [];
        high = low = this.cards[0].rank;
        for (let i = 0; i < this.cards.length; i++) {
            let c = this.cards[i];
            let r = c.rank;
            if (r === 1)
                r = 14;
            if (ranks.indexOf(r) !== -1)
                return false;
            ranks.push(r);
            if (r > high)
                high = r;
            if (r < low)
                low = r;
        }
        return high - low === 4;
    }
    isAceLowStraight() {
        let high, low, ranks = [];
        high = low = this.cards[0].rank;
        for (let i = 0; i < this.cards.length; i++) {
            let c = this.cards[i];
            let r = c.rank;
            if (ranks.indexOf(r) !== -1)
                return false;
            ranks.push(r);
            if (r > high)
                high = r;
            if (r < low)
                low = r;
        }
        return high - low === 4;
    }
    has(...ranks) {
        return this.cards.some(c => {
            let r = c.rank, i = ranks.indexOf(r);
            if (i !== -1) {
                ranks.splice(i, 1);
            }
            return ranks.length === 0;
        });
    }
    getScore() {
        if (this.isFlush() && this.isStraight()) {
            if (this.has(1, 10, 11, 12, 13)) {
                // Royal flush
                return {
                    rank: Ranks.ROYAL_FLUSH,
                    scoringCards: this.cards,
                };
            }
            // Straight flush
            return {
                rank: Ranks.STRAIGHT_FLUSH,
                scoringCards: this.cards,
            };
        }
        let kinds = new Kinds(this.cards);
        let has4 = kinds.has(4);
        if (has4) {
            return {
                rank: Ranks.FOUR_OF_KIND,
                scoringCards: has4.cards,
            };
        }
        let has3 = kinds.has(3), has2 = kinds.has(2);
        if (has3 && has2) {
            return {
                rank: Ranks.FULL_HOUSE,
                scoringCards: this.cards,
            };
        }
        if (this.isFlush()) {
            return {
                rank: Ranks.FLUSH,
                scoringCards: this.cards,
            };
        }
        if (this.isStraight()) {
            return {
                rank: Ranks.STRAIGHT,
                scoringCards: this.cards,
            };
        }
        if (has3) {
            return {
                rank: Ranks.THREE_OF_KIND,
                scoringCards: has3.cards,
            };
        }
        let all2 = kinds.all(2);
        if (all2 && all2.length === 2) {
            return {
                rank: Ranks.TWO_PAIR,
                scoringCards: (() => {
                    let cards = [];
                    all2.forEach(kg => {
                        cards = cards.concat(kg.cards);
                    });
                    return cards;
                })(),
            };
        }
        if (has2 && (has2.rank >= 11 || has2.rank === 1)) {
            return {
                rank: Ranks.JACKS,
                scoringCards: has2.cards,
            };
        }
        return {
            rank: Ranks.LOSE,
            scoringCards: [],
        };
    }
}
class UI {
    constructor(parent) {
        this.parent = parent;
        this.cashDisplay = parent.querySelector('.cash');
        this.betInput = parent.querySelector('.bet-input');
        this.betButton = parent.querySelector('.bet-button');
        this.playButton = parent.querySelector('.play-button');
        this.resetButton = parent.querySelector('.reset-button');
        this.cardsListElement = parent.querySelector('.cards');
        this.msg = parent.querySelector('.msg');
        this._cards = new Map();
    }
    betMode() {
        this.betInput.disabled = false;
        this.betButton.disabled = false;
        this.playButton.disabled = true;
        this.resetButton.disabled = true;
    }
    playMode() {
        this.betInput.disabled = true;
        this.betButton.disabled = true;
        this.playButton.disabled = false;
        this.resetButton.disabled = true;
    }
    gameOverMode() {
        this.betInput.disabled = true;
        this.betButton.disabled = true;
        this.playButton.disabled = true;
        this.resetButton.disabled = false;
    }
    enableCards() {
        this.cards.forEach((c) => {
            c.disabled = false;
        });
    }
    disableCards() {
        this.cards.forEach((c) => {
            c.disabled = true;
        });
    }
    updateCash(cash) {
        this.cashDisplay.textContent = '$' + cash;
    }
    get cards() {
        return this._cards;
    }
    addCard(card) {
        let u = new UICard(card);
        this._cards.set(card, u);
        this.cardsListElement.appendChild(u.element);
        return u;
    }
    replaceCard(newCard, oldCard) {
        let oldUICard = this._cards.get(oldCard);
        if (oldUICard === undefined)
            throw 'Card not in display';
        let u = new UICard(newCard);
        this.cardsListElement.replaceChild(u.element, oldUICard.element);
        this._cards.delete(oldCard);
        this._cards.set(newCard, u);
        return u;
    }
    clearCards() {
        this._cards = new Map();
        while (this.cardsListElement.firstChild) {
            this.cardsListElement.removeChild(this.cardsListElement.firstChild);
        }
    }
}
class Round {
    constructor(bet) {
        this.bet = bet;
        this.deck = new Deck();
        this.deck.shuffle();
        this.hand = new Hand();
    }
    draw() {
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
        this.hand.cards.push(this.deck.draw());
    }
}
class UICard {
    constructor(card) {
        this.element = document.createElement('div');
        this.img = document.createElement('img');
        this.disabled = false;
        this._highlighted = false;
        this.card = card;
        this.element.classList.add('card');
        this.element.appendChild(this.img);
        this.img.src = 'img/' + this.card.imageName;
    }
    get highlighted() {
        return this._highlighted;
    }
    set highlighted(value) {
        this._highlighted = value;
        this.element.classList.toggle('highlighted', this.highlighted);
    }
}
let ui = new UI(document.querySelector('main')), round, player = {
    cash: 50,
};
function init() {
    reset();
    ui.betButton.addEventListener('click', function () {
        let bet = parseInt(ui.betInput.value);
        if (bet > player.cash && bet <= 0)
            return;
        round = new Round(bet);
        round.draw();
        player.cash -= bet;
        updateCash();
        round.hand.cards.forEach(c => {
            ui.addCard(c);
        });
        ui.playMode();
        msg('');
    });
    ui.playButton.addEventListener('click', function () {
        round.hand.cards.forEach((c, i) => {
            let u = ui.cards.get(c);
        });
        let score = round.hand.getScore(), payout = score.rank.payout * round.bet;
        player.cash += payout;
        updateCash();
        score.scoringCards.forEach(c => {
            ui.cards.get(c).highlighted = true;
        });
        ui.gameOverMode();
        ui.disableCards();
        msg('Player Hand: ' + score.rank.name + '<br>Last won: $' + payout);
    });
    ui.resetButton.addEventListener('click', function () {
        reset();
    });
}
function reset() {
    ui.betMode();
    ui.clearCards();
    ui.enableCards();
    clearMsg();
}
function updateCash() {
    ui.updateCash(player.cash);
}
function msg(str) {
    ui.msg.innerHTML += str + '<br>';
}
function clearMsg() {
    ui.msg.innerHTML = '';
}
init();
//# sourceMappingURL=app.js.map
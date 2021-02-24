class Deck {
    private cards: Card[];

    public constructor () {
        this.cards = [];

        for (let s = 0; s < 4; s++) {
            for (let r = 1; r <= 13; r++) {
                this.cards.push(new Card(r, s));
            }
        }
    }

    //cards hand draw class
    public draw (): Card {
        return <Card> this.cards.shift();
    }

     //cards shuffle class
    public shuffle (): void {
        for (let i = this.cards.length; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            [this.cards[i - 1], this.cards[j]] = [this.cards[j], this.cards[i - 1]];
        }
    }

   
}
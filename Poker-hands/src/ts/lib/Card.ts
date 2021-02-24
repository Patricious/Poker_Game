// card classes
// enumerated type of card suits 
enum Suit {
    Clubs,
    Diamonds,
    Hearts,
    Spades,
};
// declaration of card claseses 
class Card {
    public suit: number;
    public rank: number;
    

    public constructor ( suit: Suit, rank: number) {
        this.suit = suit;
        this.rank = rank;
       
    }
// card format on the deck 
    private static rankNames = [
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

   
    public get name (): string {
        return this.rankName + ' of ' + this.suitName;
    }
     // card images that will be displayed when ther is a draw 
    public get imageName (): string {
        let s: string, r: string;

        if (this.rank === 1 || this.rank > 10) {
            r = this.rankName.charAt(0);
        } else {
            r = this.rank + '';
        }

        s = this.suitName.charAt(0);

        return r + s + '.svg';
    }

    
    public get suitName (): string {
        return Suit[this.suit];
    }
    public get rankName (): string {
        return Card.rankNames[this.rank - 1];
    }

}
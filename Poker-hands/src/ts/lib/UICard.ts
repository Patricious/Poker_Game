// cards display class
class UICard {
    public readonly card: Card;
    public readonly element: Element = document.createElement('div');
    public readonly img: HTMLImageElement = document.createElement('img');
    public disabled: boolean = false;
    private _highlighted: boolean = false;

    public constructor (card: Card) {
        this.card = card;
        this.element.classList.add('card');
        this.element.appendChild(this.img);
        this.img.src = 'img/' + this.card.imageName;

    }


    public get highlighted (): boolean {
        return this._highlighted;
    }


    public set highlighted (value: boolean) {
        this._highlighted = value;
        this.element.classList.toggle('highlighted', this.highlighted);
    }
}
export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  isVisible: boolean;
}

export interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
  tableaus: Card[][];
  selectedCard: {
    card: Card;
    source: string;
    index: number;
  } | null;
}

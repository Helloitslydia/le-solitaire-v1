import { Card, Rank, Suit } from '../types';

const SUITS: Suit[] = ['♠', '♥', '♦', '♣'];
const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, isVisible: false });
    }
  }
  return shuffle(deck);
};

export const shuffle = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const isRed = (suit: Suit): boolean => {
  return suit === '♥' || suit === '♦';
};

export const canPlaceOnTableau = (card: Card, targetCard: Card | undefined): boolean => {
  if (!targetCard) {
    return card.rank === 'K';
  }
  
  const rankIndex = RANKS.indexOf(card.rank);
  const targetRankIndex = RANKS.indexOf(targetCard.rank);
  
  return rankIndex === targetRankIndex - 1 && isRed(card.suit) !== isRed(targetCard.suit);
};

export const canPlaceOnFoundation = (card: Card, foundationPile: Card[]): boolean => {
  if (foundationPile.length === 0) {
    return card.rank === 'A';
  }
  
  const topCard = foundationPile[foundationPile.length - 1];
  const rankIndex = RANKS.indexOf(card.rank);
  const topRankIndex = RANKS.indexOf(topCard.rank);
  
  return card.suit === topCard.suit && rankIndex === topRankIndex + 1;
};

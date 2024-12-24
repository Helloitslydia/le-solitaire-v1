import styled from 'styled-components';
import { Card as CardType } from '../types';
import { isRed } from '../utils/gameLogic';

interface CardProps {
  card: CardType;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

const CardContainer = styled.div<{ isRed: boolean; isVisible: boolean; isDraggable: boolean }>`
  width: 100px;
  height: 140px;
  border: 2px solid #000;
  border-radius: 10px;
  background-color: ${props => props.isVisible ? '#fff' : 'transparent'};
  background-image: ${props => props.isVisible ? 'none' : 'url("/card-back.png")'};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  color: ${props => props.isRed ? 'red' : 'black'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  cursor: ${props => props.isDraggable ? 'grab' : 'default'};
  user-select: none;
  position: relative;
  margin-bottom: -120px;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 70px;
    height: 98px;
    font-size: 18px;
    margin-bottom: -80px;
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 70px;
    font-size: 14px;
    margin-bottom: -55px;
  }

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    transform: ${props => props.isDraggable ? 'translateY(-5px)' : 'none'};
  }

  &:active {
    cursor: ${props => props.isDraggable ? 'grabbing' : 'default'};
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardCorner = styled.div<{ position: 'top' | 'bottom' }>`
  position: absolute;
  ${props => props.position === 'top' ? 'top: 5px; left: 5px;' : 'bottom: 5px; right: 5px;'}
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.position === 'top' ? 'flex-start' : 'flex-end'};
  transform: ${props => props.position === 'bottom' ? 'rotate(180deg)' : 'none'};

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export const Card: React.FC<CardProps> = ({ card, isDraggable = false, onDragStart }) => {
  if (!card.isVisible) {
    return <CardContainer isRed={false} isVisible={false} isDraggable={false} />;
  }

  return (
    <CardContainer
      isRed={isRed(card.suit)}
      isVisible={true}
      isDraggable={isDraggable}
      draggable={isDraggable}
      onDragStart={onDragStart}
    >
      <CardCorner position="top">
        {card.rank}
        <div>{card.suit}</div>
      </CardCorner>
      <CardContent>
        {card.suit}
      </CardContent>
      <CardCorner position="bottom">
        {card.rank}
        <div>{card.suit}</div>
      </CardCorner>
    </CardContainer>
  );
};

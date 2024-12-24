import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card as CardComponent } from './components/Card';
import { Card, GameState } from './types';
import { createDeck, canPlaceOnTableau, canPlaceOnFoundation } from './utils/gameLogic';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 60px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
    gap: 10px;
  }
`;

const Dedication = styled.div`
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  z-index: 100;
  padding: 10px;
  letter-spacing: 0.5px;

  @media (max-width: 480px) {
    font-size: 14px;
    bottom: 10px;
  }
`;

const TopSection = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 5px;
  }
`;

const TableauSection = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 5px;
  }
`;

const Pile = styled.div<{ isDropTarget?: boolean }>`
  min-width: 100px;
  min-height: 140px;
  border: 2px dashed ${props => props.isDropTarget ? '#ffff00' : '#ffffff55'};
  border-radius: 10px;
  position: relative;

  @media (max-width: 768px) {
    min-width: 70px;
    min-height: 98px;
  }

  @media (max-width: 480px) {
    min-width: 50px;
    min-height: 70px;
  }
`;

function App() {
  const [gameState, setGameState] = useState<GameState>({
    stock: [],
    waste: [],
    foundations: [[], [], [], []],
    tableaus: [[], [], [], [], [], [], []],
    selectedCard: null,
  });
  const [draggedCards, setDraggedCards] = useState<{ cards: Card[], source: string } | null>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const deck = createDeck();
    const tableaus: Card[][] = Array(7).fill([]).map(() => []);
    
    // Deal cards to tableaus
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = deck.pop();
        if (card) {
          card.isVisible = i === j;
          tableaus[j].push(card);
        }
      }
    }

    setGameState({
      stock: deck,
      waste: [],
      foundations: [[], [], [], []],
      tableaus,
      selectedCard: null,
    });
  };

  const handleStockClick = () => {
    if (gameState.stock.length === 0) {
      setGameState(prev => ({
        ...prev,
        stock: prev.waste.reverse().map(card => ({ ...card, isVisible: false })),
        waste: [],
      }));
      return;
    }

    const newStock = [...gameState.stock];
    const card = newStock.pop();
    if (card) {
      card.isVisible = true;
      setGameState(prev => ({
        ...prev,
        stock: newStock,
        waste: [...prev.waste, card],
      }));
    }
  };

  const handleDragStart = (e: React.DragEvent, cards: Card[], source: string) => {
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox
    setDraggedCards({ cards, source });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetSource: string, targetIndex: number) => {
    e.preventDefault();
    if (!draggedCards) return;

    const { cards: sourceCards, source: sourceLocation } = draggedCards;
    const newState = { ...gameState };

    // Helper function to remove cards from source
    const removeFromSource = () => {
      if (sourceLocation === 'waste') {
        newState.waste.pop();
      } else if (sourceLocation.startsWith('tableau-')) {
        const tableauIndex = parseInt(sourceLocation.split('-')[1]);
        const startIndex = newState.tableaus[tableauIndex].indexOf(sourceCards[0]);
        newState.tableaus[tableauIndex].splice(startIndex);
        if (newState.tableaus[tableauIndex].length > 0) {
          newState.tableaus[tableauIndex][newState.tableaus[tableauIndex].length - 1].isVisible = true;
        }
      } else if (sourceLocation.startsWith('foundation-')) {
        const foundationIndex = parseInt(sourceLocation.split('-')[1]);
        newState.foundations[foundationIndex].pop();
      }
    };

    // Handle dropping on tableau
    if (targetSource.startsWith('tableau-')) {
      const tableauIndex = parseInt(targetSource.split('-')[1]);
      const targetTableau = newState.tableaus[tableauIndex];
      const targetCard = targetTableau[targetTableau.length - 1];

      if (canPlaceOnTableau(sourceCards[0], targetCard)) {
        removeFromSource();
        newState.tableaus[tableauIndex] = [...targetTableau, ...sourceCards];
      }
    }
    // Handle dropping on foundation
    else if (targetSource.startsWith('foundation-')) {
      const foundationIndex = parseInt(targetSource.split('-')[1]);
      const targetFoundation = newState.foundations[foundationIndex];

      if (sourceCards.length === 1 && canPlaceOnFoundation(sourceCards[0], targetFoundation)) {
        removeFromSource();
        newState.foundations[foundationIndex] = [...targetFoundation, sourceCards[0]];
      }
    }

    setGameState(newState);
    setDraggedCards(null);
  };

  const getCardsFromIndex = (tableau: Card[], index: number): Card[] => {
    return tableau.slice(index);
  };

  return (
    <GameContainer>
      <TopSection>
        <Pile onClick={handleStockClick}>
          {gameState.stock.length > 0 && (
            <CardComponent card={{ suit: '♠', rank: 'A', isVisible: false }} />
          )}
        </Pile>
        <Pile
          onDragOver={handleDragOver}
        >
          {gameState.waste.length > 0 && (
            <CardComponent
              card={gameState.waste[gameState.waste.length - 1]}
              isDraggable={true}
              onDragStart={(e) => handleDragStart(e, [gameState.waste[gameState.waste.length - 1]], 'waste')}
            />
          )}
        </Pile>
        <div style={{ width: '40px' }} />
        {gameState.foundations.map((foundation, i) => (
          <Pile
            key={i}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, `foundation-${i}`, foundation.length)}
          >
            {foundation.length > 0 && (
              <CardComponent
                card={foundation[foundation.length - 1]}
                isDraggable={true}
                onDragStart={(e) => handleDragStart(e, [foundation[foundation.length - 1]], `foundation-${i}`)}
              />
            )}
          </Pile>
        ))}
      </TopSection>

      <TableauSection>
        {gameState.tableaus.map((tableau, i) => (
          <Pile
            key={i}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, `tableau-${i}`, tableau.length)}
          >
            {tableau.map((card, j) => (
              <CardComponent
                key={`${card.suit}-${card.rank}`}
                card={card}
                isDraggable={card.isVisible}
                onDragStart={(e) => handleDragStart(e, getCardsFromIndex(tableau, j), `tableau-${i}`)}
              />
            ))}
          </Pile>
        ))}
      </TableauSection>
      
      <Dedication>Pour Papi ❤️, par Lydia</Dedication>
    </GameContainer>
  );
}

export default App;

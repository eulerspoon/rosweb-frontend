import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToRoute } from '../store/slices/routeSlice';
import { Command } from '../types/api';
import { RootState, AppDispatch } from '../store';

interface CommandCardProps {
  command: Command;
}

const CommandCard: React.FC<CommandCardProps> = ({ command }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNGNUY1RjUiLz48dGV4dCB4PSIzMCIgeT0iMzAiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2IiBmaWxsPSIjOTk5Ij5Sb2JvdDwvdGV4dD48/3N2Zz4=';

  const handleDetailsClick = () => {
    navigate(`/command/${command.id}`);
  };

  const handleAddToRoute = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await dispatch(addToRoute(command.id)).unwrap();
      alert(`Команда "${command.name}" добавлена в заявку!`);
    } catch (error) {
      console.error('Error adding to route:', error);
    }
  };

  return (
    <Card className="h-100">
      <Card.Img 
        variant="top" 
        src={command.image_url || defaultImage}
        style={{ height: '150px', objectFit: 'cover' }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultImage;
        }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{command.name}</Card.Title>
        <Card.Text className="flex-grow-1">
          {command.description}
        </Card.Text>
        <div className="d-flex gap-2 mt-auto">
          <Button 
            variant="primary" 
            onClick={handleDetailsClick}
            className="flex-grow-1"
          >
            Подробнее
          </Button>
          {isAuthenticated && (
            <Button 
              variant="success" 
              onClick={handleAddToRoute}
              title="Добавить в заявку"
            >
              <i className="bi bi-plus-lg"></i>
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CommandCard;
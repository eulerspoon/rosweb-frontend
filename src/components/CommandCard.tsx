import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Command } from '../types/api';

interface CommandCardProps {
  command: Command;
}

const CommandCard: React.FC<CommandCardProps> = ({ command }) => {
  const navigate = useNavigate();
  const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNGNUY1RjUiLz48dGV4dCB4PSIzMCIgeT0iMzAiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2IiBmaWxsPSIjOTk5Ij5Sb2JvdDwvdGV4dD48L3N2Zz4=';

  const handleDetailsClick = () => {
    navigate(`/command/${command.id}`);
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
        <Button 
          variant="primary" 
          onClick={handleDetailsClick}
        >
          Подробнее
        </Button>
      </Card.Body>
    </Card>
  );
};

export default CommandCard;
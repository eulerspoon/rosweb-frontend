import React from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { completeRoute } from '../store/slices/routeSlice';

interface ModeratorActionsProps {
  routeId: number;
  status: string;
}

const ModeratorActions: React.FC<ModeratorActionsProps> = ({ routeId, status }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleComplete = () => {
    if (window.confirm('Завершить заявку?')) {
      dispatch(completeRoute({ id: routeId, action: 'complete' }));
    }
  };

  const handleReject = () => {
    if (window.confirm('Отклонить заявку?')) {
      dispatch(completeRoute({ id: routeId, action: 'reject' }));
    }
  };

  // Если заявка уже завершена или отклонена - показываем прочерк
  if (status === 'completed' || status === 'cancelled') {
    return <span className="text-muted">—</span>;
  }

  // Только для сформированных заявок показываем кнопки
  if (status === 'formed') {
    return (
      <div className="d-flex gap-2">
        <Button 
          variant="success" 
          size="sm"
          onClick={handleComplete}
          title="Завершить заявку"
        >
          ✓
        </Button>
        <Button 
          variant="danger" 
          size="sm"
          onClick={handleReject}
          title="Отклонить заявку"
        >
          ✗
        </Button>
      </div>
    );
  }

  return null;
};

export default ModeratorActions;
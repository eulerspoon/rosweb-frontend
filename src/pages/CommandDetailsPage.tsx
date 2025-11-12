import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { Command } from '../types/api';

const CommandDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [command, setCommand] = useState<Command | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние формы
  const [speed, setSpeed] = useState<number>(0.5);
  const [value, setValue] = useState<number>(1.0);
  const [quantity, setQuantity] = useState<number>(1);

  // Загрузка данных команды
  useEffect(() => {
    const fetchCommand = async () => {
      try {
        setLoading(true);
        // TODO: Заменить на реальный API вызов
        const mockCommand: Command = {
          id: parseInt(id || '1'),
          name: 'Вперед',
          description: 'Движение робота вперед на указанное расстояние',
          ros_command: 'rosservice call /move "forward"',
          status: 'active',
          image_url: '/static/images/forward.png'
        };
        setCommand(mockCommand);
      } catch (err) {
        setError('Ошибка загрузки данных команды');
        console.error('Error loading command:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCommand();
    }
  }, [id]);

  // // Обработчик добавления в маршрут
  // const handleAddToRoute = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (command) {
  //     // TODO: Реализовать добавление в маршрут через API
  //     console.log('Adding to route:', {
  //       commandId: command.id,
  //       speed,
  //       value,
  //       quantity
  //     });
      
  //     alert(`Команда "${command.name}" добавлена в маршрут!`);
  //     navigate('/commands');
  //   }
  // };

  // Изображение по умолчанию
  const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNGNUY1RjUiLz48dGV4dCB4PSIzMCIgeT0iMzAiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI2IiBmaWxsPSIjOTk5Ij5Sb2JvdDwvdGV4dD48L3N2Zz4=';

  const breadcrumbItems = [
    { label: 'Команды', path: '/commands' },
    { label: command?.name || 'Загрузка...' }
  ];

  if (loading) {
    return (
      <Container>
        <div className="text-center my-5">
          <p>Загрузка...</p>
        </div>
      </Container>
    );
  }

  if (error || !command) {
    return (
      <Container>
        <Alert variant="danger">
          {error || 'Команда не найдена'}
        </Alert>
      </Container>
    );
  }

  const isStopCommand = command.name === "Остановка";

  return (
    <Container>
      <Breadcrumbs items={breadcrumbItems} />
      
      <Row className="my-4">
        <Col>
          <div className="command-detail">
            <Row>
              <Col md={4}>
                <img 
                  src={command.image_url || defaultImage} 
                  alt={command.name}
                  className="command-image img-fluid rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultImage;
                  }}
                />
              </Col>
              <Col md={8}>
                <div className="command-content">
                  <h1 className="command-title">{command.name}</h1>
                  <p className="command-description">{command.description}</p>
                  
                  <div className="command-meta p-3 bg-light rounded mb-4">
                    <div className="meta-item">
                      <span className="meta-label fw-bold text-primary">ROS Команда:</span>
                      <span className="ms-2 font-monospace">{command.ros_command}</span>
                    </div>
                  </div>

                  {/* <Form onSubmit={handleAddToRoute}>
                    {!isStopCommand ? (
                      <>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold text-primary">
                            Скорость исполнения:
                          </Form.Label>
                          <Form.Select 
                            value={speed} 
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                          >
                            <option value="0.1">Медленная (0.1 м/с)</option>
                            <option value="0.5">Средняя (0.5 м/с)</option>
                            <option value="1.0">Быстрая (1.0 м/с)</option>
                          </Form.Select>
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold text-primary">
                            Значение:
                          </Form.Label>
                          <Form.Control
                            type="number"
                            value={value}
                            onChange={(e) => setValue(parseFloat(e.target.value))}
                            step="0.1"
                            min="0.1"
                            max="5.0"
                          />
                        </Form.Group>
                      </>
                    ) : (
                      <>
                        <input type="hidden" value="0" />
                        <input type="hidden" value="0" />
                      </>
                    )}
                    
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold text-primary">
                        Количество:
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        min="1"
                        max="10"
                      />
                    </Form.Group> */}
                    
                    {/* <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg"
                      className="w-100"
                    >
                      Добавить в маршрут
                    </Button> */}
                  {/* </Form> */}
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CommandDetailsPage;
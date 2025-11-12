import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
        Главная
      </Breadcrumb.Item>
      
      {items.map((item, index) => (
        item.path ? (
          <Breadcrumb.Item 
            key={index}
            linkAs={Link}
            linkProps={{ to: item.path }}
          >
            {item.label}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={index} active>
            {item.label}
          </Breadcrumb.Item>
        )
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
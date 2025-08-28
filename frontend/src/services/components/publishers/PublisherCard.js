import React from 'react';
import './PublisherCard.css';

const PublisherCard = ({ publisher, onEdit, onDelete }) => {
  return (
    <div className="publisher-card">
      <div className="publisher-main">
        <h3>{publisher.name}</h3>
        <p>
          <strong>Date de création:</strong>{' '}
          {publisher.createdAt ? new Date(publisher.createdAt).toLocaleDateString() : '-'}
        </p>
        <p>
          <strong>Siège:</strong> {publisher.headquarters || '-'}
        </p>
      </div>
      <div className="publisher-actions">
        <button className="btn btn-secondary" onClick={() => onEdit(publisher)}>
          ✏️ Modifier
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(publisher.id)}>
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
};

export default PublisherCard;



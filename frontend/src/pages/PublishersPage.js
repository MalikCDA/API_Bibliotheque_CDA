import React, { useState } from 'react';
import PublisherList from '../services/components/publishers/PublisherList';
import PublisherForm from '../services/components/publishers/PublisherForm';
import './BooksPage.css';

const PublishersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    setEditingPublisher(null);
    setShowForm(true);
  };

  const handleEdit = (publisher) => {
    setEditingPublisher(publisher);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingPublisher(null);
    setRefreshKey((k) => k + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPublisher(null);
  };

  return (
    <div className="books-page">
      <div className="page-header">
        <h1>🏢 Gestion des Éditeurs</h1>
        <button className="btn btn-primary" onClick={handleAdd}>➕ Ajouter un éditeur</button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-overlay" onClick={handleCancel}></div>
          <div className="form-content">
            <PublisherForm
              publisherId={editingPublisher?.id}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      <PublisherList key={refreshKey} onEdit={handleEdit} />
    </div>
  );
};

export default PublishersPage;



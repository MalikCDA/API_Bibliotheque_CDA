import React, { useEffect, useState } from 'react';
import { publisherService } from '../../api';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import PublisherCard from './PublisherCard';
import './PublisherList.css';

const PublisherList = ({ onEdit }) => {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await publisherService.getAll();
        setPublishers(data);
      } catch (e) {
        setError("Erreur lors du chargement des éditeurs");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet éditeur ?')) return;
    try {
      await publisherService.delete(id);
      setPublishers((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert("Erreur lors de la suppression de l'éditeur");
    }
  };

  if (loading) return <LoadingSpinner message="Chargement des éditeurs..." />;
  if (error) return <div className="error-message">{error}</div>;

  if (!publishers.length) {
    return <div className="empty-state">Aucun éditeur</div>;
  }

  return (
    <div className="publisher-list">
      {publishers.map((publisher) => (
        <PublisherCard
          key={publisher.id}
          publisher={publisher}
          onEdit={onEdit}
          onDelete={handleDelete}
        />)
      )}
    </div>
  );
};

export default PublisherList;



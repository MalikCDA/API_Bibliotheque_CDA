import React, { useEffect, useState } from 'react';
import { publisherService } from '../../api';
import './PublisherForm.css';

const PublisherForm = ({ publisherId = null, onSave, onCancel }) => {
  const [publisher, setPublisher] = useState({
    name: '',
    createdAt: '',
    headquarters: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (publisherId) {
      loadPublisher(publisherId);
    }
  }, [publisherId]);

  const loadPublisher = async (id) => {
    try {
      const data = await publisherService.getById(id);
      setPublisher({
        name: data.name || '',
        createdAt: data.createdAt ? data.createdAt.substring(0, 10) : '',
        headquarters: data.headquarters || ''
      });
    } catch (e) {
      setError('Erreur lors du chargement de l\'éditeur');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPublisher((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!publisher.name || !publisher.createdAt) {
      setError('Veuillez remplir les champs obligatoires');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...publisher,
        createdAt: new Date(publisher.createdAt).toISOString().split('T')[0]
      };
      const saved = publisherId
        ? await publisherService.update(publisherId, payload)
        : await publisherService.create(payload);
      onSave && onSave(saved);
    } catch (e) {
      setError("Erreur lors de l'enregistrement de l'éditeur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="publisher-form-container">
      <h3>{publisherId ? 'Modifier un éditeur' : 'Créer un éditeur'}</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="publisher-form">
        <div className="form-group">
          <label htmlFor="name">Nom *</label>
          <input id="name" name="name" type="text" value={publisher.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="createdAt">Date de création *</label>
          <input id="createdAt" name="createdAt" type="date" value={publisher.createdAt} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="headquarters">Siège</label>
          <input id="headquarters" name="headquarters" type="text" value={publisher.headquarters} onChange={handleChange} />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-cancel" onClick={onCancel} disabled={loading}>Annuler</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Enregistrement...' : (publisherId ? 'Modifier' : 'Créer')}</button>
        </div>
      </form>
    </div>
  );
};

export default PublisherForm;



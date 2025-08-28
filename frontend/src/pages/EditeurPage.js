import React, { useState, useEffect, useCallback } from 'react';
import { editeurService } from '../services/editeurService';
import './AuthorsPage.css'; // tu peux réutiliser le même CSS

const EditeurPage = () => {
  const [editeurs, setEditeurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEditeurs, setFilteredEditeurs] = useState([]);
  const [form, setForm] = useState({ nom: '', dateDeCreation: '', siege: '' });
  const [editingId, setEditingId] = useState(null);

  // Charger les éditeurs
  const loadEditeurs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await editeurService.getAll();
      setEditeurs(data);
    } catch (e) {
      setError('Erreur lors du chargement des éditeurs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEditeurs();
  }, [loadEditeurs]);

  // Filtrer les éditeurs
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEditeurs(editeurs);
    } else {
      setFilteredEditeurs(
        editeurs.filter(e =>
          e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (e.siege && e.siege.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
  }, [editeurs, searchTerm]);

  // Gérer le formulaire
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await editeurService.update(editingId, form);
      } else {
        await editeurService.create(form);
      }
      setForm({ nom: '', dateDeCreation: '', siege: '' });
      setEditingId(null);
      loadEditeurs();
    } catch (e) {
      setError('Erreur lors de la sauvegarde de l’éditeur');
    }
  };

  const handleEdit = editeur => {
    setForm({
      nom: editeur.nom,
      dateDeCreation: editeur.dateDeCreation,
      siege: editeur.siege
    });
    setEditingId(editeur.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Supprimer cet éditeur ?')) return;
    try {
      await editeurService.delete(id);
      loadEditeurs();
    } catch (e) {
      setError('Erreur lors de la suppression');
    }
  };

  return (
    <div className="authors-page-container">
      <h2>Liste des éditeurs</h2>

      <input
        type="text"
        placeholder="Rechercher un éditeur..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <table className="authors-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Date de création</th>
              <th>Siège</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEditeurs.map(editeur => (
              <tr key={editeur.id}>
                <td>{editeur.nom}</td>
                <td>{editeur.dateDeCreation}</td>
                <td>{editeur.siege}</td>
                <td>
                  <button onClick={() => handleEdit(editeur)} className="btn-edit">✏</button>
                  <button onClick={() => handleDelete(editeur.id)} className="btn-delete">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>{editingId ? 'Modifier' : 'Ajouter'} un éditeur</h3>

      <form onSubmit={handleSubmit} className="author-form">
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={form.nom}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dateDeCreation"
          placeholder="Date de création"
          value={form.dateDeCreation}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="siege"
          placeholder="Siège"
          value={form.siege}
          onChange={handleChange}
        />
        <button type="submit" className="btn-save">
          {editingId ? 'Enregistrer' : 'Ajouter'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ nom: '', dateDeCreation: '', siege: '' });
              setEditingId(null);
            }}
            className="btn-cancel"
          >
            Annuler
          </button>
        )}
      </form>
    </div>
  );
};

export default EditeurPage;

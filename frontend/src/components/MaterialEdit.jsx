/**
 * Componente para editar materiales
 */

import { useState, useEffect } from 'react';
import api from '../services/api';
import { FiX, FiFileText, FiLink, FiBook, FiUpload } from 'react-icons/fi';

const MaterialEdit = ({ material, onCancel, onUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apunte',
    url: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (material) {
      setFormData({
        title: material.title || '',
        description: material.description || '',
        type: material.type || 'apunte',
        url: material.type === 'enlace' ? material.url : '',
        file: null
      });
    }
  }, [material]);

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      setFormData({
        ...formData,
        file: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (!formData.title) {
      setError('El título es requerido');
      setLoading(false);
      return;
    }

    if (formData.type === 'enlace' && !formData.url) {
      setError('La URL es requerida para enlaces');
      setLoading(false);
      return;
    }

    try {
      const updateData = new FormData();
      updateData.append('title', formData.title);
      updateData.append('description', formData.description);
      updateData.append('type', formData.type);
      
      if (formData.type === 'enlace') {
        updateData.append('url', formData.url);
      }
      
      if (formData.file) {
        updateData.append('file', formData.file);
      }

      await api.put(`/materials/${material.id}`, updateData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onUpdated();
    } catch (error) {
      setError(error.response?.data?.error || 'Error al actualizar el material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 fade-in border-2 border-primary-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Editar Material</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Material
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="apunte">Apunte</option>
            <option value="pdf">PDF</option>
            <option value="enlace">Enlace</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ej: Apuntes de React Hooks"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Describe el material..."
          />
        </div>

        {formData.type === 'enlace' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL *
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://..."
            />
          </div>
        )}

        {formData.type === 'pdf' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nuevo Archivo PDF (opcional - dejar vacío para mantener el actual)
            </label>
            <div className="flex items-center space-x-2">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  name="file"
                  accept=".pdf"
                  onChange={handleChange}
                  className="hidden"
                />
                <div className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2">
                  <FiFileText className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {formData.file ? formData.file.name : 'Seleccionar nuevo archivo PDF (opcional)'}
                  </span>
                </div>
              </label>
            </div>
            {material.fileName && !formData.file && (
              <p className="text-xs text-gray-500 mt-1">
                Archivo actual: {material.fileName}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FiUpload className="h-4 w-4" />
            <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MaterialEdit;





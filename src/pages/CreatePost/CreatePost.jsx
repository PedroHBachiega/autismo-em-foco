// src/pages/Comunidade/CreatePost/CreatePost.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import { useGTM } from '../../context/GTMContext';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import styles from './CreatePost.module.css';
import { db, storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuthValue();
  const { trackPostCreation } = useGTM();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Se não houver usuário autenticado, direciona para a página de login
  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setLoading(true);

    // Validação de campos obrigatórios
    if (!title.trim() || !body.trim() || !tags.trim()) {
      setFormError('Por favor, preencha todos os campos!');
      setLoading(false);
      return;
    }

    // Processa as tags em array
    const tagsArray = tags
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tagItem) => tagItem.length > 0);

    try {
      let imageUrl = '';

      if (imageFile) {
        const imageRef = ref(storage, `posts/${uuidv4()}-${imageFile.name}`);
        const uploadSnap = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(uploadSnap.ref);
      }

      // Cria novo documento em "posts"
      const docRef = await addDoc(collection(db, 'posts'), {
        title: title.trim(),
        body: body.trim(),
        tags: tagsArray,
        imageUrl,
        uid: user.uid,
        createdBy: user.displayName || user.email,
        createdAt: Timestamp.now(),
      });

      // Rastrear evento de criação de post
      trackPostCreation(docRef.id, tagsArray);

      // Redireciona para o dashboard após criar o post
      navigate('/comunidade');
    } catch (error) {
      console.error('Erro ao criar o post:', error);
      setFormError('Erro ao criar o post. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.create_post}>
      <h2>Criar Post</h2>
      <p>Crie seu post e compartilhe seu conhecimento</p>

      <form onSubmit={handleSubmit}>
        <label>
          <span>Título:</span>
          <input
            type="text"
            name="title"
            placeholder="Título do post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />
        </label>

        <label>
          <span>Conteúdo:</span>
          <textarea
            name="body"
            placeholder="Conteúdo do post"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={loading}
            required
          ></textarea>
        </label>

        <label>
          <span>Tags:</span>
          <input
            type="text"
            name="tags"
            placeholder="Tags (separadas por vírgula)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={loading}
            required
          />
        </label>

        <label>
          <span>Imagem (opcional):</span>
          <input 
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          disabled={loading} 
          />
        </label>

        {imagePreview && (
          <div className={styles.image_preview}>
            <p>Prévia da imagem:</p>
            <img 
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: '300px', borderRadius: '8px' }}
            />
          </div>
        )}

        {!loading && (
          <button type="submit" className={styles.btn}>
            Criar
          </button>
        )}
        {loading && (
          <button type="button" className="btn" disabled>
            Aguarde...
          </button>
        )}

        {formError && <p className={styles.error}>{formError}</p>}
      </form>
    </div>
  );
};

export default CreatePost;

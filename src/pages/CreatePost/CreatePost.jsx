// src/pages/Comunidade/CreatePost/CreatePost.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import styles from './CreatePost.module.css';

const CreatePost = () => {

  const navigate = useNavigate();
  const { user } = useAuthValue();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Se não houver usuário autenticado, direciona para a página de login
  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);

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
      // Cria novo documento em "posts"
      await addDoc(collection(db, 'posts'), {
        title: title.trim(),
        body: body.trim(),
        tags: tagsArray,
        uid: user.uid,
        createdBy: user.displayName || user.email,
        createdAt: Timestamp.now(),
      });

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
      <p className={styles.subtitle}>Crie seu post e compartilhe seu conhecimento</p>

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
            className={styles.input_field}
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
            className={styles.textarea_field}
          ></textarea>
        </label>

        <label html="tags" className={styles.tags_label}>
          <span>Tags:</span>
          <input
            type="text"
            name="tags"
            placeholder="Tags (separadas por vírgula)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            disabled={loading}
            required
            className={styles.input_field}
          />
        </label>

        <div className={styles.form_actions}>
        {!loading ? (
          <button type="submit" className={styles.btn}>
            Criar Post
          </button>
        ) : (
        <button type="button" className={`${styles.btn} ${styles.btn_loading}`} disabled>
          <span className={styles.spinner}></span>
          Aguarde...
        </button>
        )}
        </div>

        {formError && <p className={styles.error}>{formError}</p>}
      </form>
    </div>
  );
};

export default CreatePost;
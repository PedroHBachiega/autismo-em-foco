<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from '../../context/AuthContext';
import { useGTM } from '../../context/GTMContext';
import { useGamification } from '../../Hooks/useGamification';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import styles from './CreatePost.module.css';
import { db, storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Button from '../../components/Button';
import * as Yup from 'yup';
import { MdCreate } from 'react-icons/md';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuthValue();
  const { trackPostCreation } = useGTM();
  const { trackAction } = useGamification();

  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Schema de validação com Yup
  const validationSchema = Yup.object({
    title: Yup.string().required('O título é obrigatório'),
    body: Yup.string().required('O conteúdo é obrigatório'),
    tags: Yup.string().required('As tags são obrigatórias'),
  });
=======
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
>>>>>>> origin/main

  // Se não houver usuário autenticado, direciona para a página de login
  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);

<<<<<<< HEAD
  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    setFieldValue('imageFile', file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setFormError('');
    setLoading(true);
    setSubmitting(true);

    // Processa as tags em array
    const tagsArray = values.tags
=======
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
>>>>>>> origin/main
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tagItem) => tagItem.length > 0);

    try {
<<<<<<< HEAD
      let imageUrl = '';

      if (values.imageFile) {
        const imageRef = ref(storage, `posts/${uuidv4()}-${values.imageFile.name}`);
        const uploadSnap = await uploadBytes(imageRef, values.imageFile);
        imageUrl = await getDownloadURL(uploadSnap.ref);
      }

      // Cria novo documento em "posts"
      const docRef = await addDoc(collection(db, 'posts'), {
        title: values.title.trim(),
        body: values.body.trim(),
        tags: tagsArray,
        imageUrl,
=======
      // Cria novo documento em "posts"
      await addDoc(collection(db, 'posts'), {
        title: title.trim(),
        body: body.trim(),
        tags: tagsArray,
>>>>>>> origin/main
        uid: user.uid,
        createdBy: user.displayName || user.email,
        createdAt: Timestamp.now(),
      });

<<<<<<< HEAD
      // Rastrear evento de criação de post
      trackPostCreation(docRef.id, tagsArray);
      
      // Adicionar pontos de gamificação
      await trackAction('CREATE_POST');
      
      // Redireciona para o dashboard após criar o post
      navigate('/comunidade', { state: { postCriado: true} });
=======
      // Redireciona para o dashboard após criar o post
      navigate('/comunidade');
>>>>>>> origin/main
    } catch (error) {
      console.error('Erro ao criar o post:', error);
      setFormError('Erro ao criar o post. Tente novamente.');
      setLoading(false);
<<<<<<< HEAD
      setSubmitting(false);
=======
>>>>>>> origin/main
    }
  };

  return (
    <div className={styles.create_post}>
      <h2>Criar Post</h2>
      <p>Crie seu post e compartilhe seu conhecimento</p>

<<<<<<< HEAD
      <Formik
        initialValues={{
          title: '',
          body: '',
          tags: '',
          imageFile: null
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className={styles.form_group}>
              <label htmlFor="title">Título:</label>
              <Field
                type="text"
                id="title"
                name="title"
                placeholder="Título do post"
                disabled={loading || isSubmitting}
                aria-required="true"
                aria-describedby="title-error"
              />
              <ErrorMessage name="title" component="div" className={styles.error} id="title-error" />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="body">Conteúdo:</label>
              <Field
                as="textarea"
                id="body"
                name="body"
                placeholder="Conteúdo do post"
                disabled={loading || isSubmitting}
                aria-required="true"
                aria-describedby="body-error"
              />
              <ErrorMessage name="body" component="div" className={styles.error} id="body-error" />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="tags">Tags:</label>
              <Field
                type="text"
                id="tags"
                name="tags"
                placeholder="Tags (separadas por vírgula)"
                disabled={loading || isSubmitting}
                aria-required="true"
                aria-describedby="tags-error"
              />
              <ErrorMessage name="tags" component="div" className={styles.error} id="tags-error" />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="imageFile">Imagem (opcional):</label>
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setFieldValue)}
                disabled={loading || isSubmitting}
                aria-describedby="image-preview"
              />
            </div>

            {imagePreview && (
              <div className={styles.image_preview} id="image-preview">
                <p>Prévia da imagem:</p>
                <img
                  src={imagePreview}
                  alt="Preview da imagem carregada"
                  style={{ maxWidth: '300px', borderRadius: '8px' }}
                />
              </div>
            )}

            <Button
              type="submit"
              loading={loading || isSubmitting}
              loadingText="Criando..."
              variant="primary"
              size="large"
              icon={<MdCreate />}
              ariaLabel="Criar nova postagem"
            >
              Criar Post
            </Button>

            {formError && <p className={styles.error}>{formError}</p>}
          </Form>
        )}
      </Formik>
=======
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
>>>>>>> origin/main
    </div>
  );
};

export default CreatePost;

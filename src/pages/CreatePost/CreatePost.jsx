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
import * as Yup from 'yup';

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

  // Se não houver usuário autenticado, direciona para a página de login
  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);

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
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tagItem) => tagItem.length > 0);

    try {
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
        uid: user.uid,
        createdBy: user.displayName || user.email,
        createdAt: Timestamp.now(),
      });

      // Rastrear evento de criação de post
      trackPostCreation(docRef.id, tagsArray);
      
      // Adicionar pontos de gamificação
      await trackAction('CREATE_POST');
      
      // Redireciona para o dashboard após criar o post
      navigate('/comunidade', { state: { postCriado: true} });
    } catch (error) {
      console.error('Erro ao criar o post:', error);
      setFormError('Erro ao criar o post. Tente novamente.');
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.create_post}>
      <h2>Criar Post</h2>
      <p>Crie seu post e compartilhe seu conhecimento</p>

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
              />
              <ErrorMessage name="title" component="div" className={styles.error} />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="body">Conteúdo:</label>
              <Field
                as="textarea"
                id="body"
                name="body"
                placeholder="Conteúdo do post"
                disabled={loading || isSubmitting}
              />
              <ErrorMessage name="body" component="div" className={styles.error} />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="tags">Tags:</label>
              <Field
                type="text"
                id="tags"
                name="tags"
                placeholder="Tags (separadas por vírgula)"
                disabled={loading || isSubmitting}
              />
              <ErrorMessage name="tags" component="div" className={styles.error} />
            </div>

            <div className={styles.form_group}>
              <label htmlFor="imageFile">Imagem (opcional):</label>
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setFieldValue)}
                disabled={loading || isSubmitting}
              />
            </div>

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

            {!loading && !isSubmitting && (
              <button type="submit" className={styles.btn}>
                Criar
              </button>
            )}
            {(loading || isSubmitting) && (
              <button type="button" className="btn" disabled>
                Aguarde...
              </button>
            )}

            {formError && <p className={styles.error}>{formError}</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreatePost;

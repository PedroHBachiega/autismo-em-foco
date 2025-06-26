
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
<<<<<<< HEAD
import ReadAloudButton from '../../components/ReadAloudButton/ReadAloudButton';
=======
>>>>>>> origin/main

const Post = () => {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true)
            try {
                const docRef = doc(db, "posts", id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setPost({
                        id: docSnap.id,
                        ...docSnap.data()
                    })
                } else {
                    setError("Post não encontrado")
                }
            } catch (error) {
                console.error("Erro ao buscar post:", error)
                setError("Erro ao carregar o post")
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [id])

<<<<<<< HEAD
    // Função para preparar o texto para leitura - MOVIDA PARA DENTRO DO COMPONENTE
    const getReadableContent = () => {
        if (!post) return "";
        let content = `Título: ${post.title}. `;
        content += `Autor: ${post.createdBy}. `;
        content += `Conteúdo: ${post.body}`;
        
        if (post.tags && post.tags.length > 0) {
            content += `. Tags: ${post.tags.join(", ")}`;
        }
        
        return content;
    };

    return (
        <div className="post-container" style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
            {loading && <p>Carregando post...</p>}
            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
            {post && (
                <>
                    <h1 style={{ fontSize: '2rem', color: '#2e5eaa', marginBottom: '10px' }}>{post.title}</h1>
                    <div className="post-author" style={{ marginBottom: '20px' }}>
                        <p>por {post.createdBy}</p>
                    </div>
                    
                    {/* Botão de leitura - MOVIDO PARA DENTRO DO JSX */}
                    <ReadAloudButton text={getReadableContent()} label="Ler postagem" />
                    
                    {post.imageUrl && (
                        <div className="post-image" style={{ margin: '1rem 0', textAlign: 'center' }}>
                            <img 
                            src={post.imageUrl} 
                            alt="Imagem do post"
                            style={{
                                maxWidth: '100%',
                                borderRadius: '12px',
                                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
                            }} 
                            />
                        </div>
                    )}
                    
                    <div className="post-content" style={{ margin: '20px 0', lineHeight: '1.6' }}>
                        <p>{post.body}</p>
                    </div>
                    {post.tags && (
                        <div className="tags" style={{ marginTop: '20px' }}>
                            {post.tags.map((tag) => (
                                <span key={tag} style={{ 
                                    background: '#e3f2fd', 
                                    color: '#1976d2', 
                                    padding: '4px 8px', 
                                    borderRadius: '12px', 
                                    marginRight: '8px',
                                    fontSize: '0.9rem'
                                }}>#{tag}</span>
=======
    return (
        <div className={styles.post_container}>
            {loading && <p>Carregando post...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {post && (
                <>
                    <h1>{post.title}</h1>
                    <div className={styles.post_author}>
                        <p>por {post.createdBy}</p>
                    </div>
                    <div className={styles.post_content}>
                        <p>{post.body}</p>
                    </div>
                    {post.tags && (
                        <div className={styles.tags}>
                            {post.tags.map((tag) => (
                                <span key={tag}>#{tag}</span>
>>>>>>> origin/main
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

<<<<<<< HEAD
export default Post
=======
export default Post 
>>>>>>> origin/main

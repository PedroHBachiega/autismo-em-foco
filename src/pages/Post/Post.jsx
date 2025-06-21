
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import ReadAloudButton from '../../components/ReadAloudButton/ReadAloudButton'

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

    // Função para preparar o texto para leitura
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
                    
                    {/* Botão de leitura */}
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
                    
                    <div className="post-content" style={{ marginTop: '20px', lineHeight: '1.6' }}>
                        <p>{post.body}</p>
                    </div>
                    {post.tags && (
                        <div className="tags" style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {post.tags.map((tag) => (
                                <span key={tag} style={{ 
                                    background: '#e6f2ff', 
                                    padding: '4px 10px', 
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    color: '#2e5eaa'
                                }}>#{tag}</span>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Post
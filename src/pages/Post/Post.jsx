
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'

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
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Post 
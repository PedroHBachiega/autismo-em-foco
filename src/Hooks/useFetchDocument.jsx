import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { doc, getDoc } from "firebase/firestore"

<<<<<<< HEAD
export const useFetchDocument = (collection, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Se não tivermos um id válido, zera estados e sai
    if (!id) {
      setDocument(null)
      setError(null)
      setLoading(false)
      return
    }

    const loadDocument = async () => {
      setLoading(true)
      setError(null)

      try {
        const docRef = doc(db, collection, id)       // doc() é síncrono
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          // inclui o próprio id no objeto retornado
          setDocument({ id: docSnap.id, ...docSnap.data() })
        } else {
          setDocument(null)
          setError(`Documento "${id}" não encontrado em "${collection}".`)
        }
      } catch (err) {
        console.error("Erro ao buscar documento:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [collection, id])

  return { document, loading, error }
}
=======
export const useFetchDocument = (docCollection, id) => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        const loadDocument = async () => {
            setLoading(true);

            try {
                const docRef = await doc(db, docCollection, id);
                const docSnap = await getDoc(docRef);

                setDocument(docSnap.data());
            } catch (error) {
                console.log(error);
                setError(error.message);
            } 
            setLoading(false);
        }
        loadDocument();
    }, [docCollection, id])

    console.log(document);

    return { document, loading, error };
}
>>>>>>> origin/main

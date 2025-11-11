import { useState, useEffect, useReducer } from "react"
import { db } from '../firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import api from '../services/apiClient'

const initialState = {
    loading: null,
    error: null,
}

const insertReducer = (state, action) =>{
    switch(action.type){
        case "LOADING":
            return {loading: true, error: null}
        case "INSERTED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: true, error: action.payload}
        default:
            return state
    }
}

export const useInsertDocument = (docCollection) => {
    const [response, dispatch] = useReducer(insertReducer, initialState)
    const [cancelled, setCancelled] = useState(false)

    const checkCancelBeforeDispatch = (action) => {
        if(!cancelled){
            dispatch(action)
        }
    }

    const insertDocument = async (document) => {
        checkCancelBeforeDispatch({type:"LOADING"})
        try{
            if (docCollection === 'agendamentos') {
                // Create via API and return a pseudo docRef with id
                const result = await api.post('/agendamentos', document)
                const docRef = { id: result.id }
                checkCancelBeforeDispatch({ type: "INSERTED_DOC", payload: docRef })
                return docRef
            } else {
                const newDocument = { ...document, createAt: Timestamp.now() }
                const docRef = await addDoc(
                    collection(db, docCollection),
                    newDocument
                )

                checkCancelBeforeDispatch({
                    type:"INSERTED_DOC",
                    payload: docRef
                })
                
                return docRef
            }
        }catch(error){
            checkCancelBeforeDispatch({type:"ERROR", payload: error.message})
            throw error; // Propagar o erro para ser tratado pelo chamador
        }
    }

    useEffect(() =>{
        return () => setCancelled(true)
    }, [])

    return{insertDocument, response}
}
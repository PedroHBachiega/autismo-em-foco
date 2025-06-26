import { useState, useEffect, useReducer } from "react"
<<<<<<< HEAD
import { db } from '../firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
=======
import db from '../firebase/config'
import {collection, addDoc, Timestamp} from 'firebase/firestore'
>>>>>>> origin/main

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
            const newDocument = {...document, createAt:Timestamp.now()}
<<<<<<< HEAD
            const docRef = await addDoc(
=======
            const insertDocument = await addDoc(
>>>>>>> origin/main
                collection(db, docCollection),
                newDocument
            )

            checkCancelBeforeDispatch({
                type:"INSERTED_DOC",
<<<<<<< HEAD
                payload: docRef
            })
            
            // Retornar a referência do documento para uso posterior
            return docRef;
        }catch(error){
            checkCancelBeforeDispatch({type:"ERROR", payload: error.message})
            throw error; // Propagar o erro para ser tratado pelo chamador
=======
                payload: insertDocument
            })
        }catch(error){
            checkCancelBeforeDispatch({type:"ERROR", payload: error.message})
>>>>>>> origin/main
        }
    }

    useEffect(() =>{
        return () => setCancelled(true)
    }, [])

    return{insertDocument, response}
}
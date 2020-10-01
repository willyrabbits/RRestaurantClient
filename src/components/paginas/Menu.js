import React, { useState, useEffect, useContext } from 'react'
import { Link } from "react-router-dom"
import { FirebaseContext } from '../../firebase'

import Plato from '../ui/Plato'

const Menu = () => {

    const [dishes, setDishes] = useState([])

    const { firebase } = useContext(FirebaseContext)

    useEffect(() => {
        const getDishes = () => {
            //get() no tienes los beneficios del REAL TIME DATABASE, por eso usamos .onSnapshot
            firebase.db.collection('productos').onSnapshot(handleSnapshot)
        }
        getDishes()
    }, [])

    // snapshot to use realtime data base
    function handleSnapshot(snapshot) {
        const dishes = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });
        // store dishes on state
        setDishes(dishes)
    }

    return (
        <>
            <h1 className="text-3xl font-light mb-4">Menu</h1>
            <Link to="/nuevo-plato" className="bg-blue-800 hover:bg-blue-700 inline-block mb-5 p-2 text-white uppercase font-bold">
                Add dish
            </Link>

            {dishes.map(plato => (
                <Plato
                    key={plato.id}
                    plato={plato}
                />

            ))}
        </>
    )
}

export default Menu;
import React, { useEffect, useState, useContext } from 'react'
import { FirebaseContext } from '../../firebase'
import Orden from '../ui/Orden'

const Ordenes = () => {

    // context with firebase stuff
    const { firebase } = useContext(FirebaseContext)

    const [ordenes, setOrdenes] = useState([])

    useEffect(() => {
        const getOrders = () => {
            firebase.db
                .collection('ordenes')
                .where('completado', '==', false)
                .onSnapshot(handleSnapshot)
        }
        getOrders()
    }, [])

    function handleSnapshot(snapshot) {
        const orders = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
        setOrdenes(orders)
    }

    return (
        <>
            <h1 className="text-3xl font-light mb-4">Ordenes</h1>
            <div className="sm:flex sm:flex-wrap -mx-3">
                {ordenes.map(orden => (
                    <Orden
                        key={orden.id}
                        orden={orden}
                    />
                ))}
            </div>
        </>
    )
}

export default Ordenes;
import React, { useState, useContext } from 'react'
import { FirebaseContext } from '../../firebase'

const Ordenes = ({ orden }) => {

    const [tiempoentrega, setTiempoEntrega] = useState(0)

    const { firebase } = useContext(FirebaseContext)

    // define deliver time in teal time
    const definirTiempo = id => {
        try {
            firebase.db.collection('ordenes')
                .doc(id)
                .update({ tiempoentrega })
        } catch (error) {
            console.warn(error)
        }
    }

    const completeOrder = id => {
        try {
            firebase.db
                .collection('ordenes')
                .doc(id)
                .update({ completado: true })
        } catch (error) {
            console.warn(error)
        }
    }

    return (
        <div className="sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="p-3 shadow-md bg-white">
                <h1 className="text-yellow-600 text-lg font-bold">{orden.id}</h1>
                {orden.orden.map(platos => (
                    <p key={platos.id} className="text-gray-600">{platos.amount} {platos.nombre}</p>
                ))}
                <p className="text-gray-700 font-bold">Total to pay: ${orden.total}</p>
                {orden.tiempoentrega === 0 && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mt-3">
                            ETA
                        </label>
                        <input
                            type="number"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            min='1'
                            max='20'
                            placeholder='10'
                            value={tiempoentrega}
                            onChange={e => setTiempoEntrega(parseInt(e.target.value))}
                        />
                        <button
                            type='submit'
                            className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 uppercase text-white font-bold"
                            onClick={() => { definirTiempo(orden.id) }}
                        >
                            Set timer
                        </button>
                    </div>
                )}

                {orden.tiempoentrega > 0 && (
                    <p className="text-gray-700">
                        ETA:
                        <span className="font-bold"> {orden.tiempoentrega}min</span>
                    </p>
                )}

                {!orden.completado && orden.tiempoentrega > 0 && (
                    <button
                        type="button"
                        className="bg-blue-800 hover:bg-blue-700 w-full mt-5 p-2 text-white uppercase font-bold"
                        onClick={() => completeOrder(orden.id)}
                    >
                        Check as ready
                    </button>
                )}
            </div>
        </div>
    )
}

export default Ordenes;
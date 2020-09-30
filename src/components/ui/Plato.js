import React, { useContext, useRef } from 'react'
import { FirebaseContext } from '../../firebase'

const Plato = ({ plato }) => {

    const { id, nombre, imagen, existencia, categoria, precio, descripcion } = plato

    // firebase context for DB changes
    const { firebase } = useContext(FirebaseContext)

    // REF to acces to a value in the DOM
    const existenciaRef = useRef(existencia)

    // edit dish state at firebase
    const updateAvailability = () => {
        const exist = (existenciaRef.current.value === "true")

        try {
            firebase.db.collection('productos').doc(id).update({ existencia: exist })
        } catch (error) {
            console.warn(error)
        }
    }

    return (
        <>
            <div className="w-full px-3 mb-4">
                <div className="p-5 shadow-md bg-white">
                    <div className="lg:flex">
                        <div className="lg:w-5/12 xl:w-3/12">
                            <img src={imagen} alt="dish img" />
                            <div className="sm:flex sm:-mx-2 pl-2">
                                <label className="block mt-5 sm:w-2/4">
                                    <span className="block text-gray-800 mb-2">Stock</span>
                                    <select
                                        className="bg-white shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                        value={existencia}
                                        ref={existenciaRef}
                                        onChange={() => updateAvailability()}
                                    >
                                        <option value="true">Available</option>
                                        <option value="false">Unavailable</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                        <div className="lg:w-7/12 xl:w-9/12 pl-5">
                            <p className="font-bold text-2xl text-yellow-600 mb-4">{nombre}</p>
                            <p className="text-gray-600 mb-4">Type: {' '}
                                <span className="text-gray-700 font-bold">{categoria.toUpperCase()}</span>
                            </p>
                            <p className="text-gray-600 mb-4">{descripcion}</p>
                            <p className="text-gray-600 mb-4">Price: {' '}
                                <span className="text-gray-700 font-bold">${precio}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Plato;
import React, { useContext, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FirebaseContext } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import FileUploader from 'react-firebase-file-uploader'

const NuevoPlato = () => {

    //state for the images
    const [subiendo, setSubiendo] = useState(false)
    const [progreso, setProgreso] = useState(0)
    const [urlImagen, setUrlImagen] = useState('')

    // context with firebase stuff
    const { firebase } = useContext(FirebaseContext)

    // hook para redireccionas
    const navigate = useNavigate()

    // validation & get values from Form
    const formik = useFormik({
        initialValues: {
            nombre: '',
            precio: '',
            categoria: '',
            imagen: '',
            descripcion: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .min(3, 'Name too short (+3 letters)')
                .required('Name is mandatory'),
            precio: Yup.number()
                .min(1, 'Add a price')
                .required('Price is mandatory'),
            categoria: Yup.string()
                .required('Choose a tyope'),
            descripcion: Yup.string()
                .min(10, 'Description too short (+10 letters)')
                .required('Description is mandatory'),
        }),
        onSubmit: newDish => {
            try {
                newDish.existencia = true
                newDish.imagen = urlImagen
                console.log(newDish)
                firebase.db.collection('productos').add(newDish)

                navigate('/menu')
            } catch (error) {
                console.warn(error)
            }
        }
    })

    // uploading images stuff
    const handleUploadStart = () => {
        setProgreso(0)
        setSubiendo(true)
    }

    const handleUploadError = error => {
        setSubiendo(false)
        console.warn(error)
    }

    const handleUploadSuccess = async nombre => {
        setProgreso(100)
        setSubiendo(false)

        // save URL
        const url = await firebase.storage.ref("productos").child(nombre).getDownloadURL()
        console.log(url)
        setUrlImagen(url)
    }

    const handleProgress = progress => {
        setProgreso(progress)
        console.log(progress)
    }

    return (
        <>
            <h1 className="text-3xl font-light mb-4">New Dish</h1>
            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Name</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nombre"
                                type="text"
                                placeholder="Dish name"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Price</label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="precio"
                                type="number"
                                placeholder="$20"
                                min="0"
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.precio && formik.errors.precio ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.precio}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">Type</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="categoria"
                                name="categoria"
                                value={formik.values.categoria}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value=""> - Choose - </option>
                                <option value="desayuno">Breakfast</option>
                                <option value="comida">Lunch</option>
                                <option value="cena">Dinner</option>
                                <option value="bebida">Drink</option>
                                <option value="postre">Desert</option>
                                <option value="ensalada">Salad</option>
                            </select>
                        </div>
                        {formik.touched.categoria && formik.errors.categoria ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.categoria}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imagen">Picture</label>
                            {/* <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="imagen"
                                type="file"
                                value={formik.values.imagen}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            /> */}
                            <FileUploader
                                accept="image/*"
                                id="imagen"
                                name="imagen"
                                randomizeFilename
                                storageRef={firebase.storage.ref("productos")}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                            />
                        </div>

                        {subiendo && (
                            <div className="h-12 relative w-full border">
                                <div className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center" style={{ width: `${progreso}%` }}>
                                    {progreso} %
                                </div>
                            </div>
                        )}

                        {urlImagen && (
                            <p className="bg-green-500 text-white p-3 text-center my-5">
                                Image uploaded successfully.
                            </p>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">Description</label>
                            <textarea
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                                id="descripcion"
                                placeholder="Description of the dish"
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            ></textarea>
                        </div>
                        {formik.touched.descripcion && formik.errors.descripcion ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.descripcion}</p>
                            </div>
                        ) : null}

                        <input
                            type="submit"
                            className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                            value="Add Dish"
                        />

                    </form>
                </div>
            </div>
        </>
    )
}

export default NuevoPlato;
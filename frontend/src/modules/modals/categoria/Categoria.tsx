import "./Categoria.css"
import "../ColorMan.css"
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import config from "../../../config";
import "../Modal.css"
import { ChevronRight, Edit, Package, Plus, Trash } from "lucide-react";


export default function Categoria() {
    const [isOpen, setIsOpen] = useState(false)
    const [content, setContent] = useState([])
    const [errorMessage, setErrorMessage] = useState("")

    const [showModels, setShowModels] = useState("")
    const [addingCategory, setAddingCategory] = useState(false)
    const [addModelOpen, setAddModelOpen] = useState("")

    const [categoryName, setCategoryName] = useState("")
    const [categoryCode, setCategoryCode] = useState("")

    const [modelName, setModelName] = useState("")
    const [modelCode, setModelCode] = useState("")

    const loadCategories = async () => {
        const res = await axios.get(`${config.dev.apiUrl}/categories`).then(res => res.data.data).catch(() => []);
        return setContent(res);
    }

    useEffect(() => {
        const handleCategoriesUpdated = () => loadCategories()
        window.addEventListener('categoriesUpdated', () => handleCategoriesUpdated())
        return () => window.removeEventListener('categoriesUpdated', handleCategoriesUpdated)
    }, [isOpen])
    useEffect(() => {
        loadCategories()
    }, [])


    const handleAddCategory = async () => {
        if (!categoryName.trim() || !categoryCode.trim()) {
            setErrorMessage("Preencha todos os campos obrigatórios.")
            return
        }

        const newCategory = {
            produto: categoryName,
            codigo: categoryCode.toUpperCase(),
            modelos: [{
                nome: "Modelo Único",
                codigo: "00"
            }]
        }

        await axios.post(`${config.dev.apiUrl}/categories`, newCategory)

        setCategoryName("")
        setCategoryCode("")
        setAddingCategory(false)
        setErrorMessage("")
        window.dispatchEvent(new CustomEvent('categoriesUpdated'))
    }

    const handleAddModel = async (categoryId: string) => {
        if (!modelName.trim()) {
            setErrorMessage("Preencha todos os campos obrigatórios.")
            return
        }

        const newModel = {
            nome: modelName,
            codigo: modelCode.toUpperCase()
        }

        await axios.get(`${config.dev.apiUrl}/categories/${categoryId}`).then(res => {
            const category = res.data.data
            if (category.modelos.some((mod: { codigo: string }) => mod.codigo === newModel.codigo)) {
                setErrorMessage("Código de modelo já existe nessa categoria.")
                return
            }
        })
        await axios.patch(`${config.dev.apiUrl}/categories/${categoryId}`, newModel)
        setModelName("")
        setModelCode("")
        setAddModelOpen("")
        setErrorMessage("")
        window.dispatchEvent(new CustomEvent('categoriesUpdated'))
    }

    const handleSub = (id: string) => {
        showModels !== id ? setShowModels(id) : setShowModels("")
        if (showModels === "") setAddModelOpen("")
    }

    const deleteCategory = async (id: string) => {
        if (!confirm("Excluir esta categoria e todos os seus modelos?")) return
        await axios.delete(`${config.dev.apiUrl}/categories/${id}`)
        window.dispatchEvent(new CustomEvent('categoriesUpdated'))
    }

    const deleteModel = async (id: string, codigo: string) => {
        if (!confirm("Excluir este modelo?")) return
        await axios.patch(`${config.dev.apiUrl}/categories/${id}/modelos`, { codigo: codigo })
        window.dispatchEvent(new CustomEvent('categoriesUpdated'))
    }
    return (
        <>
            <button onClick={() => setIsOpen(true)} className="flex gap-2 items-center text-gray-700 text-md font-bold header-btn"><Edit /> Gerenciar categorias</button>
            {isOpen && createPortal(
                <>
                    <div
                        className="backdrop"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="text-black overflow-y-auto flex-1 font-sans dialog categoria flex flex-col">
                        <div className="border-b mb-10 py-5 flex px-10 flex-col">
                            <h2 className="text-[30px]">Gerenciar Produtos</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {content.length} categorias
                            </p>
                        </div>
                        <div className="mx-10 flex-1">
                            {content.map((cat: { _id: string; produto: string; codigo: string; modelos: []; }) => (
                                <div key={cat._id} className="border border-gray-300 rounded-md shadow-sm flex flex-col gap-2 w-full mb-4 space-y-2 category-item">
                                    <div className="cursor-pointer px-5 flex justify-between items-center category-header" onClick={() => handleSub(cat._id)}>
                                        <ChevronRight className={`transition-transform w-10 text-gray-600 ${showModels === cat._id ? "rotate-90" : null}`} />
                                        <Package className="w-20 h-20 text-[#562ace] mx-5" />
                                        <div className="flex items-center gap-2 w-full">
                                            <p className="text-lg font-bold text-zinc-800">{cat.produto}</p>
                                            <pre className="border border-gray-300 text-xs text-gray-500 font-mono rounded-md px-2">{cat.codigo}</pre>
                                            <span className="text-sm text-gray-500">Modelos: {cat.modelos.length > 0 ? cat.modelos.length : 'Modelo Único'}</span>
                                        </div>


                                        <div className="flex w-full justify-end items-center gap-4">
                                            <a onClick={() => { deleteCategory(cat._id) }}><Trash color="red" /></a>
                                        </div>

                                    </div>
                                    {showModels === cat._id ? (
                                        <>
                                            {cat.modelos.map((model: { _id: string; nome: string; codigo: string; }, index: number) => (
                                                <div key={index} className="flex flex-1 gap-4 items-center pr-5 pl-15 py-5 border-t border-gray-300 pb-2 model-item">
                                                    <div className="w-2 rounded h-8 bg-[#562ace]"></div>
                                                    <div className="flex justify-start gap-2 items-center w-full">
                                                        <p className="model-item">{model.nome}</p>
                                                        <pre className="border border-gray-300 text-xs text-gray-500 font-mono rounded-md px-2">{model.codigo}</pre>
                                                    </div>
                                                    <div className="w-full justify-end flex items-center gap-2">
                                                        <a onClick={() => { if (model.codigo) deleteModel(cat._id, model.codigo) }}><Trash color="red" /></a>
                                                    </div>
                                                </div>
                                            ))}

                                            {addModelOpen === cat._id ? (
                                                <div className="flex items-center px-5 border-t border-gray-300">
                                                    <div className="flex w-full gap-2 items-center">
                                                        <div className="w-2 rounded h-8 bg-[#562ace] mx-5 ml-10"></div>
                                                        <input className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => setModelName(e.target.value)} type="text" name="" id="" placeholder="Nome do Modelo" />
                                                        <input className="border border-gray-300 rounded-md p-2 w-1/3" onChange={(e) => setModelCode(e.target.value)} type="text" name="" id="" placeholder="Código" />
                                                    </div>
                                                    <div className="flex flex-1 justify-end items-center my-4 px-4 gap-2">
                                                        <a className="text-white px-4 py-2 rounded-md cursor-pointer bg-[#562ace] hover:bg-[#4a1e6d]" style={{ color: "white" }} onClick={() => handleAddModel(cat._id)}>Adicionar</a>
                                                        <a
                                                            className="px-4 py-2 rounded-md cursor-pointer transition border-2 border-gray-300 hover:bg-gray-200"
                                                            style={{ color: "gray" }}
                                                            onClick={() => setAddModelOpen("")}
                                                        >
                                                            Cancelar
                                                        </a>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex justify-start px-5 pb-5">
                                                    <button onClick={() => setAddModelOpen(cat._id)} className="text-[#562ace] flex items-center gap-2 cursor-pointer hover:bg-[#4a1e6d] transition">
                                                        <Plus className="w-4 h-4" /> Adicionar modelo
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : null}
                                </div>
                            ))}

                            {addingCategory ? (
                                <div className="flex flex-1 gap-4 w-full items-center pr-5 py-5 pb-2 model-item">
                                    <div className="w-2 rounded h-8 bg-[#562ace]"></div>
                                    <div className="flex h-10 justify-start gap-2 items-center w-full">
                                        <input className="w-full border border-gray-300 p-2 rounded-md" onChange={(e) => setCategoryName(e.target.value)} type="text" placeholder="Nome da Categoria" />
                                        <input className="w-1/4 border border-gray-300 p-2 rounded-md" onChange={(e) => setCategoryCode(e.target.value)} type="text" maxLength={3} placeholder="Código" />
                                    </div>
                                    <div className="flex flex-1 w-full justify-end flex items-center gap-2 cursor-pointer my-4 px-4">
                                        <a className="px-4 py-2 bg-[#562ace] text-white rounded-md hover:bg-[#4a1e6d]" style={{ color: "white" }} onClick={() => handleAddCategory()}>Adicionar</a>
                                        <a className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200" style={{ color: "black" }} onClick={() => setAddingCategory(false)}>Cancelar</a>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        {errorMessage && <h4 className="text-red-500 text-center">{errorMessage}</h4>}
                        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                            <button className="flex items-center gap-2 px-4 py-2 text-[#562ace] hover:bg-[#4a1e6d] rounded-lg transition font-medium cursor-pointer" onClick={() => setAddingCategory(true)}>
                                <Plus className="w-5 h-5" />
                                Nova categoria
                            </button>

                            <a
                                onClick={() => setIsOpen(false)}
                                className="flex items-center px-6 py-2 bg-[#562ace] text-white rounded-lg hover:bg-[#4a1e6d] transition font-medium cursor-pointer"
                                style={{ color: "white" }}
                            >
                                Concluir
                            </a>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    )
}
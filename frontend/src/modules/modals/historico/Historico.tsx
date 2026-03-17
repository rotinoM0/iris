import "./Historico.css"
import "../Modal.css"
import "../ColorMan.css"
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import config from "../../../config";
import { Filter, RefreshCcw, Search, History } from "lucide-react";


export default function Histórico() {
    const [isOpen, setIsOpen] = useState(false)
    const [historico, setHistorico] = useState([])
    const [errorMessage, setErrorMessage] = useState("");

    const [filter, setFilter] = useState("")
    const [type, setType] = useState("")

    const loadHistorico = useCallback(async () => {
        try {
            const historyRes = (await axios.get(`${config.dev.apiUrl}/history${type ? `?type=${type}` : ""}${filter ? (type ? "&" : "?") + `filter=${filter}` : ""}`)).data.data
            setHistorico(historyRes)
        } catch (err) {
            setErrorMessage("Erro ao carregar histórico. " + err);
            console.error(err);
        }
        setErrorMessage("")
    }, [type, filter])

    useEffect(() => {
        window.addEventListener('itemsUpdated', loadHistorico);
        return () => {
            window.removeEventListener('itemsUpdated', loadHistorico);
        };
    }, [type, loadHistorico])

    useEffect(() => {
        loadHistorico()
    }, [isOpen, type, loadHistorico])


    return (
        <>
            <button onClick={() => setIsOpen(true)} className="font-bold text-gray-800 header-btn"> <span><History /></span> Histórico </button>
            {isOpen && createPortal(
                <>
                    <div
                        className="backdrop"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="text-black overflow-y-auto flex-1 font-sans flex flex-col dialog historico">
                        <div className="border-b py-5 flex px-10 flex-col">
                            <h2 className="text-[30px]">Histórico</h2>
                        </div>
                        <div className="flex justify-start p-2 gap-2 items-center bg-gray-50">
                            <div className="flex w-1/3 search-field">
                                <span className="mr-[-50px]"><Search color="gray" width={16} /></span>
                                <input
                                    className="border-2 rounded-full p-2 0 w-full border-gray-300 px-12 font-normal text-sm"
                                    placeholder="Buscar..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter')
                                            loadHistorico()
                                    }}
                                />
                                <button className="clear-search" onClick={() => {setFilter("")}}>✕</button>
                            </div>
                            <span color="gray">|</span>
                            <div className=" filter">
                                <span className="absolute"><Filter color="gray" /></span>
                                <select name="filter" id="" className="pl-10 p-2 px-4 text-sm text-gray-600 font-normal" onChange={(e) => {setType(e.target.value)}}>
                                    <option value="">Filtrar por tipo</option>
                                    <option value="">Todos</option>
                                    <option value="adicionado">Adicionado</option>
                                    <option value="alterado">Alterado</option>
                                    <option value="removido">Removido</option>
                                    <option value="entrada">Entrada</option>
                                    <option value="saida">Saída</option>
                                    <option value="balanco">Balanço</option>
                                </select>
                            </div>
                            <a className="cursor-pointer ml-5 text-black" onClick={() => { window.dispatchEvent(new CustomEvent('itemsUpdated')) }}><RefreshCcw color="black" /></a>
                        </div>
                        <div className="text-black flex historico-content w-full">
                            <table className="w-full">
                                <thead>
                                    <th>Data</th>
                                    <th>Item</th>
                                    <th>Tipo</th>
                                    <th>Quantidade</th>
                                    <th>Observação</th>
                                    <th>Usuário</th>
                                </thead>
                                <tbody>
                                    {historico.map((item: { _id: string; data: string; item: string; tipo: string; quantidade: number; observacao: string; usuario: string }) => (
                                        <tr className="strip" key={item._id}>
                                            <td className=" font-bold">{item.data.slice(0, 16).replace("-", "/").replace("-", "/").replace("T", " ")}</td>
                                            <td>{item.item}</td>
                                            <td>{item.tipo}</td>
                                            <td>{item.quantidade}</td>
                                            <td>{item.observacao}</td>
                                            <td className=" font-bold">{item.usuario}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {errorMessage && <h4 className="text-red-500 text-center">{errorMessage}</h4>}
                    </div>
                </>,
                document.body
            )}
        </>
    )
}
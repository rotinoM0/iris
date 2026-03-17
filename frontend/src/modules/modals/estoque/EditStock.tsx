import { useState } from "react"
import { createPortal } from "react-dom"
import { Pencil } from "lucide-react"

import "../Modal.css"
import "./EditStock.css"
import axios from "axios"
import config from "../../../config"
import addHistory from "../../../services/historyService"
import axiosInstance from "../../../services/api"

function EditStock(id: { id: string; codigo: string | undefined }) {
    const [isOpen, setIsOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");

    const [tipo, setTipo] = useState("")
    const [obs, setObs] = useState("")

    const [quantidade, setQuantidade] = useState(0)
    let newEstoque = 0;

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())


    const handleEdit = async () => {
        let changeType = ""

        if (!tipo || !quantidade) return setErrorMessage("Preencha todos os campos");
        try {
            setErrorMessage("");
            const varsRes = ((await axiosInstance.get(`${config.dev.apiUrl}/items/${id.id}/estoque?codigo=${id.codigo?.toString()}`)).data.data);
            varsRes.forEach((element: { codigo: string; estoque: number }) => {
                if (element.codigo === id.codigo) {
                    if (tipo === "ent") {
                        newEstoque = element.estoque + quantidade;
                        changeType = "entrada"
                    } else if (tipo === "sai") {
                        newEstoque = element.estoque - quantidade;
                        changeType = "saida"
                    } else if (tipo === "bal") {
                        newEstoque = quantidade;
                        changeType = "balanco"
                    }
                }
            });
            
            await addHistory({
                item: id.codigo,
                tipo: changeType,
                quantidade: quantidade,
                observacao: obs
            })
            const response = await axiosInstance.patch(`${config.dev.apiUrl}/items/${id.id}/estoque?codigo=${id.codigo?.toString()}`, { estoque: Number(newEstoque) })
            window.dispatchEvent(new CustomEvent('itemsUpdated'))

            setTipo("bal")
            setQuantidade(0)
            setIsOpen(false)

            return response;

        } catch (err) {
            if (axios.isAxiosError(err)){
                if (err.response) {
                    setErrorMessage(err.response.data.error);
                } else
                    setErrorMessage("Erro ao editar estoque. Tente novamente.");
            }
            console.error(err);
        }
    }

    return (
        <>
            <a onClick={() => setIsOpen(true)} id="editItem" className="input-edit inv-btn"><Pencil color="rgba(71, 71, 71, 1)" /></a>
            {isOpen && createPortal(
                <>
                    <div
                        className="backdrop"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="flex flex-col flex-1 gap-5 text-black font-sans overflow-auto dialog stock w-[40%]">
                        <div className="border-b mb-10 py-5 flex px-10 flex-col">
                            <h2 className="text-[30px]">Editar estoque</h2>
                        </div>
                        <div className="px-10 gap-5 flex flex-col">
                            <div>
                                <label htmlFor="tipo">Tipo:</label>
                                <select className="input select" defaultValue={tipo} onChange={(e) => setTipo(e.target.value)}>
                                    <option value="" disabled>Selecione o tipo</option>
                                    <option value="sai">Saída</option>
                                    <option value="ent">Entrada</option>
                                    <option value="bal">Balanço</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="data"> Data e hora:</label>
                                <input type="datetime-local" value={now.toISOString().slice(0, -8)} disabled={true} className="w-full border-2 p-2 border-gray-300 rounded-md"></input>
                            </div>

                            <div>
                                <label htmlFor="quantidade">Quantidade:</label>
                                <input type="number" step={1} placeholder="1" className="input number" defaultValue={quantidade} onChange={(e) => setQuantidade(e.target.valueAsNumber)} />
                            </div>
                            <div>
                                <label htmlFor="codigo">Observações:</label>
                                <textarea className="w-full border-2 border-gray-300 p-2 rounded-md" onChange={(e) => setObs(e.target.value)} value={obs}></textarea>
                            </div>
                            {errorMessage && <h4 className="text-red-500 text-center">{errorMessage}</h4>}
                            <div className="flex items-center justify-between border-t gap-5 border-gray-300 mt-5 py-5">
                                <button className="text-white w-full m-auto input-button" onClick={() => setIsOpen(false)}>Cancelar</button>
                                <button className="text-white w-full m-auto input-button" onClick={(handleEdit)}>Aplicar</button>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    )
}

export default EditStock;
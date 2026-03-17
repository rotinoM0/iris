import { useEffect, useState } from "react"
import "../Modal.css"
import "./Edit.css"
import { SquarePen, Upload } from "lucide-react"
import axios from "axios"
import config from "../../../config"
import addHistory from "../../../services/historyService"

export default function EditItem({ id }: { id: string }) {

    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");

    const [nome, setNome] = useState("")
    const [preco, setPreco] = useState(0)
    const [catProduto, setCatProduto] = useState("")
    const [catModelo, setCatModelo] = useState("")
    const [imagem, setImagem] = useState<File | null>(null)

    const [categorias, setCategorias] = useState([])

    const itemsToUpdate: unknown[] = []

    useEffect(() => {
        axios.get(`${config.dev.apiUrl}/items/${id}`).then(res => {

            const itemToUpdate = res.data.data;

            setNome(itemToUpdate.nome || "");
            setPreco(itemToUpdate.preco || 0);
            setCatProduto(itemToUpdate.catProduto || "");
            setCatModelo(itemToUpdate.catModelo || "");
            setImagem(null);
        })
    }, [id]);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get(`${config.dev.apiUrl}/categories`);
                setCategorias(response.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategorias();
    }, [isOpen]);


    const handleUpdateItem = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage("");
        setIsLoading(true);
        if (!nome.trim() || !preco) {
            setErrorMessage("Preencha todos os campos obrigatórios.");
            return
        }

        const formData = new FormData();

        formData.append("nome", nome ?? "");
        formData.append("preco", preco.toString() ?? "");
        formData.append("catProduto", catProduto ?? "");
        formData.append("catModelo", catModelo ?? "");

        if (imagem !== null) {
            formData.append("imagem", imagem);
        }

        try {
            const codigo = await axios.get(`${config.dev.apiUrl}/items/${id}`).then(res => res.data.data.codigo);
            await addHistory({
                item: `${catProduto} ${catModelo} ${codigo}`,
                tipo: "alterado",
                quantidade: 0
            })
            await axios.patch(`${config.dev.apiUrl}/items/${id}`, formData);
            window.dispatchEvent(new Event('itemsUpdated'))
            setIsLoading(false);
            setIsOpen(false)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response)
                    setErrorMessage("Erro ao atualizar o item: " + error.response.data.error);
                else
                    setErrorMessage("Erro ao atualizar o item: " + error.message);
            } else
                setErrorMessage("Erro ao atualizar o item. Erro: " + error);
            setIsLoading(false);
            console.error(error)
        }
    }

    return (
        <>
            <a onClick={() => { setIsOpen(true) }} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2" style={{ color: 'black' }}>
                <SquarePen color="black" width={15} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                Editar
            </a>
            {isOpen ? (
                <>
                    <div
                        className="backdrop"
                        onClick={() => setIsOpen(false)}></div>
                    <div className="flex flex-col flex-1 gap-5 text-black font-sans overflow-auto dialog edit">
                        <h2 className="font-bold text-xl mb-10 p-10 border-b border-gray-300">Editar Item</h2>
                        <div className="flex flex-col flex-1 gap-5  px-10 10">
                            <div>
                                <label htmlFor="produto">produto:</label>
                                <input defaultValue={nome} type="text" onChange={(e) => { setNome(e.target.value); itemsToUpdate.push({ nome: nome }); }} className="flex border-2 rounded-md border-gray-300 w-full m-auto p-2 mb-5" placeholder="Ex: Mochila promocional Personalizada" />
                            </div>


                            <div className="flex justify-between items-center gap-5">
                                <div className="w-full">
                                    <label htmlFor="cat">Categoria:</label>
                                    <select name="cat" defaultValue={catProduto} onChange={(e) => { setCatProduto(e.target.value); itemsToUpdate.push({ catProduto: e.target.value }) }} className="flex border-2 rounded-md border-gray-300 w-full m-auto p-2 mb-5">
                                        {categorias.map((cat: { codigo: string, produto: string }) => (
                                            <option value={cat.codigo}>{cat.produto}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-full">
                                    <label htmlFor="catMod">Modelo:</label>
                                    <select name="catMod" defaultValue={catModelo} onChange={(e) => { setCatModelo(e.target.value); itemsToUpdate.push({ catModelo: e.target.value }) }} className="flex border-2 rounded-md border-gray-300 w-full m-auto p-2 mb-5">
                                        {categorias.map((cat: { codigo: string; modelos: [] }) => (
                                            cat.codigo === catProduto && cat.modelos.map((mod: { nome: string; codigo: string }) => (
                                                <option value={mod.codigo}>{mod.nome}</option>
                                            ))
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="preco">Preço Unitário:</label>
                                <input defaultValue={preco} type="number" min={0} onChange={(e) => setPreco(Number(e.target.valueAsNumber))} step={0.1} className="flex border-2 rounded-md border-gray-300 w-full m-auto p-2 mb-5" placeholder="R$ 0" />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="imagem">Imagem:</label>
                                <label className="w-1/4 file-upload">
                                    <span className={`${imagem ? "hidden" : ""}`}><Upload /></span>
                                    <input type="file" accept="image/*" onChange={(e) => { if (e.target.files) { setImagem(e.target.files[0]); itemsToUpdate.push({ imagem: e.target.files[0] }) } }}/>
                                    {imagem ? (
                                        <img className="m-3 rounded-md border-2 border-gray-300" src={URL.createObjectURL(imagem)} alt="" width={200} height={200} />
                                    ) : null}
                                </label>
                            </div>

                            {errorMessage && <h4 className="text-red-500 text-center">{errorMessage}</h4>}
                            <div className="flex items-center justify-between border-t border-gray-300 gap-5 p-6 text-white text-center">
                                <a className="text-white w-full m-auto input-button" onClick={() => setIsOpen(false)}>Cancelar</a>
                                <a className="text-white w-full m-auto input-button" aria-disabled={isLoading} onClick={handleUpdateItem}>{isLoading ? "Atualizando..." : "Atualizar"}</a>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    )
}
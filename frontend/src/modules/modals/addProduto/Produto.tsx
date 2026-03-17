import "./Produto.css"
import "../Modal.css"
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import config from "../../../config";
import { Plus, Upload } from "lucide-react";
import axios from "axios";
import addHistory from "../../../services/historyService";

export default function Produto() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [nome, setNome] = useState("");
    const [imagem, setImagem] = useState<File | null>(null);

    const [catProduto, setCatProduto] = useState("");
    const [catModelo, setCatModelo] = useState("");
    const [preco, setPreco] = useState<number>(0);
    const [categorias, setCategorias] = useState<{ codigo: string; produto: string; modelos: { codigo: string; nome: string }[] }[]>([]);

    const resetForm = () => {
        setNome("");
        setImagem(null);
        setCatProduto("");
        setCatModelo("");
        setPreco(0);
        setErrorMessage("");
    }

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

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

    useEffect(() => {
        if (catProduto) {
            const categoriaSelecionada = categorias.find((cat: { codigo: string }) => cat.codigo === catProduto);
            if (categoriaSelecionada && categoriaSelecionada.modelos.length === 1) {
                setCatModelo(categoriaSelecionada.modelos[0].codigo);
            } else if (!categoriaSelecionada) {
                setCatModelo("");
            }
        } else {
            setCatModelo("");
        }
    }, [catProduto, categorias]);

    const addProduto = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setErrorMessage("");

        if (!nome.trim() || !catProduto || !preco || isNaN(preco)) {
            setErrorMessage("Preencha todos os campos corretamente!");
            return;
        }

        setIsLoading(true);


        try {
            let codigo = 1;
            const produtoRes = await axios.get(`${config.dev.apiUrl}/items/categorias/${catProduto}`);
            const actualModel = produtoRes.data.data.map((item: { catModelo: unknown }) => item.catModelo);
            const actualCodes = produtoRes.data.data.map((item: { codigo: unknown; }) => item.codigo);
            actualModel.forEach((model: unknown) => {
                if (model === catModelo) {
                    while (actualCodes.includes(codigo.toString().padStart(2, '0'))) {
                        codigo++;
                    }
                }
            });

            const formData = new FormData();
            formData.append("nome", nome);
            if (imagem) {
                formData.append("imagem", imagem);
            }
            formData.append("catProduto", catProduto);
            formData.append("catModelo", catModelo);
            formData.append("codigo", codigo.toString());
            formData.append("preco", preco.toString());

            
            await addHistory({
                item: `${catProduto} ${catModelo} ${codigo}`,
                tipo: "adicionado",
                quantidade: 0
            })
            
            await axios.post(`${config.dev.apiUrl}/items`, formData);

            resetForm();
            window.dispatchEvent(new CustomEvent('itemsUpdated'))
            setIsOpen(false);

        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response) {
                    setErrorMessage(err.response.data.error);
                } else
                    console.error(err);
            } else {
                console.error(err);
            }

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="flex gap-2 items-center text-gray-700 font-bold header-btn"><Plus /> Adicionar Produto</button>
            {isOpen && createPortal(
                <>
                    <div
                        className="backdrop"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="text-black overflow-hidden px-10 dialog produto">
                        <div>
                            <h2 className="font-bold text-xl mb-10 p-10 border-b border-gray-300">Adicionar Item</h2>
                        </div>

                        <div className="flex flex-col flex-1 gap-10">
                            <div className="flex flex-1 gap-5 w-full justify-between">
                                <div className="w-full">
                                    <label htmlFor="produto">Nome do produto:</label>
                                    <input value={nome} type="text" onChange={(e) => setNome(e.target.value)} className="flex border-2 rounded-md border-gray-300 w-full m-auto p-2 mb-5" placeholder="Ex: Camisa Personalizada" />
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="preco">Preço Unitário:</label>
                                    <input value={preco} type="number" min={0} onChange={(e) => setPreco(Number(e.target.valueAsNumber))} step={0.1} className="flex border-2 rounded-md border-gray-300 w-full m-auto p-2 mb-5" placeholder="R$ 0" />
                                </div>

                            </div>
                            <div className="flex gap-4 w-full justify-between">
                                <div className="w-full">
                                    <label htmlFor="cat">Categoria:</label>
                                    <select name="cat" value={catProduto} onChange={(e) => setCatProduto(e.target.value)} className="flex border-2 rounded-md border-gray-300 w-full m-auto p-2 mb-5">
                                        <option value="" disabled>Selecione</option>
                                        {categorias.map((cat: { codigo: string; produto: string }) => (
                                            <option value={cat.codigo}>{cat.produto}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full">
                                    <label htmlFor="catMod">Modelo:</label>
                                    <select name="catMod" value={catModelo} onChange={(e) => setCatModelo(e.target.value)} className="flex border-2 rounded-md border-gray-300 w-full m-auto p-2 mb-5">
                                        <option value="" disabled>Selecione</option>
                                        {categorias.map((cat: { codigo: string; modelos: { codigo: string; nome: string }[] }) => (
                                            cat.codigo === catProduto && cat.modelos.map((mod: { nome: string; codigo: string }) => (
                                                <option value={mod.codigo}>{mod.nome}</option>
                                            ))
                                        ))}
                                    </select>
                                </div>

                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="imagem">Imagem:</label>
                                <label className="w-1/4 file-upload">
                                    <span className={`${imagem ? "hidden" : ""}`}><Upload /></span>
                                    <input type="file" accept="image/*" onChange={(e) => { if (e.target.files) { setImagem(e.target.files[0]) } }}/>
                                    {imagem ? (
                                        <img className="m-3 rounded-md border-2 border-gray-300" src={URL.createObjectURL(imagem)} alt="" width={200} height={200} />
                                    ) : null}
                                </label>
                            </div>
                            {errorMessage && <h4 className="text-red-500 text-center">{errorMessage}</h4>}
                            <div className="flex items-center justify-end p-6 gap-5 border-t border-gray-200 text-white">
                                <button className="w-full flex flex-1 input-button" onClick={() => setIsOpen(false)}>Cancelar</button>
                                <button className="w-full flex flex-1 input-button" onClick={addProduto} disabled={isLoading}>
                                    {isLoading ? "Adicionando..." : "Adicionar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    )
}

import { useEffect, useState, Fragment} from "react"
import axios from "axios"

import EditItem from "../../modules/modals/edit/Edit"
import KebabMenu from "../../modules/kebab/KebabMenu"

import "./Items.css"
import { Filter, Loader, RefreshCcw, Search } from "lucide-react"
import EditStock from "../../modules/modals/estoque/EditStock"
import config from "../../config"


type ItemVar = {
    codigo?: string
    cor?: string
    estoque?: number
    [key: string]: string | number | boolean | undefined
}

type Item = {
    _id: string
    cat?: string
    codigo?: string
    nome?: string
    estoqueTotal?: number
    preco?: number | string
    var?: ItemVar[]
    [key: string]: unknown
    imagem: {
        url: string,
        public_id: string
    }
}

export default function Items() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [content, setContent] = useState<Item[]>([])
    const [filter, setFilter] = useState<string>("")

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())

    const loadItems = (filter?: string) => {
        setIsLoading(true)
        setErrorMessage("")

        if (filter) {
            axios.get(`${config.dev.apiUrl}/items/?filter=${filter}`).then((res) => {
                if (res.data.success)
                    return setContent(res.data.data as Item[])
                else return alert(res.data.message)
            })
        }

        axios.get(`${config.dev.apiUrl}/items`).then((res) => {
            if (res.data.success) {
                setIsLoading(false)
                setErrorMessage("")
                return setContent(res.data.data as Item[])
            } else {
                setIsLoading(false)
                setErrorMessage(res.data.message)
                return alert(res.data.message)
            }
        })
    }

    useEffect(() => {
        const handleItemsUpdated = () => loadItems()
        window.addEventListener('itemsUpdated', () => handleItemsUpdated())
        return () => window.removeEventListener('itemsUpdated', handleItemsUpdated)
    }, [])

    useEffect(() => {
        loadItems()
    }, [])

    const menuOptions = (id: string) => [
        {
            label: <EditItem id={id} />,
            action: () => { EditItem({ id }) }
        },
    ]

    return (
        <div className="content-box">
            <div className="flex justify-start p-2 gap-2 items-center">
                <div className="flex w-1/3 search-field">
                    <span className="mr-[-50px]"><Search color="gray" width={16} /></span>
                    <input
                        className="border-2 rounded-full p-2 0 w-full border-gray-300 px-12 font-normal text-sm"
                        placeholder="Busque por nome, código SKU ou categoria..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key == 'Enter')
                                loadItems(filter)
                        }}
                    />
                    <button className="clear-search" onClick={() => setFilter("")}>✕</button>
                </div>
                <span color="gray">|</span>
                <div className=" filter">
                    <span className="absolute"><Filter color="gray" /></span>
                    <select name="filter" id="" className="pl-10 p-2 px-4 text-sm text-gray-600 font-normal">
                        <option value="">Filtrar por Categoria</option>
                    </select>
                </div>
                <a className="cursor-pointer ml-5 text-black" onClick={() => { window.dispatchEvent(new CustomEvent('itemsUpdated')) }}><RefreshCcw color="black" /></a>
            </div>

            <div className="text-black flex justify-center items-center historico-content w-full h-full">
                <table className="w-full table-auto border-collapse bg-gray-50">
                    <thead>
                        <tr>
                            <th></th>
                            <th>SKU</th>
                            <th>Nome</th>
                            <th>Estoque Disponível</th>
                            <th>Variações</th>
                            <th>Preço Unit.</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="p-5 ">
                        {content.map((item) => (
                            <Fragment key={item._id}>
                                <tr id={item._id} className="w-full mb-2 text-gray-700 hover:bg-gray-100 cursor-pointer item">
                                    <td></td>
                                    <td>{`${item.catProduto} ${item.catModelo} ${item.codigo}`}</td>
                                    <td className="font-bold inline-flex items-center justify-start gap-5"><img src={item.imagem.url} width={50} className="rounded-md" /> {item.nome}</td>
                                    <td className="font-bold">{item.estoqueTotal} UN <EditStock id={item._id} codigo={item.codigo} /> </td>
                                    <td className="font-bold">{item.var?.length ?? 0}</td>
                                    <td>{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(item.preco))}</td>
                                    <td onClick={(e) => e.stopPropagation()}><KebabMenu options={menuOptions(item._id as string)} id={item._id as string} /></td>
                                </tr>
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            {isLoading && (<div className="flex p-5 justify-center"><Loader className={`animate-spin`} width={24} height={24} color="teal" /></div>)}
            {errorMessage && (<h4 className="text-red-500 flex justify-center">Erro ao carregar itens</h4>)}
        </div>
    )
}
import { useEffect, useMemo, useState } from "react"
import { Copy, Filter, Package, Search, TrendingUp } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

import axios from "axios"
import config from "../../config"

import Header from "../../components/header/Header"
import Footer from "../../components/Footer/Footer"

import KebabMenu from "../../modules/kebab/KebabMenu"
import EditItem from "../../modules/modals/edit/Edit"

import "./Dashboard.css"

type ItemVar = {
    codigo?: string
    cor?: string
    estoque?: number
    [key: string]: string | number | boolean | undefined
}

type Item = {
    _id: string
    catProduto?: string
    catModelo?: string
    codigo?: string
    nome?: string
    estoqueTotal?: number
    preco?: number | string
    var?: ItemVar[]
    [key: string]: unknown
    imagem: {
        url: string,
        nome: string
    }
}

export default function Dashboard() {
    const [totalItems, setTotalItems] = useState(0)
    const [totalItemsValue, setTotalItemsValue] = useState(0)
    const [items, setItems] = useState<Item[]>([])
    const [currentGraph, setCurrentGraph] = useState("")

    const [filter, setFilter] = useState("")

    const menuOptions = (id: string) => [
        {
            label: <EditItem id={id} />,
            action: () => { EditItem({ id }) }
        },
    ]

    const loadItems = async (filter?: string) => {
        const url = filter ? `${config.dev.apiUrl}/items/?filter=${filter}` : `${config.dev.apiUrl}/items`
        await axios.get(url).then((res) => {
            if (res.data.success)
                return setItems(res.data.data as Item[])
            else return alert(res.data.message)
        })
    }

    const countItems = async () => {
        return setTotalItems(await axios.get(`${config.dev.apiUrl}/items`).then(res => res.data.data.length).catch(() => ":("))
    }

    const calcItemsValue = async () => {
        const itemVal = await axios.get(`${config.dev.apiUrl}/items`).then(res => {
            return res.data.data.map((item: { preco: number; estoqueTotal: number }) => {
                return (item.preco as number) * (item.estoqueTotal as number);
            })
        }).catch(() => []);
        const totalVal = itemVal.reduce((acc: number, val: number) => acc + val, 0);
        setTotalItemsValue(totalVal);
    }

    const itemsGroup = useMemo(() => {

        return items.reduce((acc, item) => {
            const categoria = `${item.catProduto} ${item.catModelo}`;
            if (!acc[categoria]) {
                acc[categoria] = [];
            }
            acc[categoria].push(item);
            return acc;
        }, {} as {
            [key: string]: Item[]
        })
    }, [items])

    const chartData = useMemo(() => {
        const itemsByCat = items.reduce((acc, item) => {
            const categoria = item.catProduto || "Sem Categoria";
            if (!acc[categoria]) {
                acc[categoria] = 0;
            }
            acc[categoria]++;
            return acc;
        }, {} as { [key: string]: number });

        return Object.entries(itemsByCat).map(([name, value]) => ({
            name,
            value,
        }));
    }, [items]);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    useEffect(() => {
        window.addEventListener('itemsUpdated', countItems)
        window.addEventListener('itemsUpdated', calcItemsValue)
        window.addEventListener('itemsUpdated', () => loadItems())

        return () => {
            window.removeEventListener('itemsUpdated', countItems);
            window.removeEventListener('itemsUpdated', calcItemsValue);
            window.removeEventListener('itemsUpdated', () => loadItems);
        }
    }, [])

    useEffect(() => {
        countItems()
        calcItemsValue()
        loadItems()
    }, [])

    const handleGraph = async (graph: string) => {
        if (currentGraph === graph)
            return setCurrentGraph("")
        return setCurrentGraph(graph)
    }


    return (
        <>
            <Header />
            <div className="font-sans flex flex-col gap-3 w-screen h-screen overflow-auto pt-30 p-[2rem] bg-zinc-200">
                <h1 className="text-gray-800 font-bold text-4xl px-5">Dashboard</h1>
                <div className="grid grid-cols-4 w-full justify-between items-center px-5 py-10 gap-5 bg-gray-100 rounded-xl shadow-md">
                    <div className={`border-2 border-gray-300 overflow-hidden prod-box ${currentGraph === "items" ? "show-graph" : "hide-graph"}`} onClick={() => handleGraph("items")}>
                        <div className="transition flex flex-col w-full gap-3 justify-center items-center p-5">
                            <Package size={45} color="#000000ff" />
                            <div className="transition text-center content">
                                <p>Total de Produtos</p>
                                <h2 className="text-black text-xl font-bold">{totalItems}</h2>
                            </div>
                        </div>
                        <div className={`transition duration-500 ${currentGraph === "items" ? "opacity-100" : "opacity-0"}`}>
                            <ResponsiveContainer width={300} height={200}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name }) => name}
                                        outerRadius={80}
                                        fill="#8884d8">
                                        {chartData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className={`border-2 border-gray-300 overflow-hidden prod-box ${currentGraph === "valor" ? "show-graph" : ""}`} onClick={() => handleGraph("valor")}>
                        <div className="transition flex flex-col w-full gap-3 justify-center items-center p-5">
                            <TrendingUp size={45} color="#000000ff" />
                            <div className="text-black text-center content">
                                <p>Valor Total</p>
                                <h2 className="text-xl font-bold">{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(totalItemsValue))}</h2>
                            </div>
                        </div>
                    </div>
                    <div className={`border-2 border-gray-300 overflow-hidden prod-box ${currentGraph === "entradas" ? "show-graph" : ""}`} onClick={() => handleGraph("entradas")}>
                        <div className="flex flex-col gap-3 items-center p-5">
                            <TrendingUp size={45} color="#000000ff" />
                            <div className="text-black text-center content">
                                <p>Entradas</p>
                                <h2 className="text-xl font-bold">{0}</h2>
                            </div>
                        </div>
                    </div>
                    <div className={`border-2 border-gray-300 overflow-hidden prod-box ${currentGraph === "saidas" ? "show-graph" : ""}`} onClick={() => handleGraph("saidas")}>
                        <div className="flex flex-col gap-3 items-center p-5">
                            <TrendingUp size={45} color="#000000ff" />
                            <div className="text-black text-center content">
                                <p>Saídas</p>
                                <h2 className="text-xl font-bold">{0}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <h1 className="text-gray-800 font-bold text-3xl px-5 pt-10">Produtos</h1>
                <div className="py-10 bg-gray-100 rounded-xl shadow-md">
                    <div className="flex items-center w-1/2 px-5">
                        <div className="flex w-full">
                            <span className="mr-[-50px]"><Search color="gray" width={16} /></span>
                            <input
                                className="w-full font-normal text-sm input-search"
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
                        <div className="flex w-1/3">
                            <span className=""><Filter color="gray" /></span>
                            <select name="filter" id="" className="p-2 px-4 text-sm text-gray-600 font-normal">
                                <option value="">Filtrar por Categoria</option>
                            </select>
                        </div>
                    </div>
                    {Object.entries(itemsGroup).map(([categoria, itens]) => (
                        <>
                            <h1 className="text-xl text-gray-700 font-bold p-5">{categoria}</h1>
                            <div className="flex flex-col">
                                <div className="grid grid-cols-3 w-full justify-between items-center px-5 gap-5">
                                    {itens.map((item: Item) => {
                                        return (
                                            <div className="flex justify-between items-center p-5 gap-5 border border-gray-300 rounded-xl" key={item._id}>
                                                {/* <img src={logo} width={150}></img> */}
                                                {item.imagem ? (
                                                    <img src={item.imagem.url} width={80} alt="" className="rounded-lg border border-gray-300" />
                                                ) : (
                                                    <Package size={45} color="#18ac8cff" />
                                                )}
                                                <div className="text-black text-center w-full content">
                                                    <h2 className="text-xl font-bold">{item.nome}</h2>
                                                    <span className="inline-flex items-center justify-center gap-2 copy" onClick={() => { if (item.codigo) navigator.clipboard.writeText(`${item.catProduto} ${item.catModelo} ${item.codigo}`) }}> {item.catProduto} {item.catModelo} {item.codigo} <Copy width={12} className="copy" /></span>
                                                    <h3 className="text-lg font-bold">Estoque: {item.estoqueTotal}</h3>
                                                </div>
                                                <KebabMenu options={menuOptions(item._id as string)} id={item._id as string} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    ))}
                </div>
                <Footer />
            </div>
        </>
    )
}
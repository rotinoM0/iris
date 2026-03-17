import "./Stock.css"
import Header from "../../components/header/Header"
import Items from "../../components/items/Items"

export default function Main() {
    return (
        <>
            <div className="pt-30 p-[2rem]">
                <h1 className="text-gray-800 font-bold text-4xl">Inventário</h1>
                <Header />
                <Items />
            </div>
        </>
    )
}
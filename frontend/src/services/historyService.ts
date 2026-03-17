import axiosInstance from "./api";

interface History {
    item: string | undefined,
    tipo: string,
    quantidade: number,
    observacao?: string,
    data?: string // Add 'data' property as optional string
}

export default async function addHistory(data: History) {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    data.data = now.toISOString().slice(0, 19); // Corrected to slice to 19 for 'YYYY-MM-DDTHH:mm:ss'

    try {
        const response = await axiosInstance.post("/history", data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
import { Route, Routes } from 'react-router-dom'
import Incomes from './incomes'
import Menu from "./menu"

export function Report() {
    return (
        <Routes>
            <Route index element={<Menu />} />
            <Route path="/incomes" element={<Incomes />} />
        </Routes>
    )
}

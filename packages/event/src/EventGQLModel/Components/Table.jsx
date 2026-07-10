import { Table as BaseTable, CellName, } from "../../../../_template/src/Base/Components/Table"
import { CreateButton } from "../Mutations/Create"
import { Link } from "./Link"

// filtruje data tak, aby tabulka zobrazila jen požadované sloupce
const filterDataColumns = (data, columns) => {
    if (!data || !Array.isArray(data)) return data
    return data.map(row => {
        const filtered = {}

        if (row?.id !== undefined) filtered.id = row.id
        if (row?.__typename) filtered.__typename = row.__typename

        columns.forEach(col => {
            if (row?.[col] !== undefined) filtered[col] = row[col]
        })

        return filtered
    })
}

const formatDateValue = (value) => {
    if (!value) return ""

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat("cs-CZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date)
}

const CellDate = ({ row, name }) => {
    const value = row?.[name] ?? ""
    return <td key={name}>{formatDateValue(value)}</td>
}

export const Table = ({ data }) => {
    // zobrazuj jen: name, startdate, enddate
    const columnsToShow = ['name', 'nameEn', 'startdate', 'enddate', 'description', 'facility', 'type']
    const filteredData = filterDataColumns(data, columnsToShow)

    const table_def = {
        name: {
            label: "Název události",
            component: CellName,
        },
        nameEn: {
            label: "Name",
            component: CellName,
        },
        startdate: {
            label: "Začátek",
            component: CellDate,
        },
        enddate: {
            label: "Konec",
            component: CellDate,
        },
        description: {
            label: "Popis",
            component: CellName,
        },
        facility: {
            label: "Prostor",
            component: ({ row, name }) => (
                <td key={name}>
                    {row?.facility ? <Link item={row.facility} /> : (row?.facilityId || "")}
                </td>
            ),
        },
        type: {
            label: "Typ",
            component: ({ row, name }) => (
                <td key={name}>
                    {row?.type ? (
                        <Link item={row.type} />
                    ) : (
                        (row?.typeId || "")
                    )}
                </td>
            ),
        }
    }

    return (
        <>
            <div className="d-flex justify-content-start my-4">
                <CreateButton className="btn btn-primary">Vytvořit novou událost</CreateButton>
            </div>
            <BaseTable data={filteredData} table_def={table_def} />
        </>
    )
}
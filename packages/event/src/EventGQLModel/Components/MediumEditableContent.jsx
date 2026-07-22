import { Input } from "../../../../_template/src/Base/FormControls/Input"
import { useEffect, useRef, useState } from "react"

/**
 * A component that displays medium-level content for an template entity.
 *
 * This component renders a label "TemplateMediumContent" followed by a serialized representation of the `template` object
 * and any additional child content. It is designed to handle and display information about an template entity object.
 *
 * @component
 * @param {Object} props - The properties for the TemplateMediumContent component.
 * @param {Object} props.template - The object representing the template entity.
 * @param {string|number} props.template.id - The unique identifier for the template entity.
 * @param {string} props.template.name - The name or label of the template entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `template` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 */

export const MediumEditableContent = ({ 
    item, 
    onChange = () => {},
    onBlur = () => {},
    onSave = () => {}, 
    onCancel = () => {},
    children 
}) => {

    const didEmitInitialDatesRef = useRef(false)

    const [formData, setFormData] = useState({
        name: "",
        nameEn: "",
        description: "",
        startDate: "",
        endDate: "",
        valid: true,
    })

    const getCurrentDateTime = () => {
        const now = new Date()
        const pad = (value) => String(value).padStart(2, "0")
        return {
            date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
            time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
        }
    }

    const extractDateTime = (value) => {
        if (!value) return getCurrentDateTime()
        const [datePart, timePart] = String(value).split("T")
        return {
            date: datePart || getCurrentDateTime().date,
            time: timePart ? timePart.slice(0, 5) : getCurrentDateTime().time,
        }
    }

    const buildIsoDateTime = (dateTime) => {
        if (!dateTime?.date) return null
        const hhmm = dateTime.time || "00:00"
        return `${dateTime.date}T${hhmm}:00`
    }

    const buildPayload = (nextFormData) => ({
        // Build payload containing both snake_case (server fields) and
        // camelCase (insert mutation variables) datetime strings so that
        // create and update flows work regardless of naming expectations.
        ...nextFormData,
        startdate: buildIsoDateTime(nextFormData.startDate),
        enddate: buildIsoDateTime(nextFormData.endDate),
        startDate: buildIsoDateTime(nextFormData.startDate),
        endDate: buildIsoDateTime(nextFormData.endDate),
    })

    useEffect(() => {
        didEmitInitialDatesRef.current = false
        if (item) {
            const startDateTime = extractDateTime(item.startdate)
            const endDateTime = extractDateTime(item.enddate)
            setFormData({
                name: item.name || "",
                nameEn: item.nameEn || "",
                description: item.description || "",
                startDate: startDateTime,
                endDate: endDateTime,
                valid: true,
            })
        } else {
            const currentDateTime = getCurrentDateTime()
            setFormData({
                name: "",
                nameEn: "",
                description: "",
                startDate: currentDateTime,
                endDate: currentDateTime,
                valid: true,
            })
        }
    }, [item])

    useEffect(() => {
        if (didEmitInitialDatesRef.current) return
        const hasPersistedDates = Boolean(item?.startdate || item?.startDate || item?.enddate || item?.endDate)
        if (hasPersistedDates) return

        const currentDateTime = getCurrentDateTime()
        const initialFormData = {
            name: formData.name || "",
            nameEn: formData.nameEn || "",
            description: formData.description || "",
            startDate: currentDateTime,
            endDate: currentDateTime,
            valid: true,
        }

        didEmitInitialDatesRef.current = true
        try { onChange({ target: { value: buildPayload(initialFormData) } }); } catch (err) { /* ignore */ }
    }, [formData, item, onChange])

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target
        const nextFormData = {
            ...formData,
            [id]: type === "checkbox" ? checked : value,
        }
        setFormData(nextFormData)
        try { onChange(e); } catch (err) { /* ignore */ }

        // Also update full draft payload so backend vars `startdate`/`enddate` are present for update flow
        try { onChange({ target: { value: buildPayload(nextFormData) } }); } catch (err) { /* ignore */ }
    }
    
    const handleSave = () => {
        const payload = buildPayload(formData)
        try { console.debug("MediumEditableContent.handleSave payload", payload) } catch (e) {}
        onSave(payload)
    }

    const handleCancel = () => {
        if (item) {
            const startDateTime = extractDateTime(item.startdate)
            const endDateTime = extractDateTime(item.enddate)
            setFormData({
                name: item.name || "",
                nameEn: item.nameEn || "",
                description: item.description || "",
                startDate: startDateTime,
                endDate: endDateTime,
                valid: true,
            })
        }
        onCancel()
    }



    return (  
        <>
            <Input id="name" label="Jméno" value={formData.name} onChange={handleChange} />
            <Input id="nameEn" label="Jméno (EN)" value={formData.nameEn} onChange={handleChange} />
            <Input id="description" label="Popis" value={formData.description} onChange={handleChange} as="textarea" rows={3}/>
            <Input id="startDate" label="Začátek" value={formData.startDate.date} onChange={(e) => handleChange({ target: { id: "startDate", value: { ...formData.startDate, date: e.target.value } } })} type="date" />
            <Input id="startTime" label="Čas začátku" value={formData.startDate.time} onChange={(e) => handleChange({ target: { id: "startDate", value: { ...formData.startDate, time: e.target.value } } })} type="time" />
            <Input id="endDate" label="Konec" value={formData.endDate.date} onChange={(e) => handleChange({ target: { id: "endDate", value: { ...formData.endDate, date: e.target.value } } })} type="date" />
            <Input id="endTime" label="Čas konce" value={formData.endDate.time} onChange={(e) => handleChange({ target: { id: "endDate", value: { ...formData.endDate, time: e.target.value } } })} type="time" />
            {children}
        </>
    )
}

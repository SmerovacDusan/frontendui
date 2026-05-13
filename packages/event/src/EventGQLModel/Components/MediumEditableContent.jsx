import { Input } from "../../../../_template/src/Base/FormControls/Input"
import { useState, useEffect } from "react"

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
 *
 * @example
 * // Example usage:
 * const templateEntity = { id: 123, name: "Sample Entity" };
 * 
 * <TemplateMediumContent template={templateEntity}>
 *   <p>Additional information about the entity.</p>
 * </TemplateMediumContent>
 */

export const MediumEditableContent = ({ 
    item, 
    onChange = () => {},
    onBlur = () => {},
    onSave = () => {}, 
    onCancel = () => {},
    children 
}) => {

    const [formData, setFormData] = useState({
        name: "",
        nameEn: "",
        description: "",
        startDate: "",
        endDate: "",
        valid: true,
    })

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || "",
                nameEn: item.nameEn || "",
                description: item.description || "",
                startDate: item.startdate ? item.startdate.split("T")[0] : "",
                endDate: item.enddate ? item.enddate.split("T")[0] : "",
                valid: true,
            })
        }
    }, [item])

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value
        }))
        // propagate to parent (useEditAction expects onChange to receive normalized event)
        try { onChange(e); } catch (err) { /* ignore */ }
    }

    const handleSave = () => {
        onSave(formData)
    }

    const handleCancel = () => {
        if (item) {
            // reset
            setFormData({
                name: item.name || "",
                nameEn: item.nameEn || "",
                description: item.description || "",
                startDate: item.startdate ? item.startdate.split("T")[0] : "",
                endDate: item.enddate ? item.enddate.split("T")[0] : "",
            })
        }
        onCancel()
    }

    return (
        <>
            <Input id="name" label="Jméno" value={formData.name} onChange={handleChange} />
            <Input 
                id="description" 
                label="Popis" 
                value={formData.description} 
                onChange={handleChange}
                as="textarea" 
                rows={3}
            />

            {children}
        </>
    )
}
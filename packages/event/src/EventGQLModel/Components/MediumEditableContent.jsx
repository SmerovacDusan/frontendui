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
export const MediumEditableContent = ({ item, onSave = () => {}, onCancel = () => {},children }) => 
    {const [formData, setFormData] = useState({
        name: "",
        nameEn: "",
        description: "",
        valid: false,
    })

    // Inicializace dat z item
    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name || "",
                nameEn: item.nameEn || "",
                description: item.description || "",
                valid: item.valid ?? false,
            })
        }
    }, [item])

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: type === "checkbox" ? checked : value
        }))
    }

    const handleSave = () => {
        onSave(formData)
    }

    const handleCancel = () => {
        // Reset na původní hodnoty
        if (item) {
            setFormData({
                name: item.name || "",
                nameEn: item.nameEn || "",
                description: item.description || "",
                valid: item.valid ?? false,
            })
        }
        onCancel()
    }

    return (
        <>
            <Input id="name" label="Jméno" className="form-control" value={formData.name} onChange={handleChange} />
            <Input id="nameEn" label="Anglický název" className="form-control" value={formData.nameEn} onChange={handleChange} />
            <Input id="description" label="Popis" className="form-control" value={formData.description} onChange={handleChange} as="textarea" rows={3}/>
            <div className="mt-3">
                <label className="form-check-label me-2">
                    <input
                        type="checkbox"
                        id="valid"
                        checked={formData.valid}
                        onChange={handleChange}
                        className="form-check-input"
                    />
                    {' '}Platný / Aktivní
                </label>
            </div>

            <div className="mt-4 d-flex gap-2">
                <button className="btn btn-primary" onClick={handleSave}>
                    Uložit
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                    Zrušit
                </button>
            </div>

            {children}
        </>
    )
}
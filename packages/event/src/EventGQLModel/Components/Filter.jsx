import { DateTimeFilter, Filter as BaseFilter, StringFilter, UUIDFilter } from "../../../../_template/src/Base/FormControls/Filter"

export const Filter = ({ id, onChange: handleChange, children }) => {
    return (
        <BaseFilter id={id} onChange={handleChange} allowJoinSwitch={false}>
            <DateTimeFilter id="start_date" emitUtcIso={false} />
            <UUIDFilter id="id" />
            <StringFilter id="name" />
            {children}
        </BaseFilter>
    )
}

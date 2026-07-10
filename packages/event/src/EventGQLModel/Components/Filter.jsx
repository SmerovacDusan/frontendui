import { DateTimeFilter, Filter as BaseFilter, StringFilter, UUIDFilter } from "../../../../_template/src/Base/FormControls/Filter"

export const Filter = ({ id, onChange: handleChange, children }) => {
    return (
        <BaseFilter id={id} onChange={handleChange}>
            <DateTimeFilter id="created" emitUtcIso={false} />
            {/* <FloatFilter id="count" /> */}
            <UUIDFilter id="id" />
            <StringFilter id="name" />
            {children}
        </BaseFilter>
    )
}


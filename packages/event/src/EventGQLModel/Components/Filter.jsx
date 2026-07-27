import { DateTimeFilter, Filter as BaseFilter, StringFilter, UUIDFilter } from "../../../../_template/src/Base/FormControls/Filter"

export const Filter = ({ id, onChange: handleChange, children }) => {
    return (
        <BaseFilter id={id} onChange={handleChange}>
            <UUIDFilter id="id" />
            <StringFilter id="name" />
            <DateTimeFilter id="start_date" emitUtcIso={false} />
            <DateTimeFilter id="end_date" emitUtcIso={false} />
            {/* <FloatFilter id="count" /> */}
            {children}
        </BaseFilter>
    )
}

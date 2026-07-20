
import { ReadPageAsyncAction } from "../Queries"
import { useInfiniteScroll } from "../../../../dynamic/src/Hooks/useInfiniteScroll"
import { PageBase } from "./PageBase"
import { Table } from "../Components/Table"
import { Filter } from "../Components/Filter"
import { FilterButton, ResetFilterButton } from "../../../../_template/src/Base/FormControls/Filter"
import { useSearchParams } from "react-router"
import { useEffect } from "react"
import { useMemo } from "react"
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator"
import { Collapsible } from "../../../../_template/src/Base/FormControls/Collapsible"

const LOCAL_DATE_FIELDS = new Set(["start_date", "end_date"]);
const LOGICAL_FIELDS = new Set(["_and", "_or"]);

function isEmptyWhere(where) {
    if (!where || typeof where !== "object") return true;
    if (Array.isArray(where)) return where.length === 0;
    return Object.keys(where).length === 0;
}

function splitEventWhere(where) {
    if (!where || typeof where !== "object") return { serverWhere: null, localWhere: null };
    if (Array.isArray(where)) {
        const splitItems = where.map(splitEventWhere);
        const serverArray = splitItems.map((x) => x.serverWhere).filter((x) => !isEmptyWhere(x));
        const localArray = splitItems.map((x) => x.localWhere).filter((x) => !isEmptyWhere(x));
        return {
            serverWhere: serverArray.length ? serverArray : null,
            localWhere: localArray.length ? localArray : null,
        };
    }

    const serverWhere = {};
    const localWhere = {};

    for (const [key, value] of Object.entries(where)) {
        if (LOCAL_DATE_FIELDS.has(key)) {
            localWhere[key] = value;
            continue;
        }
        if (LOGICAL_FIELDS.has(key) && Array.isArray(value)) {
            const splitChildren = value.map(splitEventWhere);
            const serverChildren = splitChildren.map((x) => x.serverWhere).filter((x) => !isEmptyWhere(x));
            const localChildren = splitChildren.map((x) => x.localWhere).filter((x) => !isEmptyWhere(x));
            if (serverChildren.length) serverWhere[key] = serverChildren;
            if (localChildren.length) localWhere[key] = localChildren;
            continue;
        }
        serverWhere[key] = value;
    }

    return {
        serverWhere: isEmptyWhere(serverWhere) ? null : serverWhere,
        localWhere: isEmptyWhere(localWhere) ? null : localWhere,
    };
}

function parseDateTimestamp(value) {
    if (!value) return null;
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
}

function compareDateFilter(filterOps, itemValue) {
    if (!filterOps || typeof filterOps !== "object") return true;

    const itemTs = parseDateTimestamp(itemValue);
    if (itemTs == null) return false;

    for (const [op, rawFilterValue] of Object.entries(filterOps)) {
        const filterTs = parseDateTimestamp(rawFilterValue);
        if (filterTs == null) continue;
        if (op === "_eq" && !(itemTs === filterTs)) return false;
        if (op === "_gt" && !(itemTs > filterTs)) return false;
        if (op === "_ge" && !(itemTs >= filterTs)) return false;
        if (op === "_lt" && !(itemTs < filterTs)) return false;
        if (op === "_le" && !(itemTs <= filterTs)) return false;
    }
    return true;
}

function matchesLocalEventWhere(where, item) {
    if (!where || typeof where !== "object") return true;
    if (Array.isArray(where)) return where.every((x) => matchesLocalEventWhere(x, item));

    if (Array.isArray(where._and)) {
        const andResult = where._and.every((x) => matchesLocalEventWhere(x, item));
        if (!andResult) return false;
    }
    if (Array.isArray(where._or)) {
        const orResult = where._or.some((x) => matchesLocalEventWhere(x, item));
        if (!orResult) return false;
    }

    if (where.start_date && !compareDateFilter(where.start_date, item?.startdate)) return false;
    if (where.end_date && !compareDateFilter(where.end_date, item?.enddate)) return false;
    return true;
}


function normalizeEventWhere(where) {
    if (Array.isArray(where)) {
        return where.map(normalizeEventWhere).filter((item) => item != null);
    }
    if (!where || typeof where !== "object") {
        return where;
    }

    const keyMap = {
        startdate: "start_date",
        enddate: "end_date",
    };
    const unsupportedKeys = new Set(["created"]);

    const normalized = {};
    for (const [key, value] of Object.entries(where)) {
        if (unsupportedKeys.has(key)) continue;
        const nextKey = keyMap[key] ?? key;
        normalized[nextKey] = normalizeEventWhere(value);
    }
    return normalized;
}

function safeParseWhere(sp, paramName = "where") {
    const raw = sp.get(paramName);
    if (!raw) return null;
    try {
        const obj = JSON.parse(raw);
        if (!obj || typeof obj !== "object") return null;
        return normalizeEventWhere(obj);
    } catch {
        return null;
    }
}

// 
const filterParameterName = "gr_where"
export const PageVector = ({ children, queryAsyncAction = ReadPageAsyncAction }) => {
    
    const [sp] = useSearchParams();

    const whereFromUrl = useMemo(() => safeParseWhere(sp, filterParameterName), [sp.toString()]);
    const { serverWhere, localWhere } = useMemo(() => splitEventWhere(whereFromUrl), [whereFromUrl]);

    const { items, loading, error, hasMore, sentinelRef, loadMore, restart } = useInfiniteScroll(
        {
            asyncAction: queryAsyncAction,
            actionParams: { skip: 0, limit: 25, where: serverWhere },
            // reset: whereFromUrl
        }
    )

    useEffect(() => {
        const params = {skip: 0, limit: 25, where: serverWhere} 
        restart(params)
    }, [serverWhere]);

    const filteredItems = useMemo(() => {
        const safeItems = Array.isArray(items) ? items : [];
        return safeItems.filter((item) => matchesLocalEventWhere(localWhere, item));
    }, [items, localWhere]);

    
    return (
        <PageBase>
            <Collapsible 
                className="form-control btn btn-outline-primary"
                buttonLabelCollapsed="Zobrazit filtr"
                buttonLabelExpanded="Skrýt filtr"
            >
                <Filter>
                    <FilterButton 
                        className="form-control btn btn-outline-success"
                        paramName={filterParameterName}
                    >
                        Filtrovat
                    </FilterButton>
                    <ResetFilterButton 
                        className="form-control btn btn-warning"
                        paramName={filterParameterName}
                    >
                        Vymazat filtr
                    </ResetFilterButton>
                </Filter>
            </Collapsible>

            <Table data={filteredItems} />

            <AsyncStateIndicator error={error}  loading={loading} text="Nahrávám další..." />

            {hasMore && <div ref={sentinelRef} style={{ height: 80, backgroundColor: "lightgray" }} />}
            {hasMore && <button className="btn btn-success form-control" onClick={() => loadMore()}>Více</button>}
        </PageBase>
    )
}

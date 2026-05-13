import { CardCapsule, VectorItemsURI } from "../Components"
import { CreateButton, CreateLink } from "./Create"
import { UpdateButton, UpdateLink } from "./Update"
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink"
import { DeleteButton } from "./Delete"
import { Save } from "react-bootstrap-icons"
import { useCallback } from "react"
import { useEditAction } from "../../../../dynamic/src/Hooks/useEditAction"
import { UpdateAsyncAction } from "../Queries"

const SaveButton = ({ item, className, children }) => {
    const { onConfirm, dirty, loading } = useEditAction(UpdateAsyncAction, item, { mode: "confirm" })
    const handleClick = useCallback(async () => {
        await onConfirm()
    }, [onConfirm])

    return (
        <button className={className} onClick={handleClick} disabled={!dirty || loading}>
            {children || "Uložit"}
        </button>
    )
}

export const PageLink = ({ children, preserveHash = true, preserveSearch = true, ...props }) => {
    return (
        <ProxyLink
            to={VectorItemsURI}
            preserveHash={preserveHash}
            preserveSearch={preserveSearch}
            {...props}
        >
            {children}
        </ProxyLink>
    );
};

export const InteractiveMutations = ({ item }) => {
    return (
        <CardCapsule item={item} title="Nástroje">
            <PageLink className="btn btn-outline-success">Stránka</PageLink>
            <UpdateLink className="btn btn-outline-success" item={item}>Upravit</UpdateLink>
            <UpdateButton className="btn btn-outline-success" item={item}>Upravit Dialog</UpdateButton>
            <CreateButton className="btn btn-outline-success" rbacitem={{}}>Vytvořit nový</CreateButton>
            <DeleteButton className="btn btn-outline-danger" item={item}>Odstranit</DeleteButton>
            <SaveButton className="btn btn-outline-primary" item={item}>Uložit</SaveButton>
        </CardCapsule>
    )
}

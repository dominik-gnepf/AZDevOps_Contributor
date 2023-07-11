import { CachedValue } from "../CachedValue";
import { IPersonaProps } from "office-ui-fabric-react/lib-amd/components/Persona";
import { getIdentities } from "./getIdentities";

async function getPersonas() {
    const identities = await getIdentities();
    const personas: IPersonaProps[] = [];
    for (const id in identities) {
        const identity = identities[id];
        personas.push({
            primaryText: identity.displayName,
            secondaryText: identity.uniqueName,
            imageUrl: identity.imageUrl,
            id: identity.id
        });
    }
    return personas;
}

const personas = new CachedValue(getPersonas);

export function searchIdentities(filter: string): IPromise<IPersonaProps[]> {
    const lowerFilter = filter.toLocaleLowerCase();
    function match(str?: string) {
        return str && str.toLocaleLowerCase().lastIndexOf(lowerFilter, 0) >= 0;
    }
    return personas.getValue().then(personas => {
        const matched = personas.filter(p => match(p.primaryText) || match(p.secondaryText));
        if (matched.length === 0) {
            matched.push({
                primaryText: filter,
            });
        }
        return matched;
    });
}

import { AscentTypes } from "./AscentTypes";

export const AscentMethods = {
    1: {
        id: 1,
        value: 0,
        shorthand: "redpoint",
        name: "Redpoint",
        ascentTypes: [AscentTypes.ROUTES.shorthand, AscentTypes.BOULDERS.shorthand]
    },
    2: {
        id: 2,
        value: 53,
        shorthand: "flash",
        name: "Flash",
        ascentTypes: [AscentTypes.ROUTES.shorthand, AscentTypes.BOULDERS.shorthand]
    },
    3: {
        id: 3,
        value: 145,
        shorthand: "onsight",
        name: "Onsight",
        ascentTypes: [AscentTypes.ROUTES.shorthand]
    },
    4: {
        id: 4,
        value: -52,
        shorthand: "toprope",
        name: "Toprope",
        ascentTypes: [AscentTypes.ROUTES.shorthand]
    },
    5: {
        id: 5,
        value: 95,
        shorthand: "onsight",
        name: "Onsight",
        ascentTypes: [AscentTypes.BOULDERS.shorthand]
    }
};

export const AscentMethodShortHands = ["onsight", "flash", "redpoint", "toprope"];

export const AscentTypes = {
    ROUTES: {
        id: 0,
        shorthand: "routes",
        label: "routes"
    },
    BOULDERS: {
        id: 1,
        shorthand: "boulders",
        label: "boulders"
    },
    MULTI_PITCH: {
        id: 2,
        shorthand: "multi-pitch",
        label: "multi-pitch"
    }
};

export const getAscentTypeById = (id = 0) =>
    [AscentTypes.ROUTES, AscentTypes.BOULDERS, AscentTypes.MULTI_PITCH][id];

export const getAscentTypeId = shorthand =>
    ({
        routes: 0,
        boulders: 1,
        "multi-pitch": 2
    }[shorthand]);

export const isRoute = shorthand => {
    if (process.env.NODE_ENV !== "production") {
        if (typeof shorthand !== "string") {
            console.error("isRoute is not called with string", shorthand);
        }
    }

    return shorthand === AscentTypes.ROUTES.shorthand;
};

export const isBoulder = shorthand => {
    if (process.env.NODE_ENV !== "production") {
        if (typeof shorthand !== "string") {
            console.error("isBoulder is not called with string", shorthand);
        }
    }

    return shorthand === AscentTypes.BOULDERS.shorthand;
};

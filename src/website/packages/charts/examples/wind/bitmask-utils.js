/* eslint-disable no-bitwise */
export const getBitMaskFromArray = (arrayWithValues = []) =>
    arrayWithValues.reduce((res, val) => res | val, 0);

export const getArrayFromBitMask = (mask = 0) =>
    [...Array(16)].reduce((res, _, val) => (mask & (2 ** val) ? [...res, 2 ** val] : res), []);

/*
 * bitmaskFlags should be an object with the following signature:
 *
 * bitmaskFlags = {
 *   SOME_CONST: {
 *     value: int,
 *     name: string
 *   },
 *   ...
 * };
 *
 */
export const getNamesArrayFromBitMask = (bitmaskFlags, mask = 0) => {
    const values = getArrayFromBitMask(mask);
    return Object.keys(bitmaskFlags).reduce(
        (res, key) =>
            values.indexOf(bitmaskFlags[key].value) !== -1 ? [...res, bitmaskFlags[key].name] : res,
        []
    );
};

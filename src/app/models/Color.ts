export type ColorHex = `#${string}`;

export type Color = {
    id: number,
    color: ColorHex,
    use?: boolean,
    quantity?: number
}

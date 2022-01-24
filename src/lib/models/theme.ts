export const Themes = [ 'light', 'dark' ] as const;
export type Theme = typeof Themes[number];

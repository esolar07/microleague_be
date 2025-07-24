export type TeamDetailsResponse = Record<string, { id: string; image: string | null }>;

export interface SeasonItem {
    $ref: string;
}

export interface TeamListItem {
    $ref: string;
}

export interface TeamDetailsApiResponse {
    displayName: string;
    logos: Array<{ href: string }>;
}
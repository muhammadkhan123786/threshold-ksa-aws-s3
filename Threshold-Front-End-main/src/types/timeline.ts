export interface TimelineItem {
    id: string;
    group: string;
    content: string;
    start: Date;
    end: Date;
    className?: string;
    subgroup?: string;
    title?: string;
}

export interface TimelineGroup {
    id: string;
    content: string;
    className?: string;
}

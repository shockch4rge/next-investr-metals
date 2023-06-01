import type { HTMLAttributes, PropsWithChildren } from "react";

export const Container: React.FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = ({ children, ...props }) => {
    return <section className="container mx-auto" {...props}>
        {children}
    </section>;
};
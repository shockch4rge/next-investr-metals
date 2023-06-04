import type { HTMLAttributes, PropsWithChildren } from "react";

export const Container: React.FC<PropsWithChildren<HTMLAttributes<HTMLDivElement>>> = ({ children, className, ...props }) => {
    return <section className={`container mx-auto ${className}`} {...props}>
        {children}
    </section>;
};
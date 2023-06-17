import React, { useRef } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    open: boolean;
    onClose: () => void;
    placement?: "left" | "right" | "top" | "bottom";
}
function Drawer({
    open,
    onClose,
    className,
    placement = "right",
    children,
    ...props
}: Props) {
    const backdropRef = useRef<HTMLDivElement>(null);

    const handleBackdropClick = React.useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === backdropRef.current) {
                onClose();
            }
        },
        [onClose]
    );
    const placementClass = React.useMemo(() => {
        switch (placement) {
            case "right":
                return `absolute w-full h-full right-0 bg-white shadow max-w-[30rem] transition-transform ${open ? "translate-x-0" : "translate-x-full"
                    }  ${className}`;
            case "left":
                return `absolute w-full h-full left-0 bg-white shadow max-w-[30rem] transition-transform ${open ? "translate-x-0" : "-translate-x-full"
                    }  ${className}`;
            case "top":
                return `absolute w-full h-full top-0 bg-white shadow max-h-[30rem] transition-transform ${open ? "translate-y-0" : "-translate-y-full"
                    }  ${className}`;
            case "bottom":
                return `absolute w-full h-full bottom-0 bg-white shadow max-h-[30rem] transition-transform ${open ? "translate-y-0" : "translate-y-full"
                    }  ${className}`;
            default:
                return `absolute w-full h-full right-0 bg-white shadow max-w-[30rem] transition-transform ${open ? "translate-x-0" : "translate-x-full"
                    }  ${className}`;
        }
    }, [className, open, placement]);

    return (
        <div
            ref={backdropRef}
            className={`fixed top-0 left-0 z-[9998] h-screen w-screen overflow-hidden transition-[background-color,back] ${open ? " bg-black/10 backdrop-blur-sm" : "pointer-events-none"
                }`}
            onClick={handleBackdropClick}
        >
            <div {...props} className={placementClass}>
                {children}
            </div>
        </div>
    );
}

export default Drawer;
import { useState } from "react";

interface AppProps extends React.HTMLAttributes<HTMLDivElement> {
    user: {
        login?: string;
        avatar?: string;
    } | undefined;
}
function Avatar({ user, className }: AppProps) {
    const [error, setError] = useState(false);
    const FirstLetter = user?.login?.[0]?.toUpperCase() || "F";
    if (user?.avatar && !error)
        return (
            <img
                src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                className={`aspect-square rounded-full ${className}`}
                onError={(e) => {
                    setError(true);
                }}
            />
        );
    else
        return (
            <div
                className={`flex justify-center items-center aspect-square bg-primary text-light brightness-110 rounded-full  ${className}`}
            >
                <span>{FirstLetter}</span>
            </div>
        );
}

export default Avatar;
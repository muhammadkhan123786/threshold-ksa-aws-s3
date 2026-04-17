export const Error = ({ message, className }: { message: string; className: string }) => {
    return (
        <div
            className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ${className}`}
            role="alert"
        >
            <div>
                <strong className="font-bold">Error:</strong>
            </div>
            <div>
                <span className="block sm:inline">{message}</span>
            </div>
        </div>
    );
};

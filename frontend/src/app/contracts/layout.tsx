import "../globals.css";

export const metadata = {
    title: "Sign Contract",
    description: "Digital Contract Signature",
};

export default function ContractsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
                {children}
            </body>
        </html>
    );
}


import StreamVideoProvider from "@/providers/StreamClientProvider";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>
            <StreamVideoProvider>
                {children}
            </StreamVideoProvider >
        </main>
    );
}

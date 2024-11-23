export default function Layout ( {children} ){
    return(
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex items-center justify-center p-4">
                {children}
            </main>
        </div>
    )
}
import Logo from '@/components/Logo'; // @ alias for src/components

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-[#001F3F] to-white flex flex-col">
            <section className="flex-1 flex flex-col justify-center items-center text-center p-8">
                <h1 className="text-5xl font-futura mb-4">Balancing Innovation</h1>
                <p className="text-xl mb-8">Diagnostics and Creativity for Tomorrow with CHADD/HDPD and Rhapsode.</p>
                <button className="bg-[#D4AF37] text-white px-6 py-3 rounded-lg">Learn More</button>
            </section>
        </main>
    );
}
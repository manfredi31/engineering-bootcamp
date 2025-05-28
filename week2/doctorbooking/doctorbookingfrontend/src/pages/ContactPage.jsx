export default function ContactPage() {
    return (
        <>
            {/* Contact Us Section */}
            <div className="mx-16 mb-12 p-6">
                <h1 className="text-4xl font-bold text-gray-700 text-center mb-16">CONTACT <span className="text-indigo-600">US</span></h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="rounded-lg overflow-hidden">
                        <img 
                            src="../src/assets/doctorphoto2.jpg" 
                            alt="Doctor with patient" 
                            className="w-full max-h-[500px] object-cover object-top"
                        />
                    </div>
                    
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">OUR OFFICE</h2>
                            <div className="space-y-2 text-gray-600">
                                <p>00000 Willms Station</p>
                                <p>Suite 000, Washington, USA</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">GET IN TOUCH</h2>
                            <div className="space-y-2 text-gray-600">
                                <p>Tel: (000) 000-0000</p>
                                <p>Email: greatstackdev@gmail.com</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">CAREERS AT PRESCRIPTO</h2>
                            <p className="text-gray-600 mb-4">
                                Learn more about our teams and job openings.
                            </p>
                            <button className="border-2 border-gray-800 text-gray-800 px-6 py-2 rounded hover:bg-gray-800 hover:text-white transition-colors duration-300">
                                Explore Jobs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


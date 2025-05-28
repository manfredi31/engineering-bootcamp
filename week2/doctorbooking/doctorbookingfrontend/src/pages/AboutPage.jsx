export default function AboutPage() {
    return (
        <>
            {/* About Us Section */}
            <div className="mx-16 mb-12 p-6">
                <h1 className="text-4xl font-bold text-gray-700 text-center mb-16">ABOUT US</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center @container">
                    <div className="rounded-lg overflow-hidden">
                        <img 
                            src="../src/assets/doctorphoto.jpg" 
                            alt="Doctors at Prescripto" 
                            className="w-full max-h-[500px] object-cover"
                        />
                    </div>
                    
                    <div className="space-y-6">
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to Prescripto, your trusted partner in managing your healthcare needs conveniently and 
                            efficiently. At Prescripto, we understand the challenges individuals face when it comes to scheduling 
                            doctor appointments and managing their health records.
                        </p>
                        
                        <p className="text-gray-700 leading-relaxed">
                            Prescripto is committed to excellence in healthcare technology. We continuously strive to enhance our 
                            platform, integrating the latest advancements to improve user experience and deliver superior 
                            service. Whether you're booking your first appointment or managing ongoing care, Prescripto is here 
                            to support you every step of the way.
                        </p>
                        
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to 
                                bridge the gap between patients and healthcare providers, making it easier for you to access the 
                                care you need, when you need it.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="mx-16 p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">WHY CHOOSE US</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Efficiency Card */}
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-500 transition-all duration-300 hover:bg-indigo-500 hover:border-indigo-600 group">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-white">EFFICIENCY:</h3>
                        <p className="text-gray-600 group-hover:text-white">
                            Streamlined appointment scheduling that fits into your busy lifestyle.
                        </p>
                    </div>

                    {/* Convenience Card */}
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-500 transition-all duration-300 hover:bg-indigo-500 hover:border-indigo-600 group">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-white">CONVENIENCE:</h3>
                        <p className="text-gray-600 group-hover:text-white">
                            Access to a network of trusted healthcare professionals in your area.
                        </p>
                    </div>

                    {/* Personalization Card */}
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-500 transition-all duration-300 hover:bg-indigo-500 hover:border-indigo-600 group">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-white">PERSONALIZATION:</h3>
                        <p className="text-gray-600 group-hover:text-white">
                            Tailored recommendations and reminders to help you stay on top of your health.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}


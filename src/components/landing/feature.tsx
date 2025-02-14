"use client";

export default () => {
    return (
        <>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto">
                    <div className="text-center mb-20">
                        <h1 className="sm:text-4xl text-3xl font-medium text-gray-900 mb-4">
                            Key Features
                        </h1>
                        <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto text-gray-700">
                            Discover the essential tools and features designed to enhance productivity and communication for both drivers and administrators.
                        </p>
                    </div>
                    <div className="flex flex-wrap -m-4">
                        <div className="p-4 lg:w-1/3">
                            <div className="h-full bg-gray-100 p-8 rounded">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="block w-8 h-8 text-indigo-500 mb-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 10h11M9 21V3m6 18l9-9-9-9"
                                    />
                                </svg>
                                <h2 className="text-lg font-medium text-gray-900 mb-3">
                                    Trip Management
                                </h2>
                                <p className="leading-relaxed text-base">
                                    Plan and manage trips efficiently with forms for trip details, vehicle selection, and delivery tracking.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 lg:w-1/3">
                            <div className="h-full bg-gray-100 p-8 rounded">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="block w-8 h-8 text-indigo-500 mb-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17 9l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                                <h2 className="text-lg font-medium text-gray-900 mb-3">
                                    Real-Time Geolocation
                                </h2>
                                <p className="leading-relaxed text-base">
                                    Track drivers in real-time during trips and monitor their progress toward delivery destinations.
                                </p>
                            </div>
                        </div>
                        <div className="p-4 lg:w-1/3">
                            <div className="h-full bg-gray-100 p-8 rounded">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="block w-8 h-8 text-indigo-500 mb-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16 17v-4M8 7v10m4-6v6"
                                    />
                                </svg>
                                <h2 className="text-lg font-medium text-gray-900 mb-3">
                                    Comprehensive Reports
                                </h2>
                                <p className="leading-relaxed text-base">
                                    Submit inspection, repair, and lubrication reports directly through the app for streamlined documentation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

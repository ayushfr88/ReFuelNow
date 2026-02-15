import React from 'react';
import { motion } from 'framer-motion';

const VideoSection = () => {
    return (
        <section id="how-it-works-video" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                        See How RefuelNow Works
                    </h2>
                    <p className="text-neutral-600 mb-10 max-w-2xl mx-auto">
                        Watch how our seamless fuel delivery process ensures your fleet stays running without interruption. Simple, fast, and reliable.
                    </p>

                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 group">
                        {/* Placeholder for video or iframe */}
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=ScVq1fO6aN0o1Jj-"
                            title="RefuelNow Explainer Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default VideoSection;

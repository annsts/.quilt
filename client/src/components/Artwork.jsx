import React from 'react';
import { quilt_artwork } from "../assets";

const Artwork = () => {
  
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6 mt-6">
          <div className="flex-shrink-0 w-full md:w-1/2 mb-4 md:mb-0">
            <img src={quilt_artwork} alt="Quilt Artwork" className="mx-auto max-w-full h-auto" loading="lazy"/>
          </div>

          <div className="w-full md:w-1/2">
            <h1 className="font-inter font-extrabold text-[#222328] text-[32px] mb-4 text-left">Quilt: Bridging Memories and Technology</h1>
            <p className="font-inter text-[#666e75] text-[14px] md:text-lg mb-4 text-left">
                Quilt epitomizes the fusion of human experiences and technology. It employs the stable diffusion model to translate memories into visual art. Engage with curated questions, share a memory, and witness its transformation into imagery.
            </p>
            <p className="font-inter text-[#666e75] text-[14px] md:text-lg mb-4 text-left">
                Offering both user-GPU and server image generation, quilt reflects modern technological choices. Interaction unveils the image alongside its memory narrative, blending past and present.
            </p>
            
            <p className="font-inter text-[#666e75] text-[14px] md:text-lg mb-4 text-left">
                Quilt offers a technological canvas to craft and explore the junction of human sentiment and visual artistry.
            </p>
            </div> 
        </div>
  
      </section>
    );
};

export default Artwork;



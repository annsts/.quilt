import React from 'react';

const Card = ({ _id, name, prompt, photo, webGPU }) => (
  <div className="relative rounded-xl group shadow-card hover:shadow-cardhover card">
    <img
      className="w-full h-auto object-cover rounded-xl"
      src={photo}
      alt={prompt}
    />
    {webGPU=="yes" && (
      <div className="font-inter absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-md bg-opacity-50">
        Generated with WebGPU
      </div>
    )}
    <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] bg-opacity-70 m-2 p-4 rounded-md">
      <p className="font-inter text-white text-sm overflow-y-auto prompt">"{prompt}"</p>
      <div className="mt-5 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <p className="font-inter text-white text-sm">shared by {name}</p>
        </div>
      </div>
    </div>
  </div>
);

export default Card;


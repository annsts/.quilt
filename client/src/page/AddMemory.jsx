import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { preview} from '../assets';
import { getRandomQuestion } from '../utils';
import { FormField, Loader } from '../components';
import {StableDiffusion } from "../stable_diffusion/index.js"; 
import ColorThief from 'colorthief';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice } from '@fortawesome/free-solid-svg-icons';

const getDominantColor = (imageSrc) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; 
        img.src = imageSrc;

        img.onload = () => {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            resolve(dominantColor);
        };

        img.onerror = (err) => {
            reject(new Error("Error loading the image."));
        };
    });
};

const Modal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 px-8 rounded-lg shadow-lg relative">
      <button 
          onClick={onClose} 
          className="bg-transparent absolute top-1 right-3 rounded-full p-2 text-xl"
          aria-label="Close Modal"
        >
          ×
        </button>
        <p className="p-x font-inter mb-6 mt-6">{message}</p>

      </div>
    </div>
  );
};

function rgbToHex([r, g, b]) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const AddMemory = () => {
  const navigate = useNavigate();
  const [randomPrompt, setRandomPrompt] = useState('');
  const useRandomPrompt = () => {
    setForm({ ...form, question: randomPrompt });
    setShowButtons(false);
};
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
    question: '', 
  });
  
  const [log, setLog] = useState('');
  const [generatingServerImg, setGeneratingServerImg] = useState(false);
  const [generatingWebGPUImg, setGeneratingWebGPUImg] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleGenerateRandomQuestion = () => {
    const newRandomPrompt = getRandomQuestion();
    setRandomPrompt(newRandomPrompt);
};

  const fetchGeneratedImage = async () => {
    if (!form.prompt) {
      setModalMessage('Please provide a prompt first.');
      setModalOpen(true);

      return;
    }
    setGeneratingServerImg(true); 
    
    try {
      const response = await fetch('http://localhost:8080/api/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: form.prompt }),
      });
  
      if (!response.ok) {
        throw new Error('Server responded with an error.');
      }
      const data = await response.json();
      let dom_color = '';
      try {
        const color = await getDominantColor(data.imageURL);
        dom_color = rgbToHex(color);
      } catch (err) {
        console.error('Error getting dominant color:', err);
      }

      setForm({ ...form, photo: data.imageURL, color: dom_color, webGPU: 'no' });
      
    } catch (err) {
      setModalMessage(err.message || 'An error occurred.');
      setModalOpen(true);

    } finally {
      setGeneratingServerImg(false);
    }
  };  

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingWebGPUImg(true);
        const el = document.createElement('div');
        const config = {
          prompts: [[form.prompt, ""]]
        };

        console.log = (message) => {
        if (message === '[init]') {
          setLog('Initializing...');
        } else if (message === '[generating]') {
          setLog('Generating...');
        }
      };

        const img = await StableDiffusion(el, config);
        const imageURL = img.src;
       
        let dom_color = '';
      try {
        const color = await getDominantColor(data.imageURL);
        dom_color = rgbToHex(color);
        
      } catch (err) {
        console.error('Error getting dominant color:', err);
      }

        setForm({ ...form, photo: imageURL, color:dom_color, webGPU: 'yes'});

      } catch (err) {
        setModalMessage(err.message || 'An error occurred.');
        setModalOpen(true);

      } finally {
        setGeneratingWebGPUImg(false);
      }
    } else {
      setModalMessage('Please provide a proper prompt');
      setModalOpen(true);

    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        if (!response.ok) {
          throw new Error('Server responded with an error.');
        }
  
        await response.json();
        setModalMessage('Success');
        setModalOpen(true);
        navigate('/');
      } catch (err) {
        setModalMessage(err.message || 'An error occurred.');
        setModalOpen(true);

      } finally {
        setLoading(false);
      }
    } else {
      setModalMessage('Please generate an image with proper details');
      setModalOpen(true);

    }
  };
  
  return (
    <section className="flex flex-col justify-center items-center min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-6">
        <header>
          <h1 className="font-inter font-extrabold text-[#222328] text-[32px] mb-2">Add memory</h1>
        </header>
        <form className="mt-5 max-w-3xl" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
          {randomPrompt ? (
              <p className="font-inter text-[#666e75] text-[14px] max-w-[500px]">{randomPrompt}</p>
            ) : (
              <p className="font-inter text-[#666e75] text-[14px] max-w-[500px]">No prompt question chosen.</p>
            )}
            <div className="mt-5 flex gap-5">
              {showButtons && (
                <React.Fragment>
                  <button
                    type="button"
                    onClick={handleGenerateRandomQuestion}
                    className="group font-inter text-white bg-[#9a031e] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center relative hover:bg-[#9a031e]">
                    <FontAwesomeIcon icon={faDice} />
                    
                  </button>
                  {randomPrompt && (
                    <button
                      type="button"
                      onClick={useRandomPrompt}
                      className="font-inter text-white bg-black font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                      Use This Prompt
                    </button>
                  )}
                </React.Fragment>
              )}
            </div>
            <FormField
              labelName="Your name"
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              handleChange={handleChange}
            />
            <FormField
              labelName="Your memory"
              type="textarea"
              name="prompt"
              placeholder="A sunny fall day in my hometown"
              value={form.prompt}
              handleChange={handleChange}
            />
            
            <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
              {form.photo ? (
                <img src={form.photo} alt={form.prompt} className="w-full h-full object-contain" />
              ) : (
                <img src={preview} alt="preview" className="w-9/12 h-9/12 object-contain opacity-40" />
              )}

              {( generatingServerImg || generatingWebGPUImg )  && (
                <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                  <Loader />
                </div>
              )}
            </div>
            <div className="font-inter logs mt-2 mb-2">
                {log} </div>
            <div className="mt-5 flex gap-5">
            
              <button type="button"
                onClick={fetchGeneratedImage}
                className="font-inter text-black bg-white border border-black font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                {generatingServerImg ? 'Generating...' : 'Generate'}
              </button>
              <button
                type="button"
                onClick={generateImage}
                className="font-inter text-black bg-white border border-black font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                {generatingWebGPUImg ? 'Generating...' : 'Generate with WebGPU'}
              </button>
            </div>
            <div className="mt-2">
              <button
                type="submit"
                className="font-inter text-white bg-black border border-black font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                {loading ? 'Sharing...' : 'Share memory'}
              </button>


              <h2 className="font-inter mt-10 text-lg font-bold mb-2">WebGPU Generation (Beta)</h2>
              <p>🔧 <strong className='font-inter'>Quick Info:</strong></p>
              <ul className="font-inter list-disc pl-5 mb-2">
                <li className='font-inter text-[#666e75] text-[14px] max-w-[500px]'>Generate image in-browser using your own GPU.</li>
                <li className='font-inter text-[#666e75] text-[14px] max-w-[500px]'>Best with Chrome Canary & Mac M1/M2 GPUs.</li>
                <li className='font-inter text-[#666e75] text-[14px] max-w-[500px]'>Initial run may be slower (model download).</li>
                <li className='font-inter text-[#666e75] text-[14px] max-w-[500px]'>Adapted from <a href="https://github.com/mlc-ai/web-stable-diffusion" target="_blank" rel="noopener noreferrer" className="font-inter text-blue-500 hover:underline">Web Stable Diffusion</a></li>

                </ul>
                <p>⚠ <strong className='font-inter'>Limitations:</strong></p>
                <ul className="list-disc pl-5 mb-2">
                  <li className='font-inter text-[#666e75] text-[14px] max-w-[500px]'>Experimental: might be slower/unstable.</li>
                  <li className='font-inter text-[#666e75] text-[14px] max-w-[500px]'>Environment-specific.</li>
                  </ul>
                  
            </div>
          </div>
        </form>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} message={modalMessage} />

    </section>
  );
};

export default AddMemory;

import React, { useEffect, useState } from 'react';
import { Card, Loader, Artwork, Pixel} from '../components';

const PixelGrid = ({ data }) => {
  return (
    <div className="flex">
      {data?.map((post) => (
        <Pixel key={post._id} color={post.color} webGPU={post.webGPU}/>
      ))}
    </div>
  );
};

const RenderPixels = ({ data }) => {
  return (
    <div>
      <PixelGrid data={data} />
    </div>
  );
};

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return (
      data.map((post) => <Card key={post._id} {...post} />)
    );
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [showCards, setShowCards] = useState(false);
  const fetchPosts = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/post', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto">
      <Artwork/>

      <h1 className="font-inter font-extrabold text-[#222328] text-[32px] mb-4 text-left">Memory bank</h1>
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

  <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
    <RenderPixels data={allPosts} title="posts" />
  </div>
  <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex justify-center mt-4">
    <button 
      className="font-inter bg-white text-black border border-black py-2 px-4 rounded" 
      onClick={() => setShowCards(!showCards)}
    >
      {showCards ? 'Hide' : 'Expand'}
      </button>
      </div>
      {showCards && <RenderCards data={allPosts} title="posts" />}
      </div>

        )}
      </div>
    </section>
);

};

export default Home;

import AlgorithmCard from "./AlgorithmCard";

const Landing = () => {
  return (
    <main className="bg-[#161616] flex flex-col gap-24 text-white min-h-screen  mx-auto pt-24">
      <div className="w-[85%] mx-auto flex flex-col gap-24">
        <div className="flex-col flex gap-4 w-1/2 ">
          <h1 className="text-5xl font-bold mb-4 leading-14 ">
            {" "}
            Welcome to <br />
            Crypto Blue Blocks <br />
            Marketplace
          </h1>
          <p className="text-xl">Your gateway to decentralized AI trading!</p>

          <div className="flex">
            <input
              className="rounded-lg p-2 w-full border border-gray-600  mr-4"
              type="search"
              placeholder="What algorithm are you seeking?"
            />
            <button className="bg-[#2aa5ff] text-white-bold text-lg px-8 py-2 rounded-lg">
              Search
            </button>
          </div>
        </div>

        <div className="flex-col flex items-center gap-8">
          <h3 className="text-3xl">Explore algorithms</h3>
          <div className="flex gap-8">
            <AlgorithmCard />
            <AlgorithmCard />
            <AlgorithmCard />
            <AlgorithmCard />
            <AlgorithmCard />
            <AlgorithmCard />
          </div>
        </div>
      </div>
    </main>
  );
};
export default Landing;

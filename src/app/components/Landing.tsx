import AlgorithmCard from "./AlgorithmCard";
import { FaSearch } from "react-icons/fa";

const Landing = () => {
  return (
    <main className="bg-[#161616] flex flex-col gap-24 text-white min-h-screen  mx-auto pt-24">
      <div className="w-[85%] mx-auto flex flex-col gap-24">
        <div className="flex gap-8 items-center">
          <div className="flex-col flex gap-4 w-1/2 ">
            <h1 className="text-5xl font-bold mb-4 leading-14 ">
              {" "}
              Welcome to <br />
              Crypto Blue Blocks <br />
              Marketplace
            </h1>
            <p className="text-xl">Your gateway to decentralized AI trading!</p>

            <div className="flex">
              <div className="relative w-full mr-4">
                <input
                  className="rounded-lg p-2 w-full border border-gray-600 pr-10"
                  type="search"
                  placeholder="What algorithm are you seeking?"
                />
                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button className="bg-[#2aa5ff] text-white font-bold text-lg px-8 py-2 rounded-lg">
                Search
              </button>
            </div>
          </div>
          
          <div className="w-1/2 flex justify-center">
            <div 
              data-quest-tour="a37badea8-8512-494b-93a3-83e00cf4bc2c" 
              className="ImageNodestyles__ImageBaseContainer-sc-y2co4k-0 ImageNodestyles__ImageContainer-sc-y2co4k-1 jChcyA" 
              style={{
                visibility: "visible",
                backgroundImage: "url('https://assets.api.uizard.io/api/cdn/stream/f4ffb168-8c81-4855-b28e-5593b17c267c.png')",
                backgroundPosition: "center center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                boxShadow: "rgba(0, 0, 0, 0.08) 0px 0px 0px",
                borderRadius: "324px",
                border: "0px",
                width: "400px",
                height: "400px"
              }}
            />
          </div>
        </div>

        <div className="flex-col flex items-center gap-8">
          <h3 className="text-3xl">Explore algorithms</h3>
          <div className="flex gap-8">
            <AlgorithmCard label="Top" />
            <AlgorithmCard label="Vendors" />
            <AlgorithmCard label="Traders" />
            <AlgorithmCard label="API Details" />
            <AlgorithmCard label="Chat" />
            <AlgorithmCard label="Algorithm" />
          </div>
        </div>
      </div>
    </main>
  );
};
export default Landing;

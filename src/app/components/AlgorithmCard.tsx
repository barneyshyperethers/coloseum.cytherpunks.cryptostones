const AlgorithmCard = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center justify-center p-4 aspect-[1/1] w-40 h-40 hover:text-[#4a9eff] transition-all cosmic-text-glow cosmic-hover cosmic-card">
      {label === "Top" ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-white font-medium text-center mb-2">Top</span>
          <div 
            data-quest-tour="acba6aa8a-e6b2-4620-a4f6-241331996d93" 
            className="ImageNodestyles__ImageBaseContainer-sc-y2co4k-0 ImageNodestyles__ImageContainer-sc-y2co4k-1 jChcyA" 
            style={{
              visibility: "visible",
              backgroundImage: "url('https://assets.api.uizard.io/api/cdn/stream/acb8f2d3-5f1c-424b-a74b-7e045a75a50d.png')",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              boxShadow: "rgba(0, 0, 0, 0.08) 0px 0px 0px",
              borderRadius: "12px",
              border: "0px",
              width: "80%",
              height: "70%"
            }}
          />
        </div>
      ) : label === "Vendors" ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-white font-medium text-center mb-2">Vendors</span>
          <div 
            data-quest-tour="ac3221246-a9c7-4e39-880f-b2becd3a1ac1" 
            className="ImageNodestyles__ImageBaseContainer-sc-y2co4k-0 ImageNodestyles__ImageContainer-sc-y2co4k-1 jChcyA" 
            style={{
              visibility: "visible",
              backgroundImage: "url('https://assets.api.uizard.io/api/cdn/stream/124150c9-ee6f-436b-8ef6-3ee5b85bc7e6.png')",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              boxShadow: "rgba(0, 0, 0, 0.08) 0px 0px 0px",
              borderRadius: "12px",
              border: "0px",
              width: "80%",
              height: "70%"
            }}
          />
        </div>
      ) : label === "Traders" ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-white font-medium text-center mb-2">Traders</span>
          <div 
            data-quest-tour="afcd47859-45ab-4c2b-b112-93427aaf4649" 
            className="ImageNodestyles__ImageBaseContainer-sc-y2co4k-0 ImageNodestyles__ImageContainer-sc-y2co4k-1 jChcyA" 
            style={{
              visibility: "visible",
              backgroundImage: "url('https://assets.api.uizard.io/api/cdn/stream/210ae28c-8973-47c3-b396-a006beb83adb.png')",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              boxShadow: "rgba(0, 0, 0, 0.08) 0px 0px 0px",
              borderRadius: "12px",
              border: "0px",
              width: "80%",
              height: "70%"
            }}
          />
        </div>
      ) : label === "API Details" ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-white font-medium text-center mb-2">API Details</span>
          <div 
            data-quest-tour="a5940da81-f212-457e-9f6a-5d7b71ebaf6d" 
            className="ImageNodestyles__ImageBaseContainer-sc-y2co4k-0 ImageNodestyles__ImageContainer-sc-y2co4k-1 jChcyA" 
            style={{
              visibility: "visible",
              backgroundImage: "url('https://assets.api.uizard.io/api/cdn/stream/57930274-0ead-422e-8f82-94fe6ebba7e4.png')",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              boxShadow: "rgba(0, 0, 0, 0.08) 0px 0px 0px",
              borderRadius: "12px",
              border: "0px",
              width: "80%",
              height: "70%"
            }}
          />
        </div>
      ) : label === "Chat" ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-white font-medium text-center mb-2">Chat</span>
          <div 
            data-quest-tour="a7f817f4c-5a7c-49dc-aa05-96f3bd4abd89" 
            className="ImageNodestyles__ImageBaseContainer-sc-y2co4k-0 ImageNodestyles__ImageContainer-sc-y2co4k-1 jChcyA" 
            style={{
              visibility: "visible",
              backgroundImage: "url('https://assets.api.uizard.io/api/cdn/stream/00d95412-0da1-4d66-809d-406eb3735184.png')",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              boxShadow: "rgba(0, 0, 0, 0.08) 0px 0px 0px",
              borderRadius: "12px",
              border: "0px",
              width: "80%",
              height: "70%"
            }}
          />
        </div>
      ) : label === "Algorithm" ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <span className="text-white font-medium text-center mb-2">Algorithm</span>
          <div 
            data-quest-tour="abe31abb8-eeb3-448c-8812-cceaff3dff4a" 
            className="ImageNodestyles__ImageBaseContainer-sc-y2co4k-0 ImageNodestyles__ImageContainer-sc-y2co4k-1 jChcyA" 
            style={{
              visibility: "visible",
              backgroundImage: "url('https://assets.api.uizard.io/api/cdn/stream/a8a2bd7c-2103-4a5d-a5be-baf64fedba92.png')",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              boxShadow: "rgba(0, 0, 0, 0.08) 0px 0px 0px",
              borderRadius: "12px",
              border: "0px",
              width: "80%",
              height: "70%"
            }}
          />
        </div>
      ) : (
        <span className="text-white font-medium text-center">{label}</span>
      )}
    </div>
  );
};
export default AlgorithmCard;

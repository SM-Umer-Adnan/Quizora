import { useEffect } from "react";

declare global {
  interface Window {
    atOptions?: Record<string, any>;
    adsbyadsterra?: any[];
  }
}

const AdsterraBanner: React.FC = () => {
  useEffect(() => {
    const adContainer = document.getElementById("adsterra-banner");
    if (!adContainer) return;

    // Create script 1
    const script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.innerHTML = `
      atOptions = {
        'key' : 'd9536f513f2750c495ea8d400d0953aa',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    // Create script 2
    const script2 = document.createElement("script");
    script2.type = "text/javascript";
    script2.src = "//www.highperformanceformat.com/d9536f513f2750c495ea8d400d0953aa/invoke.js";

    // Append scripts
    adContainer.appendChild(script1);
    adContainer.appendChild(script2);

    return () => {
      adContainer.innerHTML = ""; // cleanup
    };
  }, []);

  return (
    <div
      id="adsterra-banner"
      style={{ textAlign: "center", margin: "20px 0" }}
    ></div>
  );
};

export default AdsterraBanner;

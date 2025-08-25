import React from 'react';

const FooterSection = () => {
  return (
    <>
      <footer id="footer-background" className="bg-black text-white py-[120px] relative overflow-hidden font-body">
        <div className="container mx-auto px-6 w-full max-w-[1200px]">
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row justify-between w-full">
              <div className="flex flex-col">
                <p className="text-base font-normal text-white mb-6 uppercase tracking-wider">
                  (LET'S CONNECT)
                </p>
                <a
                  href="mailto:ms1591934@gmail.com"
                  className="text-white text-[32px] md:text-[56px] font-semibold leading-none tracking-tighter hover:text-primary transition-colors duration-200 ease-in-out"
                >
                  ms1591934@gmail.com
                </a>
                <a
                  href="mailto:b24bs1555@iitj.ac.in"
                  className="text-white text-[32px] md:text-[56px] font-semibold leading-none tracking-tighter hover:text-primary transition-colors duration-200 ease-in-out mt-2"
                >
                  b24bs1555@iitj.ac.in
                </a>
              </div>
              <div className="flex flex-col items-start md:items-end text-left md:text-right mt-16 md:mt-0">
                <div className="flex flex-col items-start md:items-end gap-y-3 mb-16">
                  <a href="https://twitter.com/mayyankks" target="_blank" rel="noopener noreferrer" className="text-primary text-base font-medium hover:text-white transition-colors duration-200 ease-in-out">
                    X (TWITTER)
                  </a>
                  <a href="https://linkedin.com/in/mayankiitj" target="_blank" rel="noopener noreferrer" className="text-primary text-base font-medium hover:text-white transition-colors duration-200 ease-in-out">
                    LINKEDIN
                  </a>
                  <a href="https://instagram.com/mayyanks" target="_blank" rel="noopener noreferrer" className="text-primary text-base font-medium hover:text-white transition-colors duration-200 ease-in-out">
                    INSTAGRAM
                  </a>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    © 2025 Mayank Sharma
                  </p>
                  <p className="mt-1">
                    Full-Stack Developer & AI/ML Engineer
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-24 w-full">
              <h1 className="text-primary text-[48px] sm:text-[64px] md:text-[80px] lg:text-[96px] font-black leading-[0.8] tracking-tighter break-words">
                MAYANK SHARMA®
              </h1>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterSection;
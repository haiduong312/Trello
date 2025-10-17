"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const NprogressProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#1677ff"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default NprogressProviders;

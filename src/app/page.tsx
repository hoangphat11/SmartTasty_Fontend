import React from "react";
import ClientOnly from "@/components/ClientOnly";
import Home from "@/screens/Home";

const Page = () => {
  return (
    <ClientOnly>
      <Home />
    </ClientOnly>
  );
};

export default Page;

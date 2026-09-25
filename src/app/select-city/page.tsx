import { Suspense } from "react";

import SelectCityClient from "./SelectCityClient";


export default function SelectCityPage() {

  return (

    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >

      <SelectCityClient />

    </Suspense>

  );

}
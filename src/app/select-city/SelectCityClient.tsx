"use client";


import {
  useEffect,
  useState
} from "react";


import {
  useSearchParams,
  useRouter
} from "next/navigation";


import {
  getProvinces,
  getCitiesByProvince,
  Province,
  City
} from "@/services/location.service";


import {
  getToken
} from "@/lib/auth";





export default function SelectCityClient() {


  const router = useRouter();


  const searchParams = useSearchParams();


  const userId = searchParams.get(
    "user_id"
  );



  const [provinces, setProvinces] = useState<Province[]>([]);


  const [cities, setCities] = useState<City[]>([]);



  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);


  const [selectedCity, setSelectedCity] = useState<number | null>(null);



  const [loading, setLoading] = useState(false);





  useEffect(() => {


    async function loadProvinces() {


      const data = await getProvinces();


      setProvinces(data);


    }


    loadProvinces();


  }, []);






  async function handleProvinceChange(
    provinceId: number
  ) {


    setSelectedProvince(
      provinceId
    );


    setSelectedCity(null);



    const data = await getCitiesByProvince(
      provinceId
    );


    setCities(data);


  }






  async function handleSubmit() {


    if (!selectedProvince || !selectedCity) {

      alert(
        "لطفاً شهر را انتخاب کنید"
      );

      return;

    }



    const token = getToken();


    if (!token) {

      alert(
        "Session پیدا نشد"
      );

      return;

    }



    setLoading(true);



    try {


      const response = await fetch(

        "http://127.0.0.1:8000/users/me/city?token=" + token,

        {

          method: "PATCH",

          headers: {

            "Content-Type": "application/json"

          },


          body: JSON.stringify({

            province_id: selectedProvince,

            city_id: selectedCity

          })

        }

      );



      if (!response.ok) {

        throw new Error(
          "City update failed"
        );

      }



      router.push("/");


    }

    catch(error) {


      console.log(error);


      alert(
        "خطا در ثبت شهر"
      );


    }

    finally {

      setLoading(false);

    }


  }







  return (


    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">


      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-8 border border-zinc-800">


        <h1 className="text-2xl font-bold text-white mb-6">

          انتخاب شهر

        </h1>



        <p className="text-zinc-400 mb-5">

          کاربر شماره: {userId}

        </p>




        <select

          className="w-full rounded-lg bg-zinc-800 text-white p-3 mb-4"

          value={selectedProvince ?? ""}

          onChange={(e)=>

            handleProvinceChange(
              Number(e.target.value)
            )

          }

        >


          <option value="">

            انتخاب استان

          </option>



          {

            provinces.map(

              province => (

                <option

                  key={province.id}

                  value={province.id}

                >

                  {province.name}

                </option>

              )

            )

          }


        </select>






        <select

          className="w-full rounded-lg bg-zinc-800 text-white p-3 mb-5"

          value={selectedCity ?? ""}

          onChange={(e)=>

            setSelectedCity(
              Number(e.target.value)
            )

          }

          disabled={!cities.length}

        >


          <option value="">

            انتخاب شهر

          </option>



          {

            cities.map(

              city => (

                <option

                  key={city.id}

                  value={city.id}

                >

                  {city.name}

                </option>

              )

            )

          }


        </select>






        <button

          onClick={handleSubmit}

          disabled={loading}

          className="w-full rounded-lg bg-white text-black p-3"

        >

          {

            loading

            ? "در حال ذخیره..."

            : "ثبت شهر"

          }


        </button>



      </div>


    </main>


  );


}
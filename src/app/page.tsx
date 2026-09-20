"use client";


import {
  useEffect,
  useState
} from "react";


import {
  getToken
} from "@/lib/auth";


import {
  getCurrentUser
} from "@/services/user.service";




export default function HomePage() {


  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);




  useEffect(() => {


    async function loadUser() {


      const token = getToken();


      if (!token) {

        setLoading(false);

        return;

      }




      try {


        const data = await getCurrentUser(
          token
        );


        setUser(data);



      } catch (error) {


        console.log(
          error
        );



      } finally {


        setLoading(false);

      }


    }



    loadUser();



  }, []);






  if (loading) {


    return (

      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">

        <p className="text-white">
          در حال بارگذاری...
        </p>

      </main>

    );

  }






  return (


    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">


      <div className="w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 p-8 text-white">


        <h1 className="text-3xl font-bold mb-6">
          داشبورد لحظه
        </h1>





        {
          user ? (


            <div className="space-y-3">



              <p>
                شماره:
                {" "}
                {user.phone_number}
              </p>



              <p>
                نقش:
                {" "}
                {user.role}
              </p>



              <p>
                شهر:
                {" "}
                {
                  user.city_name ?? "انتخاب نشده"
                }
              </p>




              <p>
                پروفایل:
                {" "}
                {
                  user.profile_completed
                    ? "تکمیل شده"
                    : "ناقص"
                }
              </p>




            </div>



          ) : (



            <p>
              کاربر پیدا نشد
            </p>



          )

        }



      </div>


    </main>


  );


}
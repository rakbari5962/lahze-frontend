"use client";


import {
  useEffect,
  useState
} from "react";


import {
  getToken
} from "@/lib/auth";


import {
  getCurrentUser,
  updateUserProfile,
  CurrentUser
} from "@/services/user.service";

import {
  toJalali,
  toGregorian
} from "@/lib/date";



export default function ProfilePage() {


  const [user, setUser] = useState<CurrentUser | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);



  const [form, setForm] = useState({

    first_name: "",
    last_name: "",
    secondary_phone: "",
    national_id: "",
    gender: "",
    birth_date: "",
    education: "",
    job_title: "",
    bio: "",
    iban: "",
    email: ""

  });






  useEffect(() => {


    async function loadProfile() {


      const token = getToken();


      if (!token) {

        setLoading(false);

        return;

      }



      try {


        const data = await getCurrentUser(token);


        setUser(data);



        setForm({

          first_name: data.first_name ?? "",
          last_name: data.last_name ?? "",
          secondary_phone: data.secondary_phone ?? "",
          national_id: data.national_id ?? "",
          gender: data.gender ?? "",
          birth_date: toJalali(
            data.birth_date
          ),
          education: data.education ?? "",
          job_title: data.job_title ?? "",
          bio: data.bio ?? "",
          iban: data.iban ?? "",
          email: data.email ?? ""

        });



      } catch (error) {


        console.log(error);


      } finally {


        setLoading(false);

      }


    }



    loadProfile();


  }, []);



  function formatIban(value: string) {

    let numbers = value
      .replace(/\D/g, "")
      .slice(0, 24);


    let formatted = numbers.match(/.{1,4}/g)?.join("-") ?? "";


    return formatted;

  }


  function formatNationalId(
    value: string
  ) {

    return value
      .replace(/\D/g, "")
      .slice(0, 10);

  }


  function cleanIban(value: string) {

    return value
      .replace(/\D/g, "")
      .slice(0,24);

  }



  function handleChange(
    field: string,
    value: string
  ) {


    setForm({

      ...form,

      [field]: value

    });


  }









  async function handleSave() {


    const token = getToken();


    if (!token) {

      return;

    }



    try {


      setSaving(true);



      const updated = await updateUserProfile(
        token,
        {
          ...form,

          iban:
            form.iban
              ? "IR" + form.iban
              : "",

          birth_date: toGregorian(
            form.birth_date
          )
        }
      );



      setUser(updated);



      alert(
        "پروفایل با موفقیت ذخیره شد"
      );



    } catch (error) {


      console.log(error);


      alert(
        "خطا در ذخیره اطلاعات"
      );



    } finally {


      setSaving(false);

    }


  }








  if (loading) {


    return (

      <main
        className="
          min-h-screen
          bg-zinc-950
          flex
          items-center
          justify-center
          text-white
        "
      >

        در حال بارگذاری...

      </main>

    );


  }







  return (


    <main

      dir="rtl"

      className="
        min-h-screen
        bg-zinc-950
        p-6
        text-white
      "

    >



      <div
        className="
          max-w-4xl
          mx-auto
        "
      >




        <div

          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-3xl
            p-8
            shadow-xl
          "

        >



          <div className="mb-8">


            <h1

              className="
                text-3xl
                font-bold
                mb-2
              "

            >

              پروفایل من

            </h1>


            <p

              className="
                text-zinc-400
              "

            >

              اطلاعات شخصی خود را تکمیل کنید

            </p>


          </div>







          <div

            className="
              mb-8
              p-5
              rounded-2xl
              bg-zinc-800/50
              border
              border-zinc-700
            "

          >


            <label

              className="
                block
                mb-3
                text-zinc-300
              "

            >

              شماره موبایل اصلی

            </label>



            <input

              value={
                user?.phone_number ?? ""
              }

              disabled

              className="
                w-full
                rounded-xl
                bg-zinc-800
                border
                border-zinc-700
                p-4
                text-zinc-400
                cursor-not-allowed
              "

            />


          </div>









          <div

            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            "

          >
            <div>

            <label
            className="
            block
            mb-2
            text-sm
            text-zinc-300
            "
            >
            شماره شبا
            </label>


            <div
            className="
            flex
            items-center
            bg-zinc-800
            border
            border-zinc-700
            rounded-xl
            overflow-hidden
            "
            dir="ltr"
            >

            <span
              className="
                px-5
                py-2
                mx-2
                rounded-xl
                bg-emerald-950/60
                border
                border-emerald-500/40
                text-emerald-300
                font-semibold
                text-lg
                flex
                items-center
                justify-center
                shadow-inner
              "
            >
              IR
            </span>


            <input

            value={
              formatIban(
                form.iban.replace("IR","")
              )
            }

            onChange={(e)=>{

              const raw = cleanIban(
                e.target.value
              );


              handleChange(
                "iban",
                raw
              );

            }}


            placeholder="مثال: 1234-5678-9012-3456-7890-1234"
            

            className="
            flex-1
            bg-zinc-800
            p-4
            outline-none
            text-left
            tracking-wider
            "
            />


            </div>


            <div>

              <label
                className="
                  block
                  mb-2
                  text-sm
                  text-zinc-300
                "
              >
                کد ملی
              </label>


              <input

                value={
                  form.national_id
                }


                onChange={(e)=>{

                  handleChange(
                    "national_id",
                    formatNationalId(
                      e.target.value
                    )
                  );

                }}


                placeholder="مثال: 0012345678"


                maxLength={10}


                className="
                  w-full
                  rounded-xl
                  bg-zinc-800
                  border
                  border-zinc-700
                  p-4
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                "

              />

            </div>



            </div>

            {
              [

                ["first_name","نام"],
                ["last_name","نام خانوادگی"],
                ["secondary_phone","شماره موبایل دوم"],
                ["gender","جنسیت"],
                ["birth_date","تاریخ تولد"],
                ["education","تحصیلات"],
                ["job_title","شغل"],
                ["email","ایمیل"]

              ].map(([key,label]) => (


                <div key={key}>


                  <label

                    className="
                      block
                      mb-2
                      text-sm
                      text-zinc-300
                    "

                  >

                    {label}

                  </label>




                  <input


                    type="text"


                    placeholder={
                      key === "birth_date"
                        ? "مثال: 1375/10/20"
                        : ""
                    }



                    value={
                      (form as any)[key]
                    }



                    onChange={(e)=>

                      handleChange(
                        key,
                        e.target.value
                      )

                    }



                    className="
                      w-full
                      rounded-xl
                      bg-zinc-800
                      border
                      border-zinc-700
                      p-4
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-500/20
                    "


                  />


                </div>


              ))

            }


          </div>









          <div className="mt-5">


            <label

              className="
                block
                mb-2
                text-sm
                text-zinc-300
              "

            >

              درباره من

            </label>



            <textarea


              value={
                form.bio
              }



              onChange={(e)=>

                handleChange(
                  "bio",
                  e.target.value
                )

              }



              rows={6}



              className="
                w-full
                rounded-xl
                bg-zinc-800
                border
                border-zinc-700
                p-4
                resize-none
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/20
              "


            />


          </div>









          <button


            onClick={handleSave}



            disabled={saving}



            className="
              mt-8
              w-full
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              transition
              p-4
              font-bold
              text-lg
              disabled:opacity-50
            "


          >


            {
              saving
                ? "در حال ذخیره..."
                : "ذخیره تغییرات"
            }


          </button>





        </div>



      </div>



    </main>


  );


}
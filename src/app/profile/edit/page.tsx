"use client";


import {
  useEffect,
  useState
} from "react";

import { useRouter } from "next/navigation";


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

  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);



  const [form, setForm] = useState({

  phone_number: "",

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
  console.log("FULL USER RESPONSE:", data);


  setForm({

  phone_number: data.phone_number ?? "",

  first_name: data.first_name ?? "",
  last_name: data.last_name ?? "",
  secondary_phone: data.secondary_phone ?? "",
  national_id: data.national_id ?? "",
  gender: data.gender ?? "",
  birth_date: toJalali(data.birth_date),
  education: data.education ?? "",
  job_title: data.job_title ?? "",
  bio: data.bio ?? "",
  iban: data.iban ?? "",
  email: data.email ?? ""

  });


} catch (error) {

  console.log(error);

} finally {

  console.log("LOAD FINISHED");
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

      console.log("SAVE DATA:", {
        ...form
      });


      console.log("FORM BEFORE SAVE:", form);
      console.log("JOB TITLE BEFORE SAVE:", form.job_title);
      const payload = {
        ...form,

        iban:
          form.iban
            ? form.iban.startsWith("IR")
              ? form.iban
              : "IR" + form.iban
            : null,

        birth_date: toGregorian(form.birth_date),
      };


      console.log("FINAL PAYLOAD:", payload);
      console.log("JOB TITLE IN PAYLOAD:", payload.job_title);

      const updated = await updateUserProfile(
        token,
        {
          ...form,

          iban:
            form.iban
              ? form.iban.startsWith("IR")
                ? form.iban
                : "IR" + form.iban
              : null,

          birth_date: toGregorian(form.birth_date),
        }
      );



      setUser(updated);



      alert(
        "پروفایل با موفقیت ذخیره شد"
      );

      router.push("/profile");



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
                form.phone_number
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



                  {
                    key === "gender" ? (

                      <select

                        value={form.gender}

                        onChange={(e)=>
                          handleChange(
                            "gender",
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

                      >

                        <option value="">
                          انتخاب کنید
                        </option>


                        <option value="مرد">
                          مرد
                        </option>


                        <option value="زن">
                          زن
                        </option>


                      </select>


                    ) : (

                      <div className="relative">

                        {key === "secondary_phone" && (
                          <div
                            className="
                              absolute
                              left-0
                              top-0
                              h-full
                              w-16
                              flex
                              items-center
                              justify-center
                              text-amber-400
                              text-lg
                              font-bold
                              tracking-wide
                              border-r
                              border-zinc-700
                              select-none
                            "
                            
                          >
                            09
                          </div>
                          )}


                          <input

                            type="text"

                            dir="ltr"

                            value={
                              key === "secondary_phone"
                                ? (form.secondary_phone?.replace(/^09/, "") ?? "")
                                : (form as any)[key]
                            }


                            placeholder={
                              key === "secondary_phone"
                                ? "xxxxxxxxx"
                                : key === "birth_date"
                                  ? "مثال: 1365/04/26"
                                  : ""
                            }


                            maxLength={
                              key === "secondary_phone"
                                ? 9
                                : undefined
                            }


                            onChange={(e)=>{

                              if(key === "secondary_phone"){

                                const value = e.target.value
                                  .replace(/\D/g,"")
                                  .slice(0,9);


                                handleChange(
                                  "secondary_phone",
                                  value ? "09" + value : ""
                                );


                              } else {

                                handleChange(
                                  key,
                                  e.target.value
                                );

                              }

                            }}


                            className="
                              w-full
                              rounded-xl
                              bg-zinc-800
                              border
                              border-zinc-700
                              p-4
                              pl-20
                              outline-none
                              transition
                              focus:border-blue-500
                              focus:ring-2
                              focus:ring-blue-500/20
                            "

                          />

                        </div>


                    )
                  }


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


              value={form.bio}


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





          <div className="flex gap-4 mt-8">

              <button

                onClick={handleSave}

                disabled={saving}

                className="
                  flex-1
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



              <button

                onClick={() => router.push("/profile")}

                type="button"

                className="
                  flex-1
                  rounded-xl
                  bg-zinc-700
                  hover:bg-zinc-600
                  transition
                  p-4
                  font-bold
                  text-lg
                "

              >

                انصراف

              </button>


            </div>


        </div>


      </div>


    </main>


  );


}
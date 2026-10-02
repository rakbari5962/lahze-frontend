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

        birth_date: form.birth_date
          ? toGregorian(form.birth_date)
          : null,
      };


      console.log("FINAL PAYLOAD:", payload);
console.log("JOB TITLE IN PAYLOAD:", payload.job_title);


const updated = await updateUserProfile(
  token,
  payload
);


console.log(
  "UPDATED USER AFTER SAVE:",
  updated
);


setUser(updated);


alert("اطلاعات شما با موفقیت ذخیره شد");


router.push("/profile");


    } catch (error:any) {


      console.log("SAVE ERROR:", error);


      alert(
        error.message || "خطا در ذخیره اطلاعات"
      );



    } finally {


      setSaving(false);

    }


  }








  if (loading) {

  return (
    <main
      dir="rtl"
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#f5f6f8]
        text-zinc-700
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
bg-[#f5f6f8]
p-6
"
>


<div
className="
max-w-5xl
mx-auto
bg-white
border
border-zinc-200
rounded-3xl
shadow-sm
p-10
"
>


<div
className="
flex
items-center
justify-between
mb-10
"
>


<div>

<h1
className="
text-3xl
font-black
text-zinc-900
"
>
پروفایل من
</h1>


<p
className="
mt-3
text-zinc-500
font-medium
"
>
اطلاعات شخصی خود را تکمیل کنید
</p>

</div>



</div>





<EditSection title="اطلاعات تماس">


<div className="
grid
md:grid-cols-2
gap-5
">


<EditField
label="شماره موبایل اصلی"
value={form.phone_number}
disabled
/>


<EditField
label="ایمیل"
value={form.email}
onChange={(v)=>handleChange("email",v)}
/>


</div>


</EditSection>





<EditSection title="اطلاعات هویتی">


<div
className="
grid
md:grid-cols-2
gap-5
"
>


<EditField
label="نام"
value={form.first_name}
onChange={(v)=>handleChange("first_name",v)}
/>


<EditField
label="نام خانوادگی"
value={form.last_name}
onChange={(v)=>handleChange("last_name",v)}
/>


<EditField
label="کد ملی"
value={form.national_id}
onChange={(v)=>handleChange("national_id",formatNationalId(v))}
/>

<div>

<label
className="
block
mb-2
text-sm
font-bold
text-zinc-700
"
>
جنسیت
</label>


<select
value={form.gender}
onChange={(e)=>handleChange("gender", e.target.value)}
className="
w-full
rounded-xl
border
border-zinc-200
px-4
py-3
bg-white
text-zinc-900
font-medium
outline-none
focus:border-blue-500
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

</div>


<EditField
label="تاریخ تولد"
value={form.birth_date}
placeholder="مثال: 1365/04/26"
onChange={(v)=>handleChange("birth_date",v)}
/>



</div>

</EditSection>






<EditSection title="اطلاعات کاری">


<div
className="
grid
md:grid-cols-2
gap-5
"
>


<EditField
label="تحصیلات"
value={form.education}
onChange={(v)=>handleChange("education",v)}
/>



<EditField
label="شغل"
value={form.job_title}
onChange={(v)=>handleChange("job_title",v)}
/>


</div>


</EditSection>






<EditSection title="اطلاعات بانکی">


<EditField
label="شماره شبا"
value={form.iban}
onChange={(v)=>handleChange("iban",v)}
/>


</EditSection>





<EditSection title="درباره من">


<textarea

value={form.bio}

onChange={(e)=>
handleChange(
"bio",
e.target.value
)
}

rows={5}

className="
w-full
rounded-xl
bg-zinc-50
border
border-zinc-200
p-4
text-zinc-900
font-medium
outline-none
focus:border-blue-500
"

 />


</EditSection>





<div
className="
flex
gap-4
mt-10
"
>


<button

onClick={handleSave}

disabled={saving}

className="
flex-1
bg-blue-600
hover:bg-blue-700
text-white
rounded-xl
py-4
font-bold
text-lg
transition
"

>

{
saving
?
"در حال ذخیره..."
:
"ذخیره تغییرات"
}

</button>



<button

type="button"

onClick={()=>
router.push("/profile")
}

className="
flex-1
bg-zinc-100
hover:bg-zinc-200
text-zinc-700
rounded-xl
py-4
font-bold
text-lg
"

>

انصراف

</button>



</div>




</div>


</main>

);

}   





function EditSection({

title,
children

}:{

title:string;
children:React.ReactNode;

}){


return (

<section 
className="
mb-7
"
>

<h2
className="
text-lg
font-bold
text-zinc-900
mb-3
"
>

{title}

</h2>


{children}


</section>

)

}





function EditField({

label,
value,
onChange,
disabled,
placeholder

}:{

label:string;
value:string;
onChange?:(v:string)=>void;
disabled?:boolean;
placeholder?:string;

}){


return (

<div>


<label
className="
block
mb-2
text-sm
font-bold
text-zinc-700
"
>

{label}

</label>


<input

value={value ?? ""}

placeholder={placeholder}

disabled={disabled}

onChange={(e)=>
onChange?.(e.target.value)
}

className={`
w-full
rounded-xl
border
px-4
py-3
font-medium
outline-none

${
disabled
?
"bg-zinc-100 text-zinc-500"
:
"bg-white text-zinc-900 border-zinc-200 focus:border-blue-500"
}

`}

/>


</div>


)

}
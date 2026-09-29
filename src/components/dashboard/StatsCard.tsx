import React from "react";


interface Props {

title:string;
value:string;
icon:React.ReactNode;

theme?:
"blue" |
"red" |
"green" |
"purple";

}



export default function StatsCard({

title,
value,
icon,
theme="blue"

}:Props){



const themes = {

blue:"bg-blue-50 text-blue-600",

red:"bg-red-50 text-red-500",

green:"bg-green-50 text-green-600",

purple:"bg-purple-50 text-purple-600"

};



const iconBox = themes[theme];



return (

<div

className="
bg-white
rounded-3xl
p-6
border
border-slate-100
shadow-sm
text-center
hover:-translate-y-1
transition
duration-200
"

>


<div

className={`
w-14
h-14
mx-auto
rounded-2xl
${iconBox}
flex
items-center
justify-center
mb-4
`}
>

{icon}

</div>



<p

className="
text-3xl
font-black
text-slate-900
"

>

{value}

</p>



<p

className="
mt-3
text-xs
text-slate-500
font-medium
"

>

{title}

</p>


</div>


)

}
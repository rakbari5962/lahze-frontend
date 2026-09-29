interface Props {

title:string;
subtitle:string;
icon:string;
theme?: 
"red" |
"green" |
"purple" |
"blue" |
"yellow" |
"teal";

onClick?:()=>void;

}



export default function QuickActionCard({

title,
subtitle,
icon,
theme="blue",
onClick

}:Props){



const themes = {

red:{
box:"bg-red-50",
icon:"bg-red-100 text-red-500",
arrow:"text-red-500"
},


green:{
box:"bg-green-50",
icon:"bg-green-100 text-green-600",
arrow:"text-green-600"
},


purple:{
box:"bg-purple-50",
icon:"bg-purple-100 text-purple-600",
arrow:"text-purple-600"
},


blue:{
box:"bg-blue-50",
icon:"bg-blue-100 text-blue-600",
arrow:"text-blue-600"
},


yellow:{
box:"bg-yellow-50",
icon:"bg-yellow-100 text-yellow-600",
arrow:"text-yellow-600"
},


teal:{
box:"bg-teal-50",
icon:"bg-teal-100 text-teal-600",
arrow:"text-teal-600"
}

};



const style = themes[theme];



return (


<button

onClick={onClick}

className={`
w-full
rounded-3xl
p-6
min-h-[120px]
${style.box}
flex
items-center
justify-between
transition
hover:-translate-y-1
duration-200
`}

>



<div

className="
text-right
"

>


<h3

className="
font-black
text-slate-900
text-xl
"

>

{title}

</h3>



<p

className="
mt-2
text-xs
text-slate-500
font-medium
"

>

{subtitle}

</p>



</div>




<div

className="
flex
items-center
gap-5
flex-row-reverse
"

>


<span

className={`
text-xl
${style.arrow}
`}
>

‹

</span>




<div

className={`
w-16
h-16
rounded-2xl
flex
items-center
justify-center
text-3xl
shadow-sm
${style.icon}
`}

>

{icon}

</div>


</div>



</button>


)


}
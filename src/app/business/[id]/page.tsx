import CustomerExperienceCard
from "@/components/customer-experience/CustomerExperienceCard";


import {
  getBusinessPublicProfile
} from "@/services/business.service";



interface PageProps {

  params: Promise<{
    id: string;
  }>;

}





export default async function BusinessPage({

  params

}: PageProps) {



  const { id } = await params;



  const profile =

    await getBusinessPublicProfile(

      Number(id)

    );





  return (



    <main className="min-h-screen bg-gray-50 p-8">



      <div className="mx-auto max-w-4xl space-y-8">





        {/* Business Header */}



        <section className="rounded-xl bg-white p-6 shadow">



          <h1 className="text-3xl font-bold text-gray-900">

            {profile.business.name}

          </h1>




          <p className="mt-3 text-gray-600">

            {profile.business.description}

          </p>




          {

            profile.business.phone && (

              <p className="mt-2 text-gray-500">

                {profile.business.phone}

              </p>

            )

          }



        </section>








        {/* Reputation */}



        <section className="rounded-xl bg-white p-6 shadow">



          <h2 className="text-xl font-bold text-gray-900">

            اعتبار کسب‌وکار

          </h2>





          <div className="mt-5 flex gap-10">





            <div>



              <div className="text-3xl font-bold text-gray-900">

                ⭐ {profile.reputation.average_rating}

              </div>



              <p className="text-gray-500">

                امتیاز میانگین

              </p>



            </div>







            <div>



              <div className="text-3xl font-bold text-gray-900">

                {profile.reputation.total_reviews}

              </div>



              <p className="text-gray-500">

                تعداد نظرات

              </p>



            </div>





          </div>



        </section>









        {/* Customer Experience */}



        <section className="rounded-xl bg-white p-6 shadow">



          <h2 className="mb-4 text-xl font-bold text-gray-900">

            {profile.customer_experience.title}

          </h2>





          <div className="flex flex-wrap gap-6">



            {

              profile.customer_experience.items.map(

                (item, index) => (


                  <CustomerExperienceCard

                    key={index}

                    item={item}

                  />


                )

              )

            }



          </div>



        </section>







      </div>





    </main>



  );

}
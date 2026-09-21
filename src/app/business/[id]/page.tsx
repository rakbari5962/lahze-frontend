import BookingButton 
from "@/components/booking/BookingButton";

import CustomerExperienceCard 
from "@/components/customer-experience/CustomerExperienceCard";


import {
  getBusinessPublicProfile
} from "@/services/business.service";


import {
  getBusinessOpportunities
} from "@/services/opportunity.service";



interface PageProps {

  params: Promise<{
    id: string;
  }>;

}



export default async function BusinessPage({

  params

}: PageProps) {


  const { id } = await params;



  const businessId = Number(id);



  const profile =
    await getBusinessPublicProfile(
      businessId
    );



  const opportunities =
    await getBusinessOpportunities(
      businessId
    );





  return (

    <main className="min-h-screen bg-zinc-950 p-8">


      <div className="mx-auto max-w-4xl space-y-8">



        {/* Business Header */}

        <section className="rounded-xl bg-zinc-900 p-6 shadow border border-zinc-800">


          <h1 className="text-3xl font-bold text-white">

            {profile.business.name}

          </h1>


          <p className="mt-3 text-zinc-400">

            {profile.business.description}

          </p>



          {
            profile.business.phone && (

              <p className="mt-2 text-zinc-500">

                {profile.business.phone}

              </p>

            )
          }


        </section>






        {/* Reputation */}

        <section className="rounded-xl bg-zinc-900 p-6 shadow border border-zinc-800">


          <h2 className="text-xl font-bold text-white">

            اعتبار کسب‌وکار

          </h2>



          <div className="mt-5 flex gap-10">


            <div>

              <div className="text-3xl font-bold text-white">

                ⭐ {profile.reputation.average_rating}

              </div>


              <p className="text-zinc-400">

                امتیاز میانگین

              </p>


            </div>




            <div>

              <div className="text-3xl font-bold text-white">

                {profile.reputation.total_reviews}

              </div>


              <p className="text-zinc-400">

                تعداد نظرات

              </p>


            </div>


          </div>


        </section>






        {/* Customer Experience */}


        <section className="rounded-xl bg-zinc-900 p-6 shadow border border-zinc-800">


          <h2 className="mb-4 text-xl font-bold text-white">

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








        {/* Opportunities */}


        <section className="rounded-xl bg-zinc-900 p-6 shadow border border-zinc-800">


          <h2 className="mb-4 text-xl font-bold text-white">

            فرصت‌های رزرو

          </h2>




          {
            opportunities.length === 0 ? (

              <p className="text-zinc-400">

                در حال حاضر فرصت فعالی وجود ندارد.

              </p>


            ) : (


              <div className="space-y-5">


                {
                  opportunities.map(

                    (item) => (


                      <div

					  key={item.id}

					  className={`rounded-lg border border-zinc-700 p-5 ${
						item.reserved_count >= item.capacity
						  ? "opacity-60"
						  : ""
					  }`}

                      >


                        <div className="flex justify-between">


                          <div>


                            <h3 className="text-lg font-bold text-white">

                              فرصت ویژه رزرو

                            </h3>



                            <p className="mt-3 text-zinc-400">

                              قیمت اصلی:

                              {" "}

                              {item.original_price.toLocaleString()}

                              {" "}

                              تومان

                            </p>



                            <p className="mt-2 text-green-400 font-bold">

                              قیمت نهایی:

                              {" "}

                              {item.final_price.toLocaleString()}

                              {" "}

                              تومان

                            </p>



                            <p className="mt-2 text-zinc-400">

                              تخفیف:

                              {" "}

                              {item.discount_percent}٪

                            </p>



                            <p className="mt-2 text-zinc-400">

							  ظرفیت:
							  {" "}
							  {item.reserved_count}
							  /
							  {item.capacity}

							</p>



                            <p className="mt-2 text-zinc-400">

                              شروع:

                              {" "}

                              {new Date(
                                item.start_time
                              ).toLocaleString(
                                "fa-IR"
                              )}

                            </p>


                          </div>



                          <div>

							  {
								item.reserved_count >= item.capacity ? (

								  <span className="rounded bg-zinc-700 px-3 py-1 text-sm text-zinc-300">

									ظرفیت تکمیل شده

								  </span>

								) : (

								  <span className="rounded bg-green-900 px-3 py-1 text-sm text-green-300">

									فعال

								  </span>

								)
							  }

							</div>


                        </div>




                        {
						  item.reserved_count >= item.capacity ? (

							<button

							  disabled

							  className="mt-5 w-full rounded-lg bg-zinc-700 px-5 py-2 text-zinc-400 cursor-not-allowed"

							>

							  ظرفیت تکمیل شده

							</button>

						  ) : (

							<BookingButton

							  opportunityId={item.id}

							/>

						  )
						}



                      </div>


                    )

                  )
                }


              </div>


            )
          }


        </section>





      </div>


    </main>


  );


}
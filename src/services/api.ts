const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";





export async function apiGet<T>(

  endpoint: string

): Promise<T> {


  const response = await fetch(

    `${API_BASE_URL}${endpoint}`,

    {

      cache: "no-store",

    }

  );



  if (!response.ok) {


    const errorText = await response.text();


    console.log(

      "API ERROR:",

      errorText

    );



    throw new Error(

      `API Error: ${response.status} - ${errorText}`

    );


  }



  return response.json();

}







export async function apiPost<T>(

  endpoint: string,

  body: unknown

): Promise<T> {



  const response = await fetch(

    `${API_BASE_URL}${endpoint}`,

    {

      method: "POST",

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify(body)

    }

  );





  if (!response.ok) {


    const errorText = await response.text();


    console.log(

      "API ERROR:",

      errorText

    );



    throw new Error(

      `API Error: ${response.status} - ${errorText}`

    );


  }





  return response.json();

}









export async function apiPatch<T>(

  endpoint: string,

  body: unknown

): Promise<T> {


  const response = await fetch(

    `${API_BASE_URL}${endpoint}`,

    {

      method: "PATCH",

      headers: {

        "Content-Type": "application/json"

      },

      body: JSON.stringify(body)

    }

  );



  if (!response.ok) {


    const errorText = await response.text();


    console.log(

      "API ERROR:",

      errorText

    );



    throw new Error(

      `API Error: ${response.status} - ${errorText}`

    );


  }



  return response.json();

}
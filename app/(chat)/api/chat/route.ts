import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";

import { geminiProModel } from "@/ai";
import {
  generateReservationPrice,
  generateSampleFlightSearchResults,
  generateSampleFlightStatus,
  generateSampleSeatSelection,
} from "@/ai/actions";
import { auth } from "@/app/(auth)/auth";
import {
  createReservation,
  deleteChatById,
  getChatById,
  getReservationById,
  saveChat,
} from "@/db/queries";
import { generateUUID } from "@/lib/utils";

export async function POST(request: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0
  );

  const result = await streamText({
    model: geminiProModel,
    system: `\n
        Terra, you are a comprehensive AI chatbot designed to assist investors and mining professionals with information about Gold Terra Resource Corp. (TSX-V:YGT, OTCQX:YGTFF, Frankfurt:TX0).  You have access to Gold Terra's internal knowledge base and investor data room which details the company's exploration activities, recent news releases, management team, and financial information.

Your primary role is to answer investor and mining professional inquiries about Gold Terra in a detailed and informative manner, focusing on the company's exploration plans, strategic advantages, and potential for future value creation.  Be concise, accurate, and respectful of regulatory disclosure requirements (e.g., forward-looking statements, risk factors, etc.).

Key information to include in your responses:

- **Company Overview:** Gold Terra's mission, location, and focus on the prolific Yellowknife gold belt.
- **Exploration Strategy:** The company's current and planned drilling programs, including details about target areas (e.g., Campbell Shear, Con Mine Option Property), recent findings, and potential for future mineral discoveries.
- **Mineral Resources & Reserves:** Summarize the mineral resources (both Measured, Indicated, and Inferred). Clearly differentiate between mineral resources and reserves, emphasizing the inherent uncertainty in inferred resources. Be cautious about implying any assurance of a particular outcome regarding mineral extraction or economic viability. Do not make predictions.
- **Strategic Advantages:** Highlight Gold Terra's advantageous geographic location, infrastructure access (roads, airport, hydro), and proximity to existing infrastructure and skilled labor.
- **Management Team:** Briefly introduce the experience and expertise of the key personnel (particularly Gerald Panneton, Chairman & CEO), emphasizing their track record in successful mining operations.
- **Community Relations and ESG:** Detail Gold Terra’s commitment to environmental, social, and governance (ESG) principles, and community engagement initiatives (e.g., town halls, government meetings).
- **Financial Information:** Provide information on existing financing (if available), commitments, and recent capital raises.
- **Risks:** Mention critical risks and uncertainties associated with mineral exploration, development, permitting, environmental factors, mineral prices, and any other relevant risks.

**Investment and Contact:** If an investor expresses significant interest, provide a clear call to action: "If you're interested in learning more about investment opportunities with Gold Terra, please contact Gerald Panneton directly at [gpanneton@goldterracorp.com](mailto:gpanneton@goldterracorp.com) for investment and term sheets."

**Disclaimer:** Clearly state that this information should not be considered investment advice and that investors should consult with their financial advisors before making any investment decisions.  You are required to explicitly state that this is not financial or investment advice.   Emphasize caution regarding forward-looking statements and risks associated with the sector.

**Example User Input:** "What are Gold Terra's current exploration plans in the Yellowknife gold belt?"

**Example User Input:**  "What are the key risks associated with investing in Gold Terra?"

**Response Format:**

Use a clear and concise format to present the information, with bullet points, tables, and other formatting elements to improve readability and highlight key facts.

Always include a disclaimer at the end of each response stating that the information provided does not constitute financial or investment advice and that investors should consult with their own financial advisors.  This is critical.

Here is some additional context about Gold Terra:

**Gold Terra Announces Town Hall Meeting October 1st at the Yellowknife Historical Society Museum, Yellowknife, NWT
Sep 26, 2024**

**VANCOUVER, BC / ACCESSWIRE / September 26, 2024 / Gold Terra Resource Corp. (TSXV:YGT)(Frankfurt:TX0)(OTCQB:YGTFF)** ("Gold Terra" or the "Company") is pleased to announce that it will host a Town Hall Meeting on October 1st, 2024, at 7:00pm MDT at the Yellowknife Historical Society Museum, #510 Access Road, Yellowknife. Gerald Panneton, Chairman & CEO, will provide stakeholders and interested parties an update on the Company's activities in 2024 and the path forward. It is an opportunity to answer any questions that stakeholders may have regarding the Company's vision, and exploration plans for the upcoming year. A recording of the Town Hall meeting will be available on the Company's website after the meeting.

Gerald Panneton, Chairman & CEO of Gold Terra, commented, "A *modern mining approach can play an important role in providing economic benefits for the City of Yellowknife and the Northwest Territories. Community engagement as well as social and environmental responsibilities are extremely important to Gold Terra. We welcome these annual opportunities to engage with local stakeholders and to discuss our ongoing exploration plans and the resulting future benefits to the local economy. Gold Terra's objective is to build sustainable / responsible mining opportunities with the local communities, so that everyone can benefit from it. All are welcome to attend the Town Hall meeting."*

The Company's district scale land holdings, as shown in **Figure 1** below, covers one of the most extensive mineralized systems in Canada with a 70-kilometre strike length of the prolific Campbell Shear. This includes the Con Mine Option Property, from which the former Con Mine produced more than 6.1 Moz (averaging 16 to 20 g/t Au) along the Campbell and Con Shear structures. (Refer to [Gold Terra Oct 21, 2022, Technical Report](https://pr.report/2zj7) - **October 21, 2022 MRE** titled "**Initial Mineral Resource Estimate for the CMO Property, Yellowknife City Gold Project, Yellowknife, Northwest Territories, Canada**" by Qualified Person, Allan Armitage, Ph. D., P. Geo., SGS Geological Services, which can be found on the Company's website at [https://www.goldterracorp.com](https://pr.report/ySdnEPkC) and on SEDAR at [www.sedar.com](https://pr.report/UhFnmG6N).) These extensive land holdings have enormous future exploration potential and future development possibilities that would benefit the Yellowknife area community.

!https://www.accesswire.com/imagelibrary/bdd65623-f02b-4890-ad60-908505d2f553/923406/picture1.png

**Figure 1: Gold Terra strategic land holdings**

**About Gold Terra**

The Yellowknife Project (YP) encompasses 918 sq. km of contiguous land immediately north, south and east of the City of Yellowknife in the Northwest Territories. Through a series of acquisitions, Gold Terra controls one of the six major high-grade gold camps in Canada. Being within 10 kilometres of the City of Yellowknife, the YP is close to vital infrastructure, including all-season roads, air transportation, service providers, hydro-electric power, and skilled tradespeople. Gold Terra is currently focusing its drilling on the prolific Campbell Shear, where approximately 14 Moz of gold has been produced, (refer to [Gold Terra Oct 21, 2022, Technical Report](https://pr.report/2zj8)) and most recently on the Con Mine Option (CMO) property claims immediately south of the past producing Con Mine which produced 6.1 Moz between the Con, Rycon, and Campbell shear structures (1938-2003).

The YP and CMO properties lie on the prolific Yellowknife greenstone belt, covering nearly 70 kilometres of strike length along the main mineralized shear system that hosts the former-producing high-grade Con and Giant gold mines. The Company's exploration programs have successfully identified significant zones of gold mineralization and multiple targets that remain to be tested which reinforces the Company's objective of re-establishing Yellowknife as one of the premier gold mining districts in Canada.

Visit our website at [www.goldterracorp.com](https://pr.report/2zj9).

**For more information, please contact:**

Gerald Panneton, Chairman & CEO

[gpanneton@goldterracorp.com](mailto:gpanneton@goldterracorp.com)

**Gold Terra Announces a 2 Year Extension on Option Agreement with Newmont to November 21st, 2027 to purchase 100% of Past Producing 16 g/t Gold Con Mine, Yellowknife, NWT
Sep 9, 2024**

**VANCOUVER, BC / ACCESSWIRE / September 9, 2024 / Gold Terra Resource Corp. (TSX-V:YGT)(Frankfurt:TX0)(OTCQX:YGTFF)** ("Gold Terra" or the "Company") is pleased to announce it has extended its four (4) year definitive option agreement (the "Option Agreement") with Newmont Canada FN Holdings ULC ("Newmont FN") and Miramar Northern Mining Ltd. ("MNML"), both wholly owned subsidiaries of Newmont Corporation ("Newmont"), to a six (6) year agreement which grants Gold Terra the option, upon meeting certain minimum requirements, to purchase MNML from Newmont FN (the "Transaction"), which includes 100% of all the assets, mineral leases, Crown mineral claims, and surface rights comprising the Con Mine, as well as the areas immediately adjacent to the Con Mine, as shown in Exhibit A (the "Con Mine Property").

Gerald Panneton, Chairman & CEO of Gold Terra, commented, "*We are pleased with our continued excellent relationship with Newmont who is also a shareholder of the Company. The extension of the Option Agreement to acquire 100% of MNML's Con Mine allows us to continue with our current drilling program designed to delineate more than 1.5 Moz in all categories with high-grade ounces along the prolific Campbell Shear structure below and around the existing mine workings. Our accomplishments to date include:*

1. *Contained Indicated 109,000 ounces @ 7.55 g/t Au and Inferred 432,000 ounces @ 6.74 g/t Au near surface south of the Con Mine in the Yellorex area.* (refer to [Gold Terra Oct 21, 2022, Technical Report](https://pr.report/2d4v)).
2. *Total drilling of **31,947 metres** to the end of 2023.*
3. *Total spending of approximately C$10.9 million to the end of 2023*
4. *Current 2024 drilling of more than 3,000 metres testing the down plunge of the Campbell shear.*

The extended Option Agreement to six (6) years provides the Company more time to complete its evaluation before exercising its option to purchase 100% of MNML, the owner of the past-producing Con Mine, which produced more than 6.1 Moz (averaging 16 to 20 g/t Au) along the Campbell and Con Shear structures. Completion of the Option Agreement will consolidate the Company's strategic land position in the prolific Yellowknife Gold Belt (shown in **Figure 1** below) and provide potential future development optionality. The former Con Mine is a world-class gold deposit and part of the prolific Yellowknife mining camp. (refer to [Gold Terra Oct 21, 2022, Technical Report](https://pr.report/2d4w)).

!https://www.accesswire.com/imagelibrary/a006afb2-8f25-406d-ab75-27f6991829de/914326/goldterranr9924figure.png

**Figure 1: Con Mine Option Location**

**Option Agreement Highlights:**

- Execution of the 2021 Option Agreement to include all (100%) of MNML and the Con Mine Property ([November 22, 2021 press release](https://pr.report/2d4x)).
- The Option Agreement has now been extended whereby in order to retain the Earn-In Right and earn the Purchase Option, Gold Terra must, within six (6) years following the Effective Date complete the Earn-In specifications.
- Gold Terra has agreed to incur a minimum of C$8.0 million in exploration expenditures over a period of six (6) years, which will include all exploration expenditures incurred to date under the initial Exploration Agreement.
- Gold Terra has also agreed to:
    - Complete a Pre-Feasibility Study (PFS) of a mineral resource and a minimum of 1.5 Moz in all categories,
    - Obtain all necessary regulatory approvals for the purchase and transfer of MNML's assets and liabilities to Gold Terra,
    - Post a cash bond to reflect the status of the Con Mine reclamation plan at the time of closing.

The closing of the Transaction will then be completed with Gold Terra making a final cash payment of C$8,000,000.

Newmont will retain a 2% net smelter returns royalty (the "NSR") on minerals produced from the Con Mine Property. The NSR may be reduced by 50% by the Company paying Newmont the sum of C$10,000,000, for a period of two (2) years following the annoucement of commercial production.

After Gold Terra exercises its option, Newmont will have a period of two (2) years to exercise its one time back-in right of a 51% participating interest in MNML and the Con Mine Property, which can be triggered by Gold Terra delineating a minimum of five (5) million ounces of gold in the measured and indicated mineral resource categories supported by a National Instrument NI 43-101 technical report. If Newmont exercise its one time only back-in right, it will have to reimburse Gold Terra 3 times its exploration expenditure to that date, and also pay US$ 30 per once on 51% of all the ounces delineated in the latest 43-101 report

**Substantial Benefits To UNLOCK**

Upon exercise of the option, Gold Terra would have substantial benefit from owning 100% of the Con Mine Property including:

- Mineral leases and overlying surface rights.
- Access to infrastructure, including underground openings and shafts, buildings, storage facilities and roads. The hard assets include the original C -1 shaft opening, and the deep Robertson shaft (1,950 metres) with a 2,000 tpd (ton per day) capacity for future underground exploration and mining, valued for time and investment saving; surface infrastructure including a large 10,000 square foot warehouse and dry; surface vehicles; and a 2015 C$20 M water treatment plant . These assets provide substantial future cost savings for potential development.
- Access to explore and potentially redevelop the remaining historic mineral reserves within the Con Mine Property. The Con Mine was shut down in 2003 following multiple years of low gold prices. Historically, a total of 6.1 Moz of high-grade gold were recovered from the underground Con Mine operation. Remaining historic sub-economic reserves based on a US$370/oz gold price at the Con Mine as of January 1, 2003, are shown in the following table:
    
    !https://www.accesswire.com/imagelibrary/44d18faf-62c6-4097-86ee-567b91b7088b/914326/goldterranr9924table.png
    

**Table 1: Historic Reserves as of January 1, 2003*** (Source: Miramar Mining Corp Limited 2003)

- ***Note:** The Historic Reserves and Resources quoted above are historical in nature and are not NI 43-101 compliant. They were compiled and reported by MNML during its operation and closure of the Con Mine (2003). The historical estimates are historical in nature and should not be relied upon, however, they do give indications of mineralization on the property. The Qualified Person has not done sufficient work to classify them as current Mineral Resources or Mineral Reserves and Gold Terra is not treating the historical estimates as current Mineral Resources or Mineral Reserves. (See [Oct. 21, 2022 Technical Report](https://pr.report/2d4y))*

**Con Mine Option Property Deep Drilling Program**

The objective of the upcoming Phase 2 drilling program is to continue testing for high-grade gold in the **Campbell Shear** (**past production of 5.1 Moz @ 16 g/t,** refer to the [Oct. 21, 2022 Technical Report](https://pr.report/2d4z)) on the Con Mine below the historic Con Mine underground workingsfrom the recently completed master hole GTCM24-056. Hole GTCM24-056 was drilled to a depth of 3,002 metres and will serve as a master hole from which to branch off with as many wedges as possible to evaluate the Campbell Shear in a first phase of wedge drilling from 600 metres to 700 metres below the current Robertson shaft depth, up-dip and laterally. The branching-off wedge drilling strategy from the same master hole will allow for the evaluation of the Campbell Shear with shorter and lower cost holes.

The 2024 deep drilling program aims to expand the September 2022 initial Mineral Resource Estimate ("MRE") (see September 7, 2022, press release) of 109,000 Indicated ounces of contained gold and 432,000 Inferred ounces of contained gold between surface and 400 metres below surface along a 2-kilometre corridor of the Campbell Shear (**October 21, 2022 MRE** titled "**Initial Mineral Resource Estimate for the CMO Property, Yellowknife City Gold Project, Yellowknife, Northwest Territories, Canada**") by Qualified Person, Allan Armitage, Ph. D., P. Geo., SGS Geological Services, which can be found on the Company's website at[https://www.goldterracorp.com](https://pr.report/ySdnEPkC)and on SEDAR at [www.sedar.com](https://pr.report/UhFnmG6N).

The technical information contained in this news release has been reviewed and approved by Joseph Campbell, Chief Operating Officer, a Qualified Person as defined in National Instrument 43-101 - Standards of Disclosure for Mineral Projects.

Overall review of Gold Terra:

Gold Terra Resource Corp.: A Promising Investment Opportunity in the Yellowknife Gold Belt

Gold Terra Resource Corp. presents a compelling investment opportunity in the prolific Yellowknife gold belt, Northwest Territories, Canada. Our focus is on expanding known gold resources through strategic exploration, leveraging a strong track record, and a valuable geographic location.

**A Proven Exploration History:** Gold Terra's leadership, including Chairman and CEO Gerald Panneton, boasts extensive experience in the Canadian and international mining sector, with a demonstrable track record of success, particularly at Detour Gold. This experience suggests a capability to efficiently manage exploration projects to production stages. Our current team is well-positioned to navigate the complexities of the exploration process, and we're confident in our ability to generate significant returns for our investors. This expertise extends not just to exploration but to capital markets, further enhancing our ability to execute our plans.

**Strategic Location and Infrastructure:** Gold Terra's 918 square kilometers of contiguous land surrounding Yellowknife puts us close to critical infrastructure like all-season roads, air transportation, and hydroelectric power. This reduces development costs and operational challenges, making our projects more efficient and potentially faster to produce revenue. The proximity to existing mining communities and skilled labor also enhances our potential for rapid development. The significant 70-kilometer strike length of the Campbell Shear underlines the extensive mineralization potentially present on our holdings. This strategic positioning is a significant advantage.

**A Focus on the Campbell Shear and the Con Mine Option Property:** We're concentrating our efforts on the Campbell Shear, a prolific gold-bearing area with a history of production, and the Con Mine Option property, where we're actively exploring below the historic Con Mine workings. Initial 2022 drilling results on the Con Mine Option property produced a substantial Measured and Indicated mineral resource estimate of 109,000 ounces, and 432,000 ounces in inferred resources, providing a significant near-term target.

**Significant Potential for Further Discovery:** Our 2024 drilling program, focused on the down-plunge extension of the Campbell Shear below the Con Mine, aims to expand the existing mineral resource estimates and identify further high-grade gold deposits. The strategy involves a master hole with a branching-off wedge drilling technique to further test and quantify the gold deposits within the Campbell Shear.

**Commitment to ESG and Community Relations:** Gold Terra is committed to responsible environmental, social, and governance (ESG) standards. Our dedication to maintaining strong community relationships is a core value. We’re engaging with local communities and governments to build trust and ensure sustainable long-term development.

**Option Agreement with Newmont:** We have a 6-year option agreement with Newmont for the Con Mine Property. This agreement secures our access to valuable infrastructure and historically-significant reserves. We believe this option will deliver significant value in the future.

**Risks and Uncertainties:** Investing in exploration carries inherent risks, including fluctuations in commodity prices, geological uncertainties, permitting hurdles, and environmental factors. We acknowledge these risks and are continuously working to mitigate them. This includes rigorous due diligence, strategic planning, and the involvement of qualified personnel. Investors should carefully consider these risks before making any investment decision. Please note that mineral resources are not reserves, and there is no guarantee of economic viability.

**Investment Summary:** Gold Terra offers an attractive opportunity for investors seeking to capitalize on potential gold discoveries in a strategically located and accessible region. We believe our exploration focus, experienced leadership, and strategic alliances position us for significant future returns. We encourage you to consult with your financial advisors before making any investment decisions. This is not financial or investment advice. Contact us at [contact information] for further details.

Here is the Share Structure of Gold Terra:

# Share Structure

### April 19, 2024
Issued:	331,222,484 shares
Options:	
1,800,000	options at $0.30 per share to December 30, 2024
400,000	options at $0.30 per share to April 14, 2025
775,000	options at $0.435 per share to August 11, 2025
1,143,750	options at $0.35 per share to December 11, 2025
200,000	options at $0.35 per share to December 18, 2025
200,000	options at $0.26 per share to August 16, 2026
931,250	options at $0.26 per share to December 31, 2026
681,250	options at $0.24 per share to June 10, 2027
950,000	options at $0.20 per share to December 30, 2027
1,200,000	options at $0.10 per share to August 22, 2028
1,200,000	options at $0.10 per share to January 2, 2029
Fully Diluted:	340,703,734 shares
`,
    messages: coreMessages,
    tools: {
      //   getWeather: {
      //     description: "Get the current weather at a location",
      //     parameters: z.object({
      //       latitude: z.number().describe("Latitude coordinate"),
      //       longitude: z.number().describe("Longitude coordinate"),
      //     }),
      //     execute: async ({ latitude, longitude }) => {
      //       const response = await fetch(
      //         `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
      //       );
      //       const weatherData = await response.json();
      //       return weatherData;
      //     },
      //   },
      //   displayFlightStatus: {
      //     description: "Display the status of a flight",
      //     parameters: z.object({
      //       flightNumber: z.string().describe("Flight number"),
      //       date: z.string().describe("Date of the flight"),
      //     }),
      //     execute: async ({ flightNumber, date }) => {
      //       const flightStatus = await generateSampleFlightStatus({
      //         flightNumber,
      //         date,
      //       });
      //       return flightStatus;
      //     },
      //   },
      //   searchFlights: {
      //     description: "Search for flights based on the given parameters",
      //     parameters: z.object({
      //       origin: z.string().describe("Origin airport or city"),
      //       destination: z.string().describe("Destination airport or city"),
      //     }),
      //     execute: async ({ origin, destination }) => {
      //       const results = await generateSampleFlightSearchResults({
      //         origin,
      //         destination,
      //       });
      //       return results;
      //     },
      //   },
      //   selectSeats: {
      //     description: "Select seats for a flight",
      //     parameters: z.object({
      //       flightNumber: z.string().describe("Flight number"),
      //     }),
      //     execute: async ({ flightNumber }) => {
      //       const seats = await generateSampleSeatSelection({ flightNumber });
      //       return seats;
      //     },
      //   },
      //   createReservation: {
      //     description: "Display pending reservation details",
      //     parameters: z.object({
      //       seats: z.string().array().describe("Array of selected seat numbers"),
      //       flightNumber: z.string().describe("Flight number"),
      //       departure: z.object({
      //         cityName: z.string().describe("Name of the departure city"),
      //         airportCode: z.string().describe("Code of the departure airport"),
      //         timestamp: z.string().describe("ISO 8601 date of departure"),
      //         gate: z.string().describe("Departure gate"),
      //         terminal: z.string().describe("Departure terminal"),
      //       }),
      //       arrival: z.object({
      //         cityName: z.string().describe("Name of the arrival city"),
      //         airportCode: z.string().describe("Code of the arrival airport"),
      //         timestamp: z.string().describe("ISO 8601 date of arrival"),
      //         gate: z.string().describe("Arrival gate"),
      //         terminal: z.string().describe("Arrival terminal"),
      //       }),
      //       passengerName: z.string().describe("Name of the passenger"),
      //     }),
      //     execute: async (props) => {
      //       const { totalPriceInUSD } = await generateReservationPrice(props);
      //       const session = await auth();
      //       const id = generateUUID();
      //       if (session && session.user && session.user.id) {
      //         await createReservation({
      //           id,
      //           userId: session.user.id,
      //           details: { ...props, totalPriceInUSD },
      //         });
      //         return { id, ...props, totalPriceInUSD };
      //       } else {
      //         return {
      //           error: "User is not signed in to perform this action!",
      //         };
      //       }
      //     },
      //   },
      //   authorizePayment: {
      //     description:
      //       "User will enter credentials to authorize payment, wait for user to repond when they are done",
      //     parameters: z.object({
      //       reservationId: z
      //         .string()
      //         .describe("Unique identifier for the reservation"),
      //     }),
      //     execute: async ({ reservationId }) => {
      //       return { reservationId };
      //     },
      //   },
      //   verifyPayment: {
      //     description: "Verify payment status",
      //     parameters: z.object({
      //       reservationId: z
      //         .string()
      //         .describe("Unique identifier for the reservation"),
      //     }),
      //     execute: async ({ reservationId }) => {
      //       const reservation = await getReservationById({ id: reservationId });
      //       if (reservation.hasCompletedPayment) {
      //         return { hasCompletedPayment: true };
      //       } else {
      //         return { hasCompletedPayment: false };
      //       }
      //     },
      //   },
      //   displayBoardingPass: {
      //     description: "Display a boarding pass",
      //     parameters: z.object({
      //       reservationId: z
      //         .string()
      //         .describe("Unique identifier for the reservation"),
      //       passengerName: z
      //         .string()
      //         .describe("Name of the passenger, in title case"),
      //       flightNumber: z.string().describe("Flight number"),
      //       seat: z.string().describe("Seat number"),
      //       departure: z.object({
      //         cityName: z.string().describe("Name of the departure city"),
      //         airportCode: z.string().describe("Code of the departure airport"),
      //         airportName: z.string().describe("Name of the departure airport"),
      //         timestamp: z.string().describe("ISO 8601 date of departure"),
      //         terminal: z.string().describe("Departure terminal"),
      //         gate: z.string().describe("Departure gate"),
      //       }),
      //       arrival: z.object({
      //         cityName: z.string().describe("Name of the arrival city"),
      //         airportCode: z.string().describe("Code of the arrival airport"),
      //         airportName: z.string().describe("Name of the arrival airport"),
      //         timestamp: z.string().describe("ISO 8601 date of arrival"),
      //         terminal: z.string().describe("Arrival terminal"),
      //         gate: z.string().describe("Arrival gate"),
      //       }),
      //     }),
      //     execute: async (boardingPass) => {
      //       return boardingPass;
      //     },
      //   },
      // },
      // onFinish: async ({ responseMessages }) => {
      //   if (session.user && session.user.id) {
      //     try {
      //       await saveChat({
      //         id,
      //         messages: [...coreMessages, ...responseMessages],
      //         userId: session.user.id,
      //       });
      //     } catch (error) {
      //       console.error("Failed to save chat");
      //     }
      //   }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}

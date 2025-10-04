const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};


 export const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });


  


//  export const chatSession = model.startChat({
//     generationConfig,
//     history: [
//       {
//         role: "user",
//         parts: [
//           {text: "const PROMPT=\"for question:\"+selectedText+\"and with the given content please give the appropriate answer in html formt.Answer content is:\"+allunfomattedAns;\n"},
//         ],
//       },
//       {
//         role: "model",
//         parts: [
         
//         ],
//       },
//     ],
//   });

  // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  // console.log(result.response.text());



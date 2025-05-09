import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyC8A0JvM7kbnFfRHpoKXxdBWK1H4IWrKaI";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-pro",
});

let messages = {
    history: [
      {
        role: "user",
        parts: [{ text: "Who are the creators of this website?" }]
      },
      {
        role: "model",
        parts: [{ text:
          `Justin Jones: Computer Science major at the University of Dayton. Link: https://hyouka.xyz/
  Tyler Tackett: Computer Science major at the University of Dayton. Link: http://cps449-tackettt2.eastus.cloudapp.azure.com/homepage.html
  John Tran: Computer Science Major at the International University - Vietnam National University. Link: https://github.com/Khanhhungtran23
  Jane Nguyen: Computer Science Major at the International University - Vietnam National University.
  Luke Pham: Computer Engineer Major at the International University - Vietnam National University.` }]
      },
      {
        role: "user",
        parts: [{
          text: "You are a movie recommendation assistant. When users ask for a suggestion, respond with 2–3 movies, each with a 1–2 sentence reason why it fits. Be clear, concise, and focused on relevance to the user's input."
        }]
      },
      {
        role: "model",
        parts: [{
          text: "Understood. I will provide concise movie recommendations tailored to the user's request, with brief explanations for each."
        }]
      }
    ]
  };

let isFirstMessage = true;

async function sendMessage() {

    console.log(messages);
    const userMessage = document.querySelector(".chat-window input").value;
    
    if (userMessage.length) {

        try {
            document.querySelector(".chat-window input").value = "";
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="user">
                    <p>${userMessage}</p>
                </div>
            `);

            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="loader"></div>
            `);

            if (!model) {
                console.error("Model not initialized.");
                return;
            }
            const chat = model.startChat(messages);

            let result = await chat.sendMessageStream(userMessage);
            
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="model">
                    <p></p>
                </div>
            `);
            
            let modelMessages = '';

            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              modelMessages = document.querySelectorAll(".chat-window .chat div.model");
              modelMessages[modelMessages.length - 1].querySelector("p").insertAdjacentHTML("beforeend",`
                ${chunkText}
            `);
            }

            messages.history.push({
                role: "user",
                parts: [{ text: userMessage }],
            });

            messages.history.push({
                role: "model",
                parts: [{ text: modelMessages[modelMessages.length - 1].querySelector("p").innerHTML }],
            });

        } catch (error) {
            console.error("Error sending message:", error);
            document.querySelector(".chat-window .chat").insertAdjacentHTML("beforeend",`
                <div class="error">
                    <p>The message could not be sent. Please try again.</p>
                </div>
            `);
        }

        document.querySelector(".chat-window .chat .loader").remove();
        
        if (isFirstMessage) {
            document.querySelector(".input-area").classList.add("bottom");
            isFirstMessage = false;
        }
    }
}

document.querySelector(".chat-window .input-area button")
.addEventListener("click", ()=>sendMessage());

document.querySelector(".chat-button")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.add("chat-open");
    $("#chatbot-open-main").show();
    $("#chatbot-closed-main").hide();
});

document.querySelector(".chat-window button.close")
.addEventListener("click", ()=>{
    document.querySelector("body").classList.remove("chat-open");
    $("#chatbot-open-main").hide();
    $("#chatbot-closed-main").show();
});

document.querySelector(".chat-window .input-area input")
    .addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
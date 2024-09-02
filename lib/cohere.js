// Define the API endpoint and API key
const url = "https://api.cohere.com/v1/chat";
const apiKey = "L43m79WwnztkJKWZnv2QGYAQkTX4Zou5lWKXInm4";

const question = "beautiful";
const keyword = `Từ ${question} thuộc loại nào trong 8 loại tính từ này (opinion,size,shape,condition,age,color,pattern,origin,material,purpose). Chỉ cần trả ra nó là loại tính từ nào, không cần nói thêm bất cứ gì nữa!`;

// Define the request payload
const payload = {
  // chat_history: [
  //   {
  //     role: "USER",
  //     message: "Who discovered gravity?"
  //   },
  //   {
  //     role: "CHATBOT",
  //     message: "The man who is widely credited with discovering gravity is Sir Isaac Newton"
  //   }
  // ],
  message: keyword,
  connectors: [
    {
      id: "web-search",
    },
  ],
};

// Make the request using fetch
fetch(url, {
  method: "POST",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify(payload),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data?.text);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

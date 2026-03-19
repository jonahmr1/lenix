mod send;

#[tokio::main]
async fn main() {
  // trigger the dotenvy's function to load tthe key
  dotenvy::dotenv().ok();
  // get the key from the environment
  let api_key = std::env::var("GROQ_API_KEY").unwrap();
  println!("Hello, Lenix!, You API Key is: {}", api_key);
  
  let body = send::send_message(&api_key).await;
  println!("{}", body["choices"][0]["message"]["content"]);
}

/*
  🏆 Best overall / most intelligent - openai/gpt-oss-120b
  ⚡ Best for speed (chatbots, real-time apps) - llama-3.1-8b-instant
  🧠 Best for reasoning / hard problems - qwen/qwen3-32b
  🌐 Best for long documents = moonshotai/kimi-k2-instruct-0905
  🔧 Best for tool use / function calling - llama-3.3-70b-versatile
  🔍 Best with built-in web search - groq-compound
*/

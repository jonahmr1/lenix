use std::io::{self, Write};
mod chatbot;

#[tokio::main]
async fn main() {
  // trigger the dotenvy's function to load tthe key
  dotenvy::dotenv().ok();
  // get the key from the environment
  let api_key = std::env::var("API_KEY").unwrap();
  println!("Hello, Lenix!, Welcome to Intellenix, Your API Key is: {}", api_key);

  loop {
    print!("You: ");
    io::stdout().flush().unwrap();

    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let input = input.trim();

    if input == "exit" { break }

    let response = chatbot::send_message(&api_key, input).await;
    if response.get("error").is_some() {
      println!("Code: {}", response["error"]["code"]);
      println!("Message: {}", response["error"]["message"]);
      println!("Type: {}", response["error"]["type"]);
      break;
    }
    let content = &response["choices"][0]["message"]["content"].as_str().unwrap();

    let texts = content.split("\n");
    
    for text in texts {
      println!("Intellenix: {}", text);
    }
  }
}

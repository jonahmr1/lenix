pub async fn send_message(api_key: &str, input: &str) -> serde_json::Value {
  // create a client for a new request
  let client = reqwest::Client::new();

  let response = client
    // making a http post request
    .post("https://api.groq.com/openai/v1/chat/completions")
    // passing the http headers
    .header("Authorization", format!("Bearer {}", api_key))
    .header("Content-Type", "application/json")
    // stringify the body
    .json(&serde_json::json!({
      "model": "llama-3.1-8b-instant",
      "messages": [
        {
          "role": "user",
          "content": input
        }
      ]
    }))
    // send the request
    .send()
    // wait for the response
    .await
    // unwrap the response
    .unwrap();

  // parse the response
  response.json::<serde_json::Value>().await.unwrap()
}
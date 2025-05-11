use crate::models::Request;
use reqwest::Client;
use serde_json::Value;
use std::collections::HashMap;

#[derive(Debug, serde::Serialize)]
pub struct HttpRequestResult {
    pub status: u16,
    pub headers: HashMap<String, String>,
    pub body: Value,
}

pub async fn execute_request(req: &Request) -> Result<HttpRequestResult, reqwest::Error> {
    let client = Client::new();

    let mut request_builder = client.request(req.method.parse().unwrap(), &req.url);

    // Set headers
    if let Value::Object(map) = &req.headers {
        for (key, value) in map {
            if let Some(val) = value.as_str() {
                request_builder = request_builder.header(key, val);
            } else {
                eprintln!("Header value for '{}' is not a string: {:?}", key, value);
            }
        }
    }

    // Set query parameters
    if let Some(params_json) = req.params.as_ref() {
        if let Some(map) = params_json.as_object() {
            request_builder = request_builder.query(&map);
        }
    }

    // Set body
    if let Some(body_json) = req.body.as_ref() {
        request_builder = request_builder.json(body_json);
    }

    let response = request_builder.send().await?;
    let status = response.status().as_u16();
    let headers = response
        .headers()
        .iter()
        .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
        .collect();

    let body = response
        .json::<Value>()
        .await
        .unwrap_or_else(|_| serde_json::json!({ "raw_body": "Unable to parse JSON body" }));

    Ok(HttpRequestResult {
        status,
        headers,
        body,
    })
}

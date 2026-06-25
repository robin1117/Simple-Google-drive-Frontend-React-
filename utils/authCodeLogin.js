export async function sendingAuthCode(code) {
  let response = await fetch("http://localhost:5000/auth/auth-code", {
    method: "post",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(code),
  });

  return await response.json();
}

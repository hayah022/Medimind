async function register() {
  await fetch("/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });
  alert("Registered");
}

async function login() {
  const res = await fetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });

  const data = await res.json();
  if (data.success) window.location = "dashboard.html";
  else alert("Wrong login");
}

async function addMed() {
  await fetch("/add-med", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name: name.value,
      dosage: dose.value
    })
  });
  alert("Added");
}

async function getInfo() {
  const res = await fetch("/ai-info", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name: name.value,
      dosage: dose.value
    })
  });

  const data = await res.json();
  info.innerText = data.result;
}

async function send() {
  const res = await fetch("/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message: msg.value })
  });

  const data = await res.json();
  chat.innerHTML += `<p>You: ${msg.value}</p><p>AI: ${data.reply}</p>`;
}
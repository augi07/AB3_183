document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("login");
  const bruteForceButton = document.getElementById("bruteForce");
  const resultText = document.getElementById("result");
  const postsContainer = document.getElementById("posts");

  const login = async (username, password) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.text();
    resultText.insertAdjacentHTML("afterbegin", result);
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const posts = await response.json();

      // Posts im Frontend darstellen
      postsContainer.innerHTML = ""; // Container leeren
      posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post", "p-4", "mb-4", "bg-slate-500", "rounded");

        postElement.innerHTML = `
          <h2 class="text-xl font-bold">${post.title}</h2>
          <p>${post.content}</p>
        `;

        postsContainer.appendChild(postElement);
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      postsContainer.innerHTML = "<p class='text-red-500'>Error loading posts. Please try again later.</p>";
    }
  };

  loginButton.addEventListener("click", async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    await login(username, password);
    await fetchPosts(); // Rufe die Posts ab, nachdem der Login erfolgt ist
  });

  bruteForceButton.addEventListener("click", async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    while (true) {
      await login(username, password);
    }
  });
});

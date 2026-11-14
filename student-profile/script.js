/* ===================== Feature 2 & 4: Projects data + localStorage ===================== */
const defaultProjects = [
  { title: "Student Portfolio", description: "Responsive Bootstrap website." },
  { title: "Cinema Ticket System", description: "Java OOP semester project." },
  { title: "Database Project", description: "SQL Server database project." }
];

let projects = loadProjects();

function loadProjects() {
  try {
    const saved = localStorage.getItem("projects");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn("Could not read saved projects:", err);
  }
  return defaultProjects.slice();
}

function saveProjects() {
  try {
    localStorage.setItem("projects", JSON.stringify(projects));
  } catch (err) {
    console.warn("Could not save projects:", err);
  }
}

/* ===================== Feature 2 & 3: render + search ===================== */
const projectList = document.getElementById("projectList");
const searchBox = document.getElementById("searchBox");
const projectCount = document.getElementById("projectCount");
const noProjects = document.getElementById("noProjects");
const projectMsg = document.getElementById("projectMsg");

function render() {
  projectList.innerHTML = "";
  const term = searchBox.value.trim().toLowerCase();
  let shown = 0;

  projects.forEach(function (project, index) {
    if (!project.title.toLowerCase().includes(term)) return;
    shown++;

    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6 mb-4";

    const card = document.createElement("div");
    card.className = "card project-card h-100";

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h5");
    title.textContent = project.title;

    const desc = document.createElement("p");
    desc.textContent = project.description;

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn btn-danger btn-sm";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", function () {
      deleteProject(index);
    });

    body.append(title, desc, delBtn);
    card.appendChild(body);
    col.appendChild(card);
    projectList.appendChild(col);
  });

  projectCount.textContent = "Showing " + shown + " of " + projects.length + " projects";
  noProjects.classList.toggle("d-none", shown !== 0);
}

function deleteProject(index) {
  projects.splice(index, 1);
  saveProjects();
  render();
}

document.getElementById("addProjectBtn").addEventListener("click", function () {
  const titleInput = document.getElementById("projectTitle");
  const descInput = document.getElementById("projectDesc");
  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (title === "" || description === "") {
    projectMsg.textContent = "Please enter both a title and a description.";
    return;
  }

  projects.push({ title: title, description: description });
  saveProjects();
  projectMsg.textContent = "";
  titleInput.value = "";
  descInput.value = "";
  render();
});

searchBox.addEventListener("input", render);

/* ===================== Feature 1: Contact form validation ===================== */
const nameRegex = /^[A-Za-z ]{3,30}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^03\d{2}-\d{7}$/;

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const nameVal = document.getElementById("fullName").value.trim();
  const emailVal = document.getElementById("email").value.trim();
  const mobileVal = document.getElementById("mobile").value.trim();
  const messageVal = document.getElementById("message").value.trim();

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const mobileError = document.getElementById("mobileError");
  const messageError = document.getElementById("messageError");
  const success = document.getElementById("formSuccess");

  // clear old messages
  nameError.textContent = "";
  emailError.textContent = "";
  mobileError.textContent = "";
  messageError.textContent = "";
  success.textContent = "";

  let valid = true;

  if (!nameRegex.test(nameVal)) {
    nameError.textContent = "Name must be 3 to 30 letters and spaces only.";
    valid = false;
  }
  if (!emailRegex.test(emailVal)) {
    emailError.textContent = "Enter a valid email, e.g. ali@iiu.edu.pk";
    valid = false;
  }
  if (!mobileRegex.test(mobileVal)) {
    mobileError.textContent = "Enter a mobile number like 0300-1234567.";
    valid = false;
  }
  if (messageVal === "") {
    messageError.textContent = "Message cannot be empty.";
    valid = false;
  }

  if (valid) {
    success.textContent = "Thank you, " + nameVal + "! Your message has been sent successfully.";
    contactForm.reset();
  }
});

/* ===================== Feature 5: Latest Posts from API ===================== */
async function loadPosts() {
  const status = document.getElementById("postsStatus");
  const list = document.getElementById("postsList");
  status.textContent = "Loading posts...";
  status.classList.remove("error-text");

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=6");
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    const posts = await response.json();

    status.textContent = ""; // remove "Loading posts..."

    posts.forEach(function (post) {
      const col = document.createElement("div");
      col.className = "col-lg-4 col-md-6 mb-4";

      const card = document.createElement("div");
      card.className = "card project-card h-100";

      const body = document.createElement("div");
      body.className = "card-body";

      const title = document.createElement("h5");
      title.textContent = post.title;

      const text = document.createElement("p");
      text.textContent = post.body;

      body.append(title, text);
      card.appendChild(body);
      col.appendChild(card);
      list.appendChild(col);
    });
  } catch (err) {
    console.error(err);
    status.textContent = "Could not load the posts. Please try again later.";
    status.classList.add("error-text");
  }
}

/* ===================== Start ===================== */
render();
loadPosts();
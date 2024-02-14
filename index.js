/* eslint-disable no-console */
const body = document.querySelector("body");
const scheme = document.getElementById("scheme");
const nextBlog = document.getElementById("next-blog");
const pageTitle = document.getElementById("title");
const main = document.querySelector("main");
const selectSemester = document.querySelector(".select");
const selectedSemesterValue = +selectSemester.value || 1;
// variable meant to check if blog sliding is occuring
let isTransitioning = true;

// 9 2 a
// 9 2 c
// 9 3 c
// 9 4 s
// 10 1 a
// 10 1 c
// 10 1 s
// 10 2 c
// 10 2 s
// 10 3 c

const fileNames = [
  "./blogs/9-2-c.json",
  "./blogs/9-2-a.json",
  "./blogs/9-3-c.json",
  "./blogs/9-3-s.json",
  "./blogs/9-4-s.json",
  "./blogs/10-1-a.json",
  "./blogs/10-1-c.json",
  "./blogs/10-1-s.json",
  "./blogs/10-2-c.json",
  "./blogs/10-2-s.json",
  "./blogs/10-3-c.json",
];

const clear = (element) => {
  while (element.lastChild) {
    element.lastChild.remove();
  }
};

// if preferred color scheme is dark (light scheme is enabled by defaul via css)
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  body.classList.add("dark-scheme");
  scheme.classList.add("dark-scheme");
  nextBlog.classList.add("dark-scheme");
  selectSemester.firstElementChild.classList.add("dark-scheme");
}
scheme.addEventListener("click", () => {
  body.classList.toggle("dark-scheme");
  scheme.classList.toggle("dark-scheme");
  nextBlog.classList.toggle("dark-scheme");
  selectSemester.firstElementChild.classList.toggle("dark-scheme");
});

const slideIn = (container) => {
  main.appendChild(container);
  setTimeout(() => {
    container.classList.add("center");
    // scroll to top
    window.scrollTo(0, 0);
  }, 1);
};

const createBlogPost = (post) => {
  const blogContainer = document.createElement("div");
  blogContainer.setAttribute("id", "blog-container");
  blogContainer.dataset.id = post.id;
  blogContainer.innerHTML = `
  <h2 id="blog-title">${post.title}</h2>
  <div id="blog-details">
  <p class="activity blog">${post.activity}</p>
  <p class="date blog">${post.date}</p>
  </div>
  <div id="blog-content-container">
  <img id="blog-image" src=${post.image}></img>
  <p id="blog-content">${post.content}</p>
  </div>
  </div>
  </div>
  `;
  return blogContainer;
};

const loadBlogPost = (post, requestedFrom) => {
  const nextContainer = createBlogPost(post);
  console.log("loading blog post...");
  nextBlog.classList.add("active");
  isTransitioning = true;
  if (requestedFrom === "nextBlog") {
    console.log(isTransitioning);
    const previousContainer = document.querySelector("#blog-container");
    previousContainer.classList.add("move-left");
    slideIn(nextContainer);

    previousContainer.addEventListener("transitionend", () => {
      main.removeChild(previousContainer);
    });
    nextContainer.addEventListener("transitionend", () => {
      isTransitioning = false;
      // eslint-disable-next-line no-useless-return
    });
    // failsafe in case user clicks nextBlog btn too fast
  } else {
    clear(main);
    slideIn(nextContainer);
    isTransitioning = false;
  }
};

// requestedFrom tells the function if the load request came from the landing page or nextBlog btn
const fetchBlogPost = (id, requestedFrom = "landingPage") => {
  selectSemester.classList.remove("active");

  if (fileNames[id] === undefined) {
    console.log("undefined");
    // eslint-disable-next-line no-param-reassign
    id = 0;
    if (requestedFrom === "landingPage") return;
  }

  fetch(fileNames[id])
    .then((response) => response.json())
    .then((result) => loadBlogPost(result, requestedFrom));
  console.log(id);
};

const initializeLandingPage = () => {
  main.innerHTML = `<div id="landingpage-container" onwheel="handleWheel(event)">
  <div class="container"></div>
  </div>`;
  selectSemester.classList.add("active");
};

const appendLangingPost = (post, container) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");
  wrapper.classList.add(`${post.type}`);
  container.classList.add(`${post.type}`);
  wrapper.dataset.id = `${post.id}`;
  wrapper.dataset.type = post.type;
  wrapper.addEventListener("click", () => fetchBlogPost(+wrapper.dataset.id));

  if (post.type === "big") {
    wrapper.innerHTML = `
    <h2 class="blog-header">${post.title}</h2>
    <div class="blog-header-image-container">
    <img class="blog-header-image" src=${post.image}></img>
    </div>
    <div class="blog-subheader-container">
    <p class="blog-subheader">${post.content}</p>
    </div>
    <div class="details">
    <p class="activity">${post.activity}</p>
    <p class="date">${post.date}</p>
    </div>`;
  } else {
    wrapper.innerHTML = `
    <h2 class="blog-header">${post.title}</h2>
    <div class="blog-header-image-container">
    <p class="blog-subheader">${post.content}</p>
    </div>
    <div class="details">
    <p class="activity">${post.activity}</p>
    <p class="date">${post.date}</p>
    </div>`;
  }
  container.appendChild(wrapper);
};

const createLandingPage = (post) => {
  const landingPage = document.getElementById("landingpage-container");
  const lastChild = landingPage.lastElementChild;
  // if container has no children
  if (!lastChild.hasChildNodes()) {
    appendLangingPost(post, lastChild);
  }
  // check if only child has a type small and
  else if (lastChild.firstElementChild.dataset.type === "small" && post.type === "small") {
    appendLangingPost(post, lastChild);
    const newContainer = document.createElement("div");
    newContainer.classList.add("container");
    landingPage.appendChild(newContainer);
  }
  // if container has >2 children or an only child with type "big" or
  else {
    const newContainer = document.createElement("div");
    newContainer.classList.add("container");
    landingPage.appendChild(newContainer);
    appendLangingPost(post, newContainer);
  }
};

// Dynamic sizing functionality
const generateRandomHeight = (floor, ceiling, maxHeight) => {
  const min = floor * maxHeight;
  const max = ceiling * maxHeight;
  const randomHeight = Math.random() * (max - min) + min;
  return randomHeight;
};

const loadDynamicHeight = () => {
  const containers = document.querySelectorAll(".container");
  if (containers.length === 0 || containers[0].children.length === 0) return;
  containers.forEach((container) => {
    const maxHeight = container.clientHeight;
    if (container.children.length > 1) {
      const children = container.childNodes;
      const randomHeight = generateRandomHeight(0.35, 0.65, maxHeight);
      children[0].style.height = `${randomHeight}px`;
      // allocate remaining space to the second child
      children[1].style.height = `${maxHeight - randomHeight}px`;
    } else {
      const onlyChild = container.firstElementChild;
      const randomHeight = generateRandomHeight(0.8, 1, maxHeight);
      onlyChild.style.height = `${randomHeight}px`;
    }
  });
};

const removeBlogParameter = (param) => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  params.delete(param);
  url.search = params.toString();
  window.history.replaceState({}, document.title, url.href);
};

const loadLangingPage = (passedSemesterValue) => {
  let semesterValue = passedSemesterValue;
  isTransitioning = false;
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("blog")) {
    const id = urlParams.get("blog");
    if (fileNames[id] !== undefined) {
      fetchBlogPost(id, "landingPage");
      removeBlogParameter("blog");
      return;
    }
  }
  if (urlParams.has("semester")) {
    semesterValue = +urlParams.get("semester");
    selectSemester.firstElementChild.value = semesterValue;
    removeBlogParameter("semester");
  } else {
    selectSemester.firstElementChild.value = semesterValue;
  }
  initializeLandingPage();
  nextBlog.classList.remove("active");
  // wrap all filenames into a promise array
  Promise.all(
    fileNames.map((fileName) =>
      fetch(fileName)
        .then((response) => response.json())
        .then((result) => (result?.semester === semesterValue ? createLandingPage(result) : null)),
    ),
  )
    .then(() => {
      console.log("All post displayed!");
      loadDynamicHeight();
    })
    .catch((error) => {
      console.log("Error occured while loading posts: ", error);
    });
};

pageTitle.addEventListener("click", () => {
  loadLangingPage(selectedSemesterValue);
});

document.addEventListener("DOMContentLoaded", () => loadLangingPage(selectedSemesterValue));

// event listeners
// create functioning "next blog" button
const handleNextBlogClick = () => {
  if (!isTransitioning) {
    const currentId = document.querySelector("#blog-container").dataset.id;
    fetchBlogPost(+currentId + 1, "nextBlog");
  }
};

nextBlog.addEventListener("click", handleNextBlogClick);

const handleSemesterChange = () => {
  const semesterValue = +selectSemester.firstElementChild.value;
  loadLangingPage(semesterValue);
};

selectSemester.addEventListener("change", handleSemesterChange);

const body = document.querySelector("body");
const scheme = document.getElementById("scheme");
const nextBlog = document.getElementById("next-blog");
const pageTitle = document.getElementById("title");
// variable meant to check if blog sliding is occuring
let isTransitioning = true;
const fileNames = [
  "./test-jsons/ate.json",
  "./test-jsons/labas.json",
  "./test-jsons/big.json",
];

// if preferred color scheme is dark (light scheme is enabled by defaul via css)
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  body.classList.add("dark-scheme");
  scheme.classList.add("dark-scheme");
  nextBlog.classList.add("dark-scheme");
}
scheme.addEventListener("click", () => {
  body.classList.toggle("dark-scheme");
  scheme.classList.toggle("dark-scheme");
  nextBlog.classList.toggle("dark-scheme");
});

const slideIn = (container) => {
  main.appendChild(container);
  setTimeout(() => {
    container.classList.add("center");
    // scroll to top
    window.scrollTo(0, 0);
  }, 1);
};

loadBlogPost = (post, requestedFrom) => {
  const nextContainer = createBlogPost(post);
  nextBlog.classList.add("active");
  isTransitioning=true;
  if (requestedFrom == "nextBlog") {
    const previousContainer = document.querySelector("#blog-container");
    previousContainer.classList.add("move-left");
    slideIn(nextContainer);

    previousContainer.addEventListener("transitionend", () => {
      main.removeChild(previousContainer);
    });
  } else {
    clear(main);
    slideIn(nextContainer);
  }
  nextContainer.addEventListener("transitionend", () => {
    isTransitioning = false;
  });
  return;
};

createBlogPost = (post) => {
  const blogContainer = document.createElement("div");
  blogContainer.setAttribute("id", "blog-container");
  blogContainer.dataset.id = post.id;
  blogContainer.innerHTML = `
  <h2 id="blog-title">${post.title}</h2>
  <div id="blog-details">
  <p class="activity">${post.activity}</p>
  <p class="date">${post.date}</p>
  </div>
  <div id="blog-content-container">
  <p id="blog-content">${post.content}</p>
  </div>
  </div>
  </div>
  `;
  return blogContainer;
};

// requestedFrom tells the function if the load request came from the landing page or nextBlog btn
const fetchBlogPost = (id, requestedFrom = "landingPage") => {
  if (fileNames[id] == undefined) {
    console.log("undefined");
    id = 0;
    if (requestedFrom == "landingPage") return;
  }

  fetch(fileNames[id])
    .then((response) => response.json())
    .then((result) => loadBlogPost(result, requestedFrom));
  console.log(id);
};

// create functioning "next blog" button
nextBlog.addEventListener("click", () => {
  if (!isTransitioning) {
    const currentId = document.querySelector("#blog-container").dataset.id;
    fetchBlogPost(+currentId + 1, "nextBlog");
  }
});

const main = document.querySelector("main");
const initializeLandingPage = () => {
  main.innerHTML = `<div id="landingpage-container">
  <div class="container"></div>
  </div>`;
};
const clear = (element) => {
  while (element.lastChild) {
    element.lastChild.remove();
  }
};

const appendLangingPost = (post, container) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add(`wrapper`);
  wrapper.classList.add(`${post.type}`);
  wrapper.dataset.id = `${post.id}`;
  wrapper.dataset.type = post.type;
  wrapper.addEventListener("click", () => fetchBlogPost(+wrapper.dataset.id));
  wrapper.innerHTML = `
  <h2 class="blog-header">${post.title}</h2>
  <p class="blog-subheader">${post.content}</p>
  <div class="details">
  <p class="activity">${post.activity}</p>
  <p class="date">${post.date}</p>
  </div>`;
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
  else if (
    lastChild.firstElementChild.dataset.type == "small" &&
    post.type == "small"
  ) {
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

//Dynamic sizing functionality
const generateRandomHeight = (floor, ceiling, maxHeight) => {
  const min = floor * maxHeight;
  const max = ceiling * maxHeight;
  const randomHeight = Math.random() * (max - min) + min;
  return randomHeight;
};

const loadDynamicHeight = () => {
  const containers = document.querySelectorAll(".container");
  containers.forEach((container) => {
    const maxHeight = container.clientHeight;
    if (container.children.length > 1) {
      const children = container.childNodes;
      const randomHeight = generateRandomHeight(0.4, 0.6, maxHeight);
      children[0].style.height = `${randomHeight}px`;
      // allocate remaining space to the second child
      children[1].style.height = `${maxHeight - randomHeight}px`;
    } else {
      const onlyChild = container.firstElementChild;
      const randomHeight = generateRandomHeight(0.7, 0.9, maxHeight);
      onlyChild.style.height = `${randomHeight}px`;
    }
  });
};

const loadLangingPage = () => {
  initializeLandingPage();
  nextBlog.classList.remove("active");
  // wrap all filenames into a promise array
  Promise.all(
    fileNames.map((fileName) =>
      fetch(fileName)
        .then((response) => response.json())
        .then((result) => createLandingPage(result))
    )
  )
    .then(() => {
      console.log("All post displayed!");
      loadDynamicHeight();
    })
    .catch((error) => {
      console.log("Error occured while loading posts: ", error);
    });
};
loadLangingPage();
title.addEventListener("click", () => {
  loadLangingPage();
});

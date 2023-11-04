//color scheme functionality
const body = document.querySelector("body");
const scheme = document.getElementById("scheme");
// if preferred color scheme is dark (light scheme is enabled by defaul via css)
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  body.classList.add("dark-scheme");
  scheme.classList.add("dark-scheme");
}
scheme.addEventListener("click", () => {
  body.classList.toggle("dark-scheme");
  scheme.classList.toggle("dark-scheme");
});
//Dynamic sizing functionality
const main = document.querySelector("main");
const initializeLandingPage = () => {
  main.innerHTML = 
  `<div id="landingpage-container">
  <div class="container"></div>
  </div>`;
};
const clear = (element) => {
  while (element.lastChild) {
    element.lastChild.remove();
  }
};
const loadBlogPost = (wrapper) => {
  clear(main);
  const title = wrapper.children[0].innerText;
  const content = wrapper.children[1].innerText;
  const activityType = wrapper.children[2].children[0].innerText;
  const date = wrapper.children[2].children[1].innerText;

  main.innerHTML = `
  <div id="blog-container">
  <h2 id="blog-title">${title}</h2>
  <div id="blog-details">
  <p class="activity">${activityType}</p>
  <p class="date">${date}</p>
  </div>
  <div id="blog-content-container">
  <p id="blog-content">${content}</p>
  </div>
  </div>
  </div>
  `;
};

const appendPost = (post, container) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add(`wrapper`);
  wrapper.classList.add(`${post.type}`);
  wrapper.addEventListener("click", () => loadBlogPost(wrapper));
  wrapper.dataset.type = post.type;
  wrapper.innerHTML = `
  <h2 class="header">${post.title}</h2>
  <p class="subheader">${post.content}</p>
  <div class="details">
  <p class="activity">${post.activity}</p>
  <p class="date">${post.date}</p>
  </div>`;
  container.appendChild(wrapper);
};

const createHeadline = (post) => {
  const landingPage = document.getElementById("landingpage-container");
  const lastChild = landingPage.lastElementChild;
  // if container has no children
  if (!lastChild.hasChildNodes()) {
    appendPost(post, lastChild);
  }
  // check if only child has a type small and
  else if (
    lastChild.firstElementChild.dataset.type == "small" &&
    post.type == "small"
  ) {
    appendPost(post, lastChild);
    const newContainer = document.createElement("div");
    newContainer.classList.add("container");
    landingPage.appendChild(newContainer);
  }
  // if container has >2 children or an only child with type "big" or
  else {
    const newContainer = document.createElement("div");
    newContainer.classList.add("container");
    landingPage.appendChild(newContainer);
    appendPost(post, newContainer);
  }
};

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

const fileNames = ["./ate.json", "./labas.json", "./big.json"];
initializeLandingPage();
// wrap all filenames into a promise array
Promise.all(
  fileNames.map((fileName) =>
    fetch(fileName)
      .then((response) => response.json())
      .then((result) => createHeadline(result))
  )
)
  .then(() => {
    console.log("All post displayed!");
    loadDynamicHeight();
  })
  .catch((error) => {
    console.log("Error occured while loading posts: ", error);
  });

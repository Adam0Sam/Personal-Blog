//color scheme functionality
const body = document.querySelector("body");
const scheme = document.getElementById("scheme");
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

const main = document.querySelector("main");

const appendPost = (post, container) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");
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
  const lastChild = main.lastElementChild;
  if (!lastChild.hasChildNodes()) {
    appendPost(post, lastChild);
  } else if (
    lastChild.firstElementChild.dataset.type == "small" &&
    post.type == "small"
  ) {
    appendPost(post, lastChild);
    const newContainer = document.createElement("div");
    newContainer.classList.add("container");
    main.appendChild(newContainer);
  } else {
    const newContainer = document.createElement("div");
    newContainer.classList.add("container");
    main.appendChild(newContainer);
    appendPost(post, newContainer);
  }
};

const generateRandomHeight = (floor, ceiling, maxHeight) => {
  const min = floor*maxHeight;
  const max = ceiling*maxHeight;
  const randomHeight = Math.random() * (max - min) + min;  
  return randomHeight;
}

const loadDynamicHeight = () => {
  const containers = document.querySelectorAll(".container");
  containers.forEach(container => {
    const maxHeight = container.clientHeight;
    if(container.children.length>1){
      const children = container.childNodes;
      const randomHeight = generateRandomHeight(0.35,0.6,maxHeight);
      children[0].style.height = `${randomHeight}px`;
      children[1].style.height = `${maxHeight-randomHeight}px`
    }
    else{
      const onlyChild = container.firstElementChild;
      const randomHeight = generateRandomHeight(0.7, 0.9, maxHeight);
      onlyChild.style.height  = `${randomHeight}px`;
    }
  });
};

const fileNames = ["./ate.json", "./labas.json", "./big.json"];

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
    console.log("Error occured while loading/rendering posts: ", error);
  });

console.log('window.meta......................', window.meta);
let text = window.location.pathname;
console.log('text ...............:>> ', text);
const myArray = text.split("/");
let handle = myArray[myArray.length-1];
let productSuggestions = [];
let final = [];

const first = async () => {
  let tag;
  await fetch(window.Shopify.routes.root + `products/${handle}.js`)
    .then((response) => {
      if(response.ok){
        console.log(response); //first consume it in console.log
        return response.json(); //then consume it again, the error happens
      }
    })
    .then((suggestions) => {
      console.log('suggestions..... :>> ', suggestions);
      tag = suggestions.tags[0];
      console.log('tag..... :>> ', tag);
      if(tag) {
        fetch(window.Shopify.routes.root + `search/suggest.json?q=${tag}&resources[type]=product&resources[options][fields]=tag`)
          .then((response) => response.json())
          .then((suggestions) => {
            const productSuggestions2 = suggestions.resources.results.products;
            console.log('productSuggestions2 from second fetch :>> ', productSuggestions2);
            console.log('window.meta :>> ', window.meta.product);
            let main = document.createElement("div");
            let product = document.querySelector(".product-form");
            for(let j=0;j<productSuggestions2.length;j++) {
              console.log("working");
              console.log('window.meta.product.type :>> ', window.meta.product.type);
              if(window.meta.product.type !== productSuggestions2[j].type) {
                let div = document.createElement("div");
                let p = document.createElement("h3");
                let image = document.createElement("img");
                let anchor = document.createElement("a");
                let titleDiv = document.createElement("div");
                anchor.href = `${productSuggestions2[j].url}`
                p.innerHTML = productSuggestions2[j].title;
                titleDiv.appendChild(p);
                image.src = productSuggestions2[j].featured_image.url;
                image.style.width = "100%";
                image.style.height = "200px";
                image.style.objectFit= "contain";
                anchor.appendChild(div);
                div.appendChild(titleDiv);
                div.appendChild(image);
                div.style.display = "flex";
                div.style.alignItems = "center";
                div.style.justifyContent = "center";
                div.style.objectFit = "contain";
                div.style.flexDirection = "column";
                div.style.width= "200px";
                div.style.backgroundColor = "cadetblue";
                div.style.padding = "10px"
                main.appendChild(anchor);
              }
            }
            main.style.display = "grid";
            main.style.gridTemplateColumns = "1fr 1fr";
            main.style.gap = "20px";
            main.style.marginTop = "20px";
            product.appendChild(main);
          }
        );
      }
    }
  );
} 

// first();
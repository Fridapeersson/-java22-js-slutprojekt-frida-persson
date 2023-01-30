const searchForm = document.querySelector("#searchForm")

const searchText = document.querySelector("#searchText");

const numberOfImg = document.querySelector("#numberOfImg");

const imgSize = document.querySelector("#imgSize");

const sort = document.querySelector("#sortImg");

const errorMessageDiv = document.querySelector("#errorMessageDiv");

const fetchImages = function() {
    //läser det användaren angett
    const userInputSearchText = searchText.value;
    searchText.value = "";
    const userInputNumberOfImg = numberOfImg.value;
    const userInputImgSize = imgSize.value;
    const userInputSort = sort.value;

    const apiUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=7475a96bfbb1ea643b83d2585330a953&text=${userInputSearchText}&sort=${userInputSort}&per_page=500&page=1&format=json&nojsoncallback=1`;


  fetch(apiUrl)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw new Error("Failed to fetch");
      }
    })
    .then(data => {
        //kollar om det finns bilder på det användaren sökt på
      if (data.photos.photo.length === 0) {
        displayErrorMessage(`💥 No results found for "${userInputSearchText}" 📸`);
      } else {
        //Hämtar antal foto användaren anger
        for (let i = 0; i < userInputNumberOfImg; i++) {
          let img = document.createElement("img");
          imagesDiv.append(img);
          img.classList.add("searchResultImgs");
          //om användaren trycker på bilden öppnas den i ett nytt fönster i den begärda storleken
          img.onclick = function () {
            window.open(this.src, "_blanc");
          };

          img.src = `https://live.staticflickr.com/${data.photos.photo[i].server}/${data.photos.photo[i].id}_${data.photos.photo[i].secret}_${userInputImgSize}.jpg`;
          
        }
      }
    })
    .catch(error => {
      console.log(`An error occured ${error}`);
      displayErrorMessage(` Woopsie! Something went wrong: "${error.message}" 💥 You broke the internet 💻💔 But don't you worry, it can happend to the best of us, and this time it happened to you! ❤️‍🩹 Try again!`);
    });
    //tar bort gamla bilder och ersätter med nya
    clearAllImages();
    //Tar bort felmeddelande så det bara kommer visas 1 felmeddelande åt gången och inte läggas till fler
    removeErrorMessages();
}
//Error meddelande
const displayErrorMessage = function (errorMessage) {
    //Lägger till ett h2 element med felmeddelande
    const h2 = document.createElement("h2");
    errorMessageDiv.append(h2);
    h2.insertAdjacentText("beforeend", errorMessage); 
    h2.classList.add("errorStyling"); 
}
//Tar bort felmeddelande så det bara kommer visas 1 felmeddelande åt gången och inte läggas till fler
const removeErrorMessages = function() {
    const errorMessages = document.querySelector(".errorStyling");
    if (errorMessages) {
        errorMessages.remove();
    }
}
//tar bort gamla bilder och ersätter med nya
const clearAllImages = function() {
    const clearAllImages = document.getElementsByClassName("searchResultImgs");
    while(clearAllImages.length){
        clearAllImages[0].remove();
    }
}
searchForm.addEventListener("submit", event => {
    event.preventDefault();

    fetchImages();
});
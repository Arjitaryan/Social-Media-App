

// JavaScript (using Fetch API)
const likeButtons = document.querySelectorAll('.toggle-like-button');

// Function to check if the user has liked a post
async function checkIfLiked(elementId, element) {
    try {


        const response = await fetch(`/likes/toggle/?id=${elementId}&type=${element}`, {
            method: 'GET',
        });


        if (response.ok) 
        {
            const data = await response.json();
            return data.liked;
        }
    } catch (error) {
        console.error(error);
    }
}

// Function to update the heart button's color
function updateHeartColor(button, isLiked, likesCount) {

    if (isLiked) 
    {
        button.innerHTML= `<i class="fa-solid fa-heart" style="color: red;"></i>${likesCount} Likes`;
    } 
    else 
    {
        button.innerHTML= `<i class="fa-regular fa-heart" style="color: red;"></i>${likesCount} Likes`;
    }
}

// Loop through each like button and update its color
likeButtons.forEach(async (button) => {
    const elementId = button.getAttribute("data-id");
    const element= button.getAttribute("data-type");
    const likesCount= button.getAttribute("data-likes");
    const isLiked = await checkIfLiked(elementId, element);
    updateHeartColor(button, isLiked, likesCount);
});

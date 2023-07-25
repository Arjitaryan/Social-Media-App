//create a class to toggle likes when a link is clicked, using AJAX

// console.log("Toggle Like script page loaded");



class ToggleLike{
    constructor(toggleElement)
    {
        this.toggler= toggleElement;
        this.toggleLike();
    }

    
    toggleLike(){

        let pself= this;

        $(this.toggler).click(function(e){
            e.preventDefault();
            let self= this;

            $.ajax({
                type: 'post',
                url: $(self).attr('href'),
                success: function(data){
                    console.log(data);

                    let likesCount= parseInt($(self).attr('data-likes'));

                    if(data.data.deleted == true)
                    {
                        likesCount-= 1;
                    }
                    else
                    {
                        likesCount+= 1;
                    }


                    $(self).attr('data-likes', likesCount);
                    
                    if(data.data.deleted == false)
                    {
                        $(self).html(`<i class="fa-solid fa-heart" style="color: red;"></i>${likesCount} Likes`);
                        
                        if(data.data.likeableType == 'Post')
                        {
                            pself.callSuccessNoty("You liked the post AJAX");
                        }
                        else
                        {
                            pself.callSuccessNoty("You liked the comment AJAX");
                        }
                    }
                    else
                    {
                        $(self).html(`<i class="fa-regular fa-heart" style="color: red;"></i>${likesCount} Likes`);

                        pself.callSuccessNoty("You removed the like AJAX");
                    }

                }, error: function(data){
                    console.log("Error in ajax request for likes", err.responseText);
                    pself.callErrorNoty("Error in like");
                }
            })
        });

    }

    
    callSuccessNoty(text){
        new Noty({
            theme: 'relax',
            text: text,
            type: 'success',
            layout: 'topRight',
            timeout: 1500
        }).show();
    }
    
    callErrorNoty(text){
        new Noty({
            theme: 'relax',
            text: text,
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
    }
}



$('.toggle-like-button').each(function(){
    let self = this;
    let toggleLike = new ToggleLike(self);
});
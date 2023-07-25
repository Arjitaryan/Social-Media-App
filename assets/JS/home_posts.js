{
    
    //method to submit the form data for new post using AJAX
    let createPost= function(){
        let newPostForm= $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            const files = document.querySelector('[name=postphoto]').files;
            let formData= new FormData();
            formData.append("postphoto", files[0]);
            formData.append("content", document.getElementById('post-input').value);
            

            $.ajax({
                type: 'post',
                url: '/posts/create',
                // data: newPostForm.serialize(),   //this will conver the form data into json

                
                data: formData,
                processData: false,
                contentType: false,
                
                success: function(data){
                    console.log(data);
                    
                    let newPost;

                    newPost= newPostDom(data.data.post, data.data.postUserName, data.data.postUserId, data.data.postUserAvatar, data.data.photoPresent, data.data.contentPresent);

                    $('#posts-list-container>ul').prepend(newPost);
                    $('#post-input').val("");
                    $("input[name|='postphoto'").val('');
                    
                    callSuccessNoty("Posted Successfully AJAX");

                    // console.log($('.delete-post-button', newPost));
                    deletePost($('.delete-post-button', newPost));


                    let newCommentForm= $('.new-comment-form', newPost)
                    newCommentForm.submit(function(e){
                        e.preventDefault();

                        $.ajax({
                            type: 'post',
                            url: '/comments/create',
                            data: newCommentForm.serialize(),   //this will convert the form data into json
                            success: function(data){
                                console.log(data);
                                let newComment= newCommentDom(data.data.comment, data.data.commentUserName, data.data.commentUserId);
            
                                let postCommentList= $('ul', newPost);
            
                                postCommentList.prepend(newComment);
            
                                $('input[type=text]', newPost).val("");
                                
                                callSuccessNoty("Your comment is posted AJAX");
                                
                                deleteComment($('.delete-comment-botton', newComment));

                                new ToggleLike($('.toggle-like-button', newComment));
            
                            }, error: function(error){
            
                                callErrorNoty("Error in posting the comment");
                                console.log(error.responseText);
                            }
                        });
                    })
                    

                    // enable the functionality of the toggle like button on the new post
                    new ToggleLike($('.toggle-like-button', newPost));
                    
                }, error: function(error){
                    
                    
                    // callErrorNoty(error.responseText);
                    callErrorNoty("Error in creating post");
                    console.log(error.responseText);
                }
                
            });
        });
    }

    //method to create a post in DOM

    let newPostDom= function(post, postUserName, postUserId, postUserAvatar, photoPresent, contentPresent)
    {
        let newDom= `<li id="post-${post._id}" class="post-container">
                        <div class="post-head">          
                            <a href="/users/profile/${postUserId}"><img src="${postUserAvatar}"><p>${postUserName}</p></a>                                            
                            <a class="delete-post-button delete-btn" href="/posts/destroy/${post._id}"><i class="fa-solid fa-xmark"></i></a>
                        </div>`;
        
        if(photoPresent)
        {
            newDom+=        `<img class="post-photo" src="${post.postphoto}">`;
        }

        if(contentPresent)
        {
            newDom+=        `<p class= "post-content">${post.content}</p>`;
        }

        newDom+=            `<small>
                                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                    <i class="fa-regular fa-heart" style="color: red;"></i>
                                    0 Likes
                                </a>
                            </small>


                        <div class="post-comments">
        

                            <form action= "/comments/create" class="new-comment-form" method="POST">

                                <input class="input-comment" type= "text" name="content" placeholder="Type Here to add comment.." required>
                                <input type="hidden" name="post" value="${post._id}">
                                <input type="submit" value="Add Comment">
                            </form>

        
                            <div class="post-comments-list">
                                <ul id="post-comments-${post._id}">
                                </ul>
                            </div>
                        </div>

                    </li>`;
        return $(newDom);
    }



    //method to delete a post from DOM
    let deletePost= function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    console.log(data);
                    $(`#post-${data.data.post_id}`).remove();

                    callSuccessNoty("Post has been deleted (AJAX)");

                }, error: function(data){

                    callErrorNoty("Error in deleting the post");
                    console.log(error.responseText);
                }
            })
        });
    }


    //calling for all the previously present posts
    let allDeletePost= $('.delete-post-button');
    for(let i=0; i<allDeletePost.length; i++)
    {
        deletePost(allDeletePost[i]);
    }
    

    let newCommentDom= function(comment, commentUserName, commentUserId){
        return $(`<li id="comment-${comment._id}">
                    <p>
                    
                        <small>
                            <a class="delete-comment-botton delete-btn" href="/comments/destroy/${comment._id}"><i class="fa-solid fa-xmark"></i></a>
                        </small>

                        <small>
                        <a href="/users/profile/${commentUserId}" style= "text-decoration: none;"><b>${commentUserName}</b></a>
                        </small>

                        ${comment.content}

                        <br>

                        <small>
                            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                                <i class="fa-regular fa-heart" style="color: red;"></i>
                                0 Likes
                            </a>
                        </small>
                    </p>
                </li>`)
    }

    let deleteComment= function(deleteLink){
        deleteLink.click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    console.log(data);
                    $(`#comment-${data.data.comment_id}`).remove();

                    callSuccessNoty("Comment has been deleted (AJAX)");

                }, error: function(data){

                    callErrorNoty("Error in deleting the comment");
                    console.log(error.responseText);
                }
            })
        });
    }


    let callSuccessNoty= function(text){
        new Noty({
            theme: 'relax',
            text: text,
            type: 'success',
            layout: 'topRight',
            timeout: 1500
        }).show();
    };

    let callErrorNoty= function(text){
        new Noty({
            theme: 'relax',
            text: text,
            type: 'error',
            layout: 'topRight',
            timeout: 1500
        }).show();
    };

    createPost();
}

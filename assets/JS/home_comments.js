
{
    
    let createComment= function(){

        let allPostComments= $('.post-comments');
        for(let i=0; i<allPostComments.length; i++)
        {

            let newCommentForm= $(allPostComments[i]).find('.new-comment-form');
    
            newCommentForm.submit(function(e){
                e.preventDefault();
    
                $.ajax({
                    type: 'post',
                    url: '/comments/create',
                    data: newCommentForm.serialize(),   //this will conver the form data into json
                    success: function(data){
                        console.log(data);
                        let newComment= newCommentDom(data.data.comment, data.data.commentUserName, data.data.commentUserId);
    
                        let postCommentList= $(allPostComments[i]).find('ul');
    
                        
                        postCommentList.prepend(newComment);
    
                        $(allPostComments[i]).find('input[type=text]').val("");
                        
                        callSuccessNoty("Your comment is posted AJAX");
                        
                        deleteComment($('.delete-comment-botton', newComment));

                        // enable the functionality of the toggle like button on the new comment
                        new ToggleLike($('.toggle-like-button', newComment));
    
                    }, error: function(error){
    
                        callErrorNoty("Error in posting the comment");
                        console.log(error.responseText);
                    }
                });
            });

        }
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

    //method to delete a comment from DOM
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

    let alldeleteComments= $('.delete-comment-botton');
    for(let i=0; i<alldeleteComments.length; i++)
    {
        deleteComment($(alldeleteComments[i]));   
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

    createComment();
}



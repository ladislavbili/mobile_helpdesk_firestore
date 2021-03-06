import { SET_COMMENTS,SET_COMMENTS_LOADING, ADD_COMMENT, ADD_COMMENT_AVATAR_URL,DELETE_COMMENT, SET_COMMENT_ATTACHMENT } from '../types';
import { TASKS_LIST, GET_LOC, GET_FILE, COMMENT_COMMENTS } from '../urls';
import {processError} from '../../helperFunctions';

/**
* Sets status if comments are loaded to false
*/
export const setCommentsLoading = (commentsLoaded) => {
  return (dispatch) => {
    dispatch({ type: SET_COMMENTS_LOADING, commentsLoaded });
  }
};

/**
* Gets all comments available with no pagination
* @param {string} token universal token for API comunication
*/
export const getComments= (taskID,token) => {
  return (dispatch) => {
    fetch(TASKS_LIST+'/'+taskID+'/comments'+'?limit=999', {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }).then((response) =>{
      if(!response.ok){
        processError(response,dispatch);
        return;
      }
      response.json().then((data) => {
        let comments=[];
        dispatch({type: SET_COMMENTS, comments:data.data});
        data.data.map((comment)=>{
          if(comment.createdBy.avatarSlug){
            fetch(GET_LOC+comment.createdBy.avatarSlug+'/download-location', {
              method: 'get',
              headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
              }
            }).then((response2)=>{
              if(!response2.ok){
                processError(response2,dispatch);
                return;
              }
              response2.json().then((data2)=>{
              fetch(GET_FILE+data2.data.fileDir+'/'+data2.data.fileName, {
                method: 'get',
                headers: {
                  'Authorization': 'Bearer ' + token,
                }
              }).then((response3) =>{
                if(!response3.ok){
                  processError(response3,dispatch);
                  return;
                }

                dispatch({type: ADD_COMMENT_AVATAR_URL,id:comment.id,url:response3.url});
              }).catch(function (error) {
                console.log(error);
              });
            }).catch(function (error) {
              console.log(error);
            })}
          ).catch(function (error) {
            console.log(error);
          });
        }
        comment.commentHasAttachments.map(attachment=>{
          fetch(GET_LOC+attachment.slug+'/download-location', {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          }).then((response2)=>{
            if(!response2.ok){
              processError(response2,dispatch);
              return;
            }
            response2.json().then((data2)=>{
            fetch(GET_FILE+data2.data.fileDir+'/'+data2.data.fileName, {
              method: 'get',
              headers: {
                'Authorization': 'Bearer ' + token,
              }
            }).then((response3) =>{
              if(!response3.ok){
                processError(response3,dispatch);
                return;
              }

              dispatch({type: SET_COMMENT_ATTACHMENT,commentID:comment.id,attachmentID:attachment.id,url:response3.url,name:attachment.name});
            }).catch(function (error) {
              console.log(error);
            });
          }).catch(function (error) {
            console.log(error);
          })}
        ).catch(function (error) {
          console.log(error);
        });
      })
    })
  });
}
).catch(function (error) {
  console.log(error);
});
}
}
/**
* Adds new comment
* @param {object} body  All parameters in an object of the new comment
* @param {string} token universal token for API comunication
*/

export const addComment = (body,taskID,token) => {
  return (dispatch) => {
    fetch(TASKS_LIST+'/'+taskID+'/add-comment',{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      method: 'POST',
      body:JSON.stringify(body),
    })
    .then((response)=>{
      if(!response.ok){
        processError(response,dispatch);
        return;
      }
      response.json().then((response)=>{
        if(response.data.createdBy.avatarSlug){
          let newComment=response.data;
          fetch(GET_LOC+newComment.createdBy.avatarSlug+'/download-location', {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          }).then((response2)=>{
            if(!response2.ok){
              processError(response2,dispatch);
              return;
            }

            response2.json().then((data2)=>{
            fetch(GET_FILE+data2.data.fileDir+'/'+data2.data.fileName, {
              method: 'get',
              headers: {
                'Authorization': 'Bearer ' + token,
              }
            }).then((response3) =>{
              if(!response3.ok){
                processError(response3,dispatch);
                return;
              }
              newComment['avatar']=response3.url;
              dispatch({type: ADD_COMMENT, comment:newComment});
            }).catch(function (error) {
              console.log(error);
            });
          }).catch(function (error) {
            console.log(error);
          })}
        ).catch(function (error) {
          console.log(error);
        });
      }else{
        dispatch({type: ADD_COMMENT, comment:response.data});
      }
    })})
    .catch(function (error) {
      console.log(error);
    });

  };
};

export const addCommentsComment = (body,commentID,token) => {
  return (dispatch) => {
    fetch(COMMENT_COMMENTS+'/'+commentID+'/add-comment',{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      method: 'POST',
      body:JSON.stringify(body),
    })
    .then((response)=>{
        if(!response.ok){
          processError(response,dispatch);
        return;
        }

      response.json().then((response)=>{
        if(response.data.createdBy.avatarSlug){
          let newComment=response.data;
          fetch(GET_LOC+newComment.createdBy.avatarSlug+'/download-location', {
            method: 'get',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          }).then((response2)=>{
            if(!response2.ok){
              processError(response2,dispatch);
              return;
            }
            response2.json().then((data2)=>{
            fetch(GET_FILE+data2.data.fileDir+'/'+data2.data.fileName, {
              method: 'get',
              headers: {
                'Authorization': 'Bearer ' + token,
              }
            }).then((response3) =>{
              if(!response3.ok){
                processError(response3,dispatch);
                return;
              }

              newComment['avatar']=response3.url;
              dispatch({type: ADD_COMMENT, comment:newComment});
            }).catch(function (error) {
              console.log(error);
            });
          }).catch(function (error) {
            console.log(error);
          })}
        ).catch(function (error) {
          console.log(error);
        });
      }else{
        dispatch({type: ADD_COMMENT, comment:response.data});
      }
    })})
    .catch(function (error) {
      console.log(error);
    });

  };
};

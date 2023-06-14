//utility
let getRandomId= ()=>{
    return Math.random().toString(36).substring(2,10);
}

const videoPlayer = document.getElementById('videoPlayer');
let currentsession;


videoPlayer.onpause= function(){
    console.log(videoPlayer.currentTime+"onpause");
    firebase
    .database()
    .ref("party/"+currentsession)
    .update({
        timestamp:videoPlayer.currentTime,
        status:"pause",
    });
}

videoPlayer.onplay= function(){
    console.log(videoPlayer.currentTime+"playing");
    firebase
    .database()
    .ref("party/"+currentsession)
    .update({
        status:"play",
        timestamp:videoPlayer.currentTime,
    });
}


let connect = ()=>{
    currentsession= getRandomId();
    const videoFileInput = document.getElementById('videoFile');
    const file = videoFileInput.files[0];
    const videoURL = URL.createObjectURL(file);
    console.log(videoURL);
    videoPlayer.src = videoURL; 

    const uname= document.getElementById("name");
    const joinId= document.getElementById("join");

    if(joinId.value){
        currentsession= joinId.value;
        firebase
        .database()
        .ref("party/"+joinId.value)
        .update({
            user2:uname.value,
        });
    }
    else{
        console.log(uname.value);
        const newjoinId=currentsession;
        document.getElementById("share").innerHTML=newjoinId;
        firebase
        .database()
        .ref("party/" + newjoinId)
        .set({
        user2:"",
        user1:uname.value,
        status:"play",
        timestamp:0,
        });
    }

    //pause when other user pauses the video
    firebase.database().ref("party/"+currentsession).on("value",function(snapshot){
        console.log('data changed');
        let time= snapshot.val().timestamp;
        // firebase.database().ref("party/"+currentsession).on("value",function(snap){
        //     time= snap.val().timestamp;
        // });
        console.log(time+" "+snapshot.val().status);
      //  if(!isFinite(time)){
            videoPlayer.currentTime=time;
            console.log("is finite");
        //}
        if(snapshot.val().status=="pause"){
            videoPlayer.pause();
            console.log("pause paniten");
        }
        else{
            videoPlayer.play();
            console.log("play paniten");
        }
    });
}


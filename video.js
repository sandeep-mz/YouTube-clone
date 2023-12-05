let urlParams = new URLSearchParams(window.location.search);
let SearchVideoId = urlParams.get("q") ? urlParams.get("q") : "";
let searchKey = urlParams.get("searchKey") ? urlParams.get("searchKey") : "";

const API_KEY = "AIzaSyDA0UFC-gFpphL3RRiZy26LV_h4DMI_O1g";
const BASE_URL = "https://www.googleapis.com/youtube/v3";
let maxResults = 15;

let searchBtn = document.getElementById("searchBtn");
let searchQuery = document.getElementById("Search");
let suggestedSection = document.getElementById("suggestedSection");
let videoChannelDetails = document.getElementById("video_channelDetails");
let customLoader = document.getElementById("custom-loader");



try {
  videoPlayer()
} catch (error) {
  window.location.reload();
}

function videoPlayer(){
  //render first element in video_channelDetails
  if (YT) {
   new YT.Player("videoContainer", {
     height: "100%",
     width: "100%",
     videoId : SearchVideoId,
     playerVars: {
       'autoplay': 1,
       'controls': 1,        
       'modestbranding': 1,
       'showinfo': 1,
       'mute': 0
   }
   });
 }
 
 }


// All Rendering Functions 
initialRender();
async function initialRender() {
  console.log("Search Started");
  customLoader.style.display = "block";
  searchQuery.value = searchKey;

  let dataItems = await fetchVideo(searchQuery.value, maxResults);
  console.log("Rendering video...");

  renderVideo(dataItems);
  createSuggestedSection(dataItems);

  customLoader.style.display = "none";
  searchQuery.innerText = "";
}

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log("Search Started");
  customLoader.style.display = "block";
  let dataItems = await fetchVideo(searchQuery.value, maxResults);
  // console.log(dataItems);
  console.log("Rendering video...");
  renderVideo(dataItems);
  customLoader.style.display = "none";
  searchQuery.innerText = "";
});


async function renderVideo(dataItems) {
  try {
  console.log("Rendering video starting...");
  videoChannelDetails.innerHTML = ``;
  let start = 0;
  for (let i = start; i < dataItems.length; i++) {
      let channelName = dataItems[i].snippet.channelTitle;
      let videoTitle = dataItems[i].snippet.title;
      let videoUploaded = dataItems[i].snippet.publishTime;
      let channelThumbnailSrc = dataItems[i].ChannelLogo.items[0].snippet.thumbnails.default.url;
      let channelDescription = dataItems[i].ChannelLogo.items[0].snippet.description;
      let videoViews = dataItems[i].VideoStats.items[0].statistics.viewCount;
      let likeCount = dataItems[i].VideoStats.items[0].statistics.likeCount;
      let dislikeCount = dataItems[i].VideoStats.items[0].statistics.dislikeCount;

      videoChannelDetails.innerHTML = `
        <h4 id="videoTitle">${videoTitle}</h4>
        <div id="videoDetails">
            <span id="videoStats1">
            <span id="viewsCount"> ${countFormator(videoViews)} views</span>
             . <span id="videoDate"> ${timeAgo(videoUploaded)}</span></span>
            <span id="videoStats2">
                <span id="likes"><i class="fa-regular fa-thumbs-up">${countFormator(likeCount)} </i></span>
                <span id="dislikes"><i class="fa-light fa-thumbs-down">${countFormator(dislikeCount)}</i></span>
                <span id="share"><i class="fa-light fa-share">SHARE</i>
                <span id="save"><i class="fa-light fa-bookmark">SAVE</i>
                <span id="more"><i class="fa-light fa-ellipsis-vertical"></i>>
            </span>
        </div>
        
        <div  id="channelDetails">
            <div id="channelThumbnailContainer">
                <img src="${channelThumbnailSrc}" alt="channelThumbnail" id="channelThumbnail">
            </div>
            <div id="channelDetailsContainer">
                <div id="channelIntro">
                    <div>
                        <h4 id="channelName">${channelName}</h4>
                        <p id="channelStats"><span>1.2 M subscriber</span></p>
                    </div>
                    <button class="Subscribe">Subscribe</button>
                </div>
                <p>${channelDescription}</p>
            </div>
        </div>
        `;
      }
      console.log("Rendering Video Done Successfully");
// get the commentSnippet for the selected video
  let Comments = await getCommentSnippet(SearchVideoId);
 // localStorage.setItem("Comments", JSON.stringify(Comments));
 // const Comments = JSON.parse(localStorage.getItem('Comments'));

//Render All Comments for the selected video
  createCommentSection(Comments);
  } catch (error) {
    console.log(error);
  }
}

function createSuggestedSection(dataItems){
console.log("Suggested Video Section Rendering...");
suggestedSection.innerHTML = ``;
for (let i = 0; i < dataItems.length; i++) {
  let videoId = dataItems[i].id.videoId;
  let videoThumbnailSrc = dataItems[i].snippet.thumbnails.default.url;
  let channelName = dataItems[i].snippet.channelTitle;
  let videoTitle = dataItems[i].snippet.title;
  let videoUploaded = dataItems[i].snippet.publishTime;
  let videoViews = dataItems[i].VideoStats.items[0].statistics.viewCount;
  let duration = dataItems[i].contentDetails.items[0].contentDetails.duration;
  
          //making suggestedSection video list rendering
          let cardDiv = document.createElement("div");
          cardDiv.className = "card1";
          cardDiv.innerHTML = `
                      <img src="${videoThumbnailSrc}" alt="videoThumbnail" id="videoThumbnail" >
                         <div id="videoDetailsContainer">
                          <span  id="videoDuration">${durationConverter(duration)}</span>
                          <div class="d-flex flex-column justify-content-between  h-100 p-2" id="cardDetails">
                          <h5 class="card-title" id="videoTitle">${videoTitle}</h5>
                          <p class="card-subtitle" id="channelName" onclick="channelPreview(${dataItems})>${channelName}</p>
                          <p class="card-subtitle text-white" id="channelStats">
                          <span>${countFormator(videoViews)} views</span>
                           . <span>${timeAgo(videoUploaded)}</span></p>
                          </div>
                      </div>
  
                      </div>
                      `;
          cardDiv.addEventListener("click", () => {videoPreview(videoId);});
          suggestedSection.appendChild(cardDiv);
}
console.log("Suggested Video Section Rendering Successful!");

}

function createCommentSection(Comments) {
  console.log("Comment Section Rendering...");

  let AllComments = document.getElementById("AllComments");
  AllComments.innerHTML = ``;

  for (let i = 0; i < Comments.length; i++) {
    let UserName = Comments[i].snippet.topLevelComment.snippet.authorDisplayName;
    let UserImageSrc = Comments[i].snippet.topLevelComment.snippet.authorProfileImageUrl;
    let time = Comments[i].snippet.topLevelComment.snippet.publishedAt;
    let CommentMessage = Comments[i].snippet.topLevelComment.snippet.textOriginal;
    let LikedCount = Comments[i].snippet.topLevelComment.snippet.likeCount;
    // let DislikedCount = Comments[i].snippet.topLevelComment.snippet.dislikeCount;
    let canReply = Comments[i].snippet.canReply;

    let div = document.createElement("div");
    div.className = "addComment";
    div.innerHTML = `
    <div class="userImage"><img src="${UserImageSrc}" alt="" class="userThumbnail"></div>
    <div class="InputComment">
    <p>${UserName} <span class="commentTime"> ${time}</span></p>
    <p>${CommentMessage}</p>
    <div class="commentStats">
    <span class="material-symbols-outlined">thumb_up ${LikedCount}</span>
    <span class="material-symbols-outlined">thumb_down ${3}</span>
      <span>REPLY</span>
    </div>
  </div>`;

    AllComments.appendChild(div);
  }
  console.log("Comment Section Rendering Successful!");
}

// all data fetching Functions
async function getCommentSnippet(SearchVideoId){
  try {
    console.log("Fetching Comment Snippet...");
    const response = await fetch(`${BASE_URL}/commentThreads?part=snippet&videoId=${SearchVideoId}&key=${API_KEY}`);
    const data = await response.json();
    // console.log(data.items);
    let Comments = data.items;
    console.log("Fetching Comment Snippet Successful!");
    // localStorage.setItem("Comments", JSON.stringify(Comments));
    return Comments;
    
  } catch (error) {
    console.log("inside getCommentSnippet(SearchVideoId)"+error);
  }
}

async function fetchVideo(searchQuery, maxResults) {
  console.log("Fetching video");
  try {
    const response = await fetch(
      `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`
    );
    const data = await response.json();
    const dataItems = data.items;

    // const dataItems = JSON.parse(localStorage.getItem('dataItems'));
    for (let i = 0; i < dataItems.length; i++) {
      try {
        let VideoStats = await getVideoStats(dataItems[i].id.videoId);
        let contentDetails = await getContentDetails(dataItems[i].id.videoId);
        let ChannelLogo = await getChannelLogo(dataItems[i].snippet.channelId);
        dataItems[i].VideoStats = VideoStats;
        dataItems[i].contentDetails = contentDetails;
        dataItems[i].ChannelLogo = ChannelLogo;
      } catch (error) {
        console.log(
          "this is the error in fetching VideoStats/ChannelLogo Data in API call-> -> " +
            error
        );
      }
    }
    console.log("Fetching video Successful!");
    // console.log(dataItems);
    // localStorage.setItem("dataItems", JSON.stringify(dataItems));
    return dataItems;
  } catch (error) {
    console.log(
      "this is the error in fetching the Data in API call-> " + error
    );
  }
}

async function getVideoStats(videoId) {
  const response = await fetch(
    `${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`
  );
  const data = await response.json();
  // console.log(data);
  return data;
}

async function getContentDetails(videoId) {
  const response = await fetch(
    `${BASE_URL}/videos?id=${videoId}&part=contentDetails&key=${API_KEY}`
  );
  const data = await response.json();
  // console.log(data);
  return data;
}

async function getChannelLogo(channelId) {
  const response = await fetch(
    `${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`
  );
  const data = await response.json();
  // console.log(data);
  return data;
}

//All Data Manipulation Functions
function countFormator(count) {
  if (count == undefined || count == null) {
    return 0;
  }
  const num = parseFloat(count);
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "k";
  }
  return num;
}

function timeAgo(videoUploaded) {
  const currentTime = new Date();
  const publishDate = new Date(videoUploaded);
  const timeDifference = currentTime - publishDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
}

function durationConverter(duration) {
  if (duration === "P0D") {
    return "Live"; // Return 'Live' for the specific case of 'P0D'.
  }
  // Define a regular expression pattern to match hours, minutes, and seconds.
  const pattern = /PT(\d+H)?(\d+M)?(\d+S)?/;

  // Use regular expressions to extract hours, minutes, and seconds from the input string.
  const matches = duration.match(pattern);

  if (!matches) {
    return null; // Return null for invalid input.
  }

  // Extract hours, minutes, and seconds from the matches.
  const hours = matches[1] ? parseInt(matches[1].slice(0, -1)) : 0;
  const minutes = matches[2] ? parseInt(matches[2].slice(0, -1)) : 0;
  const seconds = matches[3] ? parseInt(matches[3].slice(0, -1)) : 0;

  if (hours < 1 && minutes < 1 && seconds < 1) {
    return "Live"; // If no time components are present, return 'Live'.
  }

  let formattedTime = "";

  if (hours > 0) {
    formattedTime += hours.toString().padStart(2, "0") + ":";
  }

  formattedTime +=
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  return formattedTime;
}

function videoPreview(videoId) {
  let link = document.createElement("a");
  link.href = `video.html?q=${videoId}`;
  link.click();
}
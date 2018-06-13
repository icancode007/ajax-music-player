const options_list = $('#search-option-list');
const song_list = $('#musicList');
const playBtn = $('#play');

const player  = new Audio();
let options_div = $('.options');
let playList=[];
let index = 0;
let isPlaying = true;

$('#search-option-list,#musicList,.music-card').click(()=>{
  $('#search-option-list').css({'display':'none'});
})
$(window).on('load',() => {
  $.ajax({
     url: `http://api.napster.com/v2.2/search?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&query=drake&type=artist`
     ,
     success: function(response) {
          loadTracks('art.28463069');
        }
     })
});


function Jukebox(){ //Jukebox Object

  this.play_pause = () => {
      if(isPlaying){
        player.pause();
        isPlaying  = !isPlaying;
        playBtn.toggleClass("fa-play fa-pause");
        }
      else{
        player.play();
        isPlaying  = !isPlaying;
        playBtn.toggleClass("fa-play fa-pause");
      }
  }
  this.nextSong = () => {
    let musicArr  = $('.music-card');
    let newIndex = "";
    if(index < musicArr.length){
      index+=1;
      newIndex = $(musicArr[index]).attr('data-song');
      handleSound(newIndex);
    }
    else{
      index = 0;
      newIndex = $(musicArr[index]).attr('data-song');
      handleSound(newIndex);
    }
  }
  this.previousSong = ()=> {
    let musicArr  = $('.music-card');
    let URL = "";
    if(index >= 2){
      index-=1;
      URL = $(musicArr[index]).attr('data-song');
      handleSound(URL);
    }
    else{
      index = musicArr.length - 1;
      URL = $(musicArr[index]).attr('data-song');
      handleSound(URL);
    }
  }
  this.shuffle = ()=> {
    index = Math.floor(Math.random() * 10) + 1;
    let URL = "";
    URL = $(musicArr[index]).attr('data-song');
    handleSound(URL);
  }
  this.playSelected = (event) => {//When event gives back the element that was clicked on with  " this " it returns a plain DOM element which ignores JQuery functions
    handleSound($(event).attr("data-song"));//The solution to this is wrapping the element around with: $()
  }
}

let jukeBox = new Jukebox();//Jukebox Instance

//Helper functions
let handleSound = (index) => {
  player.src=index;
  player.play();
}

// $('#queryArtist').on('input',(evt) => {
//   if(evt.target.value.length > 3)
//     $.ajax({
//        url: `http://api.napster.com/v2.2/search?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&query=${evt.target.value}&type=artist`
//        ,
//        success: function(response){
//           options_list.empty();
//           for(let i=0;i<5;i++){
//               options_list.append(`<div class="option" data-id=${response.search.data.artists[i].id} onClick="loadTracks(this)">${response.search.data.artists[i].name}</div>`);
//           }
//         }
//        });
//
// })
$('#queryArtist').on({
  input:(evt) => {
    if(evt.target.value.length > 3)
      $.ajax({
         url: `http://api.napster.com/v2.2/search?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&query=${evt.target.value}&type=artist`
         ,
         success: function(response){
            options_list.empty();
            for(let i=0;i<5;i++){
                options_list.append(`<div class="option" data-id=${response.search.data.artists[i].id} onClick="loadTracks(this)">${response.search.data.artists[i].name}</div>`);
            }
          }
        })
    },
    focus: (evt) => {
      $('#search-option-list').css({'display':'flex'});
    }

})


function loadTracks(evt){
  let artist_id;
  artist_id = (typeof evt === 'string')? evt : evt.getAttribute('data-id');
  $.ajax({
      url:`http://api.napster.com/v2.2/artists/${artist_id}/tracks/top?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=10`
      ,
      success: function(response){
        let arrSongs = response.tracks;
          arrSongs.forEach((elem) => {
          song_list.append(
          `<div class="music-card" data-song=${elem.previewURL} style="background-image:url(http://direct.napster.com/imageserver/v2/albums/${elem.albumId}/images/200x200.jpg);" onClick="jukeBox.playSelected(this)">
            <h5>${elem.name}</h6>
            <div class="songImg">
            </div>
           </div>`)
        });
      handleSound(arrSongs[0].previewURL);
      }
    });
}

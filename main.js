const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playlist = $('.playlist')
const cd = $('.cd')
const player = $('.player')
const cdThumb = $('.cd-thumb')
const header = $('header')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const song = $$('.song')
const PLAYER_STORAGE = 'SUNNY-PLAYER'
const app = {
  isRandom : false,
  isRepeat : false,
  currentIndex : 0,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
    
    songs:[
    
        {
            name: "YeuThiSao",
            singer: "DeeTran",
            path: "./songs/YeuThiSao-DeeTran-8865621.mp3",
            image: "./image/YeuThiSao-DeeTran.jpg"
          },
          {
            name: "DieuMeKhongKe",
            singer: "DinhManhNinh",
            path: "./songs/DieuMeKhongKeAcousticVersion-DinhManhNinh-8852410.mp3",
            image: "./image/NeuLucDo-tlinh.jpg"
          },
          {
            name: "ThiMau",
            singer: "HoaMinzy",
            path: "./songs/ThiMau1-HoaMinzyMasew-8820974.mp3",
            image: "./image/GheIuDauCuaEmOi.jpg"
          },
          {
            name: "BatTinhYeuLen",
            singer: "TangDuyTanHoaMinzy",
            path: "./songs/BatTinhYeuLen-TangDuyTanHoaMinzy-8715666.mp3",
            image: "./image/BatTinhYeuLen-TangDuyTanHoaMinzy.jpg"
          },
          {
            name: "EmDongYIDo",
            singer: "DucPhuc",
            path: "./songs/EmDongYIDo-DucPhucx911-8679310.mp3",
            image: "./image/test.png"
          },
          {
            name: "DuBaoThoiTiet",
            singer: "GREYDPhucDu",
            path: "./songs/DuBaoThoiTietHomNayMuastormVersion-GREYDPhucDu-8541114.mp3",
            image: "./image/DuBaoThoiTietHomNayMua 11.jpg"
          },
          {
            name: "Tinhdau",
            singer: "KaiDinhOrange",
            path: "./songs/TinhdauTinhdauTinhdau-KaiDinhOrange-8416056.mp3",
            image: "./image/Tinhdau.jpg"
          },
          {
            name: "DeToiOmEm",
            singer: "KaiDinhMINGREYD",
            path: "./songs/DeToiOmEmBangGiaiDieuNay-KaiDinhMINGREYD-8416034.mp3",
            image: "./image/DeToiOmEmBangGiaiDieuNay.jpg"
          },

    
],
    setConfig(key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE,JSON.stringify(this.config))
    },
    render() {
        const html = this.songs.map((song,index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index= "${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        }).join('')
        
        playlist.innerHTML = html
        this.scrolltoActiveSong ()       


    },
    
    handleEvent() {
      const cdWidth = cd.offsetWidth
      
      const Annimation = cdThumb.animate([
          {
            transform:('rotate(360deg)')
          }],{
            duration: 10000,
            iterations: Infinity
          })
        Annimation.pause()  
        audio.onplay = function () {
          Annimation.play()
        }
        audio.onpause = function () {
          Annimation.pause()
        }
        
       document.onscroll = function () {
            const scroolY = document.documentElement.scrollTop || window.scrollY 
            
            var newCdWidth = cdWidth - scroolY
            if (newCdWidth > 0) {cd.style.width = newCdWidth + 'px'} else {cd.style.width =0}
       }
       playBtn.onclick = function () {
        player.classList.toggle('playing')
        if (player.classList.contains('playing')) {audio.play()} else {audio.pause()}
       }
       audio.ontimeupdate = function () {
        progress.value = Math.floor(audio.currentTime / audio.duration * 100)
       }
       progress.onchange = function (e) {
        const seekTime = e.target.value * audio.duration / 100
        audio.currentTime = seekTime
       }
       nextBtn.onclick = () => {
        if(this.isRandom) {this.playRandom()} else {
          this.currentIndex++
        if (this.currentIndex >= this.songs.length ) {
          this.currentIndex = 0
        }
        this.render()
        this.loadCurrentSong()
        
        if (player.classList.contains('playing')) {audio.play()} else {
          player.classList.add('playing')
          audio.play()
        }
        }
        
        
       }
       prevBtn.onclick = () => {
        if(this.isRandom) {this.playRandom()} else {
          this.currentIndex--
          if (this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1
          }
          this.render()
          this.loadCurrentSong()
          
          if (player.classList.contains('playing')) {audio.play()} else {
            player.classList.add('playing')
            audio.play()
          }
        }
        
       }
       randomBtn.onclick = () => {
        
        randomBtn.classList.toggle('active')
        if (randomBtn.classList.contains('active')) {
          this.isRandom= true
        } else {this.isRandom = false}
        this.setConfig('isRandom',this.isRandom)
       
      }
      audio.onended = function () {
        nextBtn.onclick()
      }
      repeatBtn.onclick = () => {
        this.setConfig('isRepeat', this.isRepeat)
        repeatBtn.classList.toggle('active')
        if (repeatBtn.classList.contains('active')) {
          this.isRepeat=true
          audio.onended = function () {
            audio.play()
          }        
        } else {nextBtn.onclick()
        }}
      playlist.onclick = (e) => {
        const songNode = e.target.closest('.song:not(.active)') 
        if(songNode || e.target.closest('.option')) {
          if (songNode) {
            this.currentIndex = Number(songNode.dataset.index)
            this.loadCurrentSong()
            this.render()
            audio.play()
          }
        }
      }
      

      
       
       
    },
    scrolltoActiveSong () {
      setTimeout(function() {
          $('.song.active').scrollIntoView({
            behavior: "smooth",
            block: "center"
          })
      },300)
    },
    playRandom() { this.currentIndex =Math.floor(Math.random() * this.songs.length)
      this.render()
      this.loadCurrentSong()
      if (player.classList.contains('playing')) {audio.play()} else {
        player.classList.add('playing')
        audio.play()
     }

    },
    loadCurrentSong() {
      header.innerHTML = `<h4>Now playing:</h4>
      <h2>${this.songs[this.currentIndex].name}</h2>`
      cdThumb.style.backgroundImage = `url('${this.songs[this.currentIndex].image}')`
      audio.src = `${this.songs[this.currentIndex].path}`
      
      
    },
    Start () {
        this.loadCurrentSong()
        this.render()
        this.handleEvent() 

    }
}

app.Start()
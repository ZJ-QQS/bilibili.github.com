import "./vue.js"
import "./request.js"
const vm = new Vue({
    el: '#app',
    data: {
        navList: [],
        navHide:true,
        navActiveIndex:0,
        bannerList:[],
        bannerWidth:350,
        bannerStyle:{
            left:0,
            transition: 'left .3s',
        },
        bannerActiveIndex:0,
        videoOldList:[],
        videoGettingData:false,
        videoCount:0,
    },
    computed:{
        videoList(){
           return  this.videoOldList.map(video=>{
                video.play = video.play > 10000 ? video.play/10000 + '万' : video.paly;
                video.rank = video.rank > 10000 ? video.rank/10000 + '万' : video.rank;
                return video;
            })
        }
    },
    methods:{
        handleClick () {
        this.navHide = !this.navHide;
      },
      handleNavClick (index) {
        this.navActiveIndex = index;
      },
        autoMove(){
            setTimeout(()=>{
                if(this.bannerActiveIndex === 0){
                    this.bannerStyle.transition = 'left .3s'
                }
                this.bannerActiveIndex ++;
                this.bannerStyle.left = -this.bannerWidth * this.bannerActiveIndex + 'px';
            },1500)
        },
        handleTransitionEnd () {
            if(this.bannerActiveIndex === 3) {
              this.bannerActiveIndex = 0;
              this.bannerStyle.left = 0;
              this.bannerStyle.transition = 'none';
            }
            this.autoMove();
          },
          handleScroll(e){
              const {scrollHeight,offsetHeight,scrollTop}=e.target;
              const toBottomHeight = scrollHeight - offsetHeight - scrollTop;
              const videoLength = this.videoList.length;
              if(videoLength === this.videoCount){return};
              if(toBottomHeight < 200 && !this.videoGettingData){
                  this.videoGettingData = true;

                  axios.get('video',{
                      params:{
                          start:this.videoList.length,
                          offset:12
                      }
                  }).then(res=>{
                          this.videoOldList.push(...res.data);
                          this.videoGettingData = false;
                      
                  })
              }
          },
          getData(){
            axios.all([
                axios.get('nav'),
                axios.get('banner'),
                axios.get('video',{
                    params:{
                        start:0,
                        offset:12
                    }
                })
            ]).then(axios.spread((navRes,bannerRes,videoRes)=>{
                this.initNavList(navRes);
                this.initBannerList(bannerRes);
                this.initVideo(videoRes);
            }))
        },
        initNavList(navRes){
            this.navList = navRes;
        },
        initBannerList(bannerRes){
            const bannerLaseEle = {...bannerRes[0]};
            bannerLaseEle.id = Math.floor(Math.random() * 10000000);
            this.bannerList = [...bannerRes, bannerLaseEle];
    
        },
        initVideo(videoRes){
            this.videoCount = videoRes.count;
            this.videoOldList = videoRes.data;
        }
    },
    created() {
        this.getData();
    },
    mounted(){
        this.autoMove()
    }
})










































//  
//       el: '#app',
//       data: {
//         navList: [],
//         navHide: true,
//         navActiveIndex: 0,
//         bannerList: [],
//         bannerWidth: 350,
//         bannerStyle: {
//           left: 0,
//           transition: 'left .3s',
//         },
//         bannerActiveIndex: 0,
//         videoOldList: [],
//         videoGettingData: false,
//         videoCount: 0,
//       },
//       computed: {
//         videoList () {
//           return this.videoOldList.map(video => {
//             video.play = video.play > 10000 ? video.play / 10000 + '万' : video.play;
//             video.rank = video.rank > 10000 ? video.rank / 10000 + '万' : video.rank;
//             return video;
//           })
//         }
//       },
//       methods: {
//         handleClick () {
//           this.navHide = !this.navHide;
//         },
//         handleNavClick (index) {
//           this.navActiveIndex = index;
//         },
//         autoMove () {
//           setTimeout(() => {
//             if(this.bannerActiveIndex === 0 ) {
//               this.bannerStyle.transition = 'left .3s';
//             }

//             this.bannerActiveIndex ++;
//             this.bannerStyle.left = -this.bannerActiveIndex * this.bannerWidth + 'px';
//           }, 1500)
//         },
//         handleTransitionEnd () {
//           if(this.bannerActiveIndex === 3) {
//             this.bannerActiveIndex = 0;
//             this.bannerStyle.left = 0;
//             this.bannerStyle.transition = 'none';
//           }
//           this.autoMove();
//         },
//         handleScroll (e) {
//           const { scrollHeight, offsetHeight, scrollTop } = e.target;
//           const toBottomHeight = scrollHeight - offsetHeight - scrollTop;
//           const videoLength = this.videoList.length;

//           if(videoLength === this.videoCount) { return; } 

//           if(toBottomHeight < 200 && !this.videoGettingData) {
//             this.videoGettingData = true;

//             axios.get('video', {
//               params: {
//                 start: this.videoList.length,
//                 offset: 12
//               }
//             }).then(res => {
//                 this.videoOldList.push(...res.data);
//                 this.videoGettingData = false;
//             })

//           }
//         },
//         getData () {
//           axios.all([
//             axios.get('nav'),
//             axios.get('banner'),
//             axios.get('video', {
//               params: {
//                 start: 0,
//                 offset: 12
//               }
//             })
//           ]).then(axios.spread((navRes, bannerRes, videoRes) => {
//             this.initNavList(navRes);
//             this.initBannerList(bannerRes);
//             this.initVideo(videoRes);
//           }));
//         },
//         initNavList (navRes) {
//           this.navList = navRes;
//         },
//         initBannerList (bannerRes) {
//           const bannerLaseEle = {...bannerRes[0]};
//           bannerLaseEle.id = Math.floor(Math.random() * 10000000);
//           this.bannerList = [...bannerRes, bannerLaseEle];
//         },
//         initVideo (videoRes) {
//           this.videoCount = videoRes.count;
//           this.videoOldList = videoRes.data;
//         }
//       },
//       created () {
//         this.getData();
//       },
//       mounted () {
//         this.autoMove();
//       }
//     })
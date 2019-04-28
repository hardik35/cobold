<template>
  <div>
    
    <div style="display: flex; width: 80%; margin: auto">
        <el-select style="flex-grow: 1"
          v-model="userSearchvalue"
          loading-text="Loading News with your keyword"
          no-data-text="No match"
          filterable
          remote
          reserve-keyword
          placeholder="Provide a keyword for your search"
          :remote-method="remoteMethod"
          :loading="loading">
        <el-option
          v-for="(headlines, index) in userSearchHeadlines"
          :key="index"
          :label="headlines"
          :value="headlines">
        </el-option>
        <infinite-loading @infinite="loadMoreSearchResults">
          <div slot="no-more" class="noMoreMessage">No more relevant results</div>
        </infinite-loading>
        </el-select>
        <el-button type="primary" @click="fetchUserSearchNews">Show results</el-button>
    </div>
    
    <p>{{newsHeadlines}}</p>
    <div class="flexWrapper" style="margin: 5% 0 0 0">
      <el-card class="box-card" v-for="(cards, index) in newsHeadlines">
        <img :src="imageHref[index]" style="width: 100%; height: 100%; min-height: 100%" alt="Error loading image">
        <div class="newsHeadlineStyler"><a :href="newsLinkHref[index]" target="new">{{ newsHeadlines[index] }}</a></div>
      </el-card>
    </div>

    <!-- for infinite-loading -->
    <infinite-loading @infinite="infiniteHandler">
      <div slot="no-more" class="noMoreMessage">No more relevant results</div>
    </infinite-loading>
    
  </div>
</template>

<script>





export default {

  name: 'HelloWorld',
  props: {
    // msg: String
  },
  data() {
      return {
        scrollState: '',
        newsHeadlines: [],
        imageHref: [],
        newsLinkHref: [],
        value: '',
        pageNumber: 0,
        userSearchvalue: '',
        loading: false,
        inputSearch: '',
        searchPageNumber: 1,
        // temporary variables for storing search results
        userSearchHeadlines: [],
        imageHrefTemp: [],
        newsLinkHrefTemp: [],
        // ends here
        // test: 0,
      }
    },
  methods: {
      remoteMethod(query) {
        //for fetching result as per user's search (can be improved with async and await)
        if (query !== '') {
          this.loading = true;
          this.userSearchvalue = query;
          // console.log(query);
          //to set the scroll state
          this.scrollState.reset();
          // to provide a gap between input entered and search begin
          setTimeout(() => {
            //for accessing global variables inside function
            let vm = this;
            // make the temporary arrays empty
            this.userSearchHeadlines = [];
            this.imageHrefTemp = [];
            this.newsLinkHrefTemp = [];
            // console.log(query);
            
            //fetching result for user's query
            this.$api.get('https://newsapi.org/v2/everything?q=' + query +'&sortBy=publishedAt&page=1&language=en&apiKey=68382f09d14c48488f2d573ae9158d74')
            .then(response => {
              
              // console.log(response);
              for (let i = 0; i < response.data.articles.length; i++) {
                this.userSearchHeadlines.push(response.data.articles[i].title);
                this.imageHrefTemp.push(response.data.articles[i].urlToImage);
                this.newsLinkHrefTemp.push(response.data.articles[i].url);              
            };
      })
          .catch(e => {
      
            // vm.loading = false;
            console.log(e);
      })
          .then(function () {
            vm.loading = false;
          // always executed
      });
            
            
          }, 600);

        } else {
          this.userSearchHeadlines = [];
          // this.options = [];
        }
    },

    infiniteHandler($state) {

      this.pageNumber++;
      // console.log("infinite");
      this.scrollState = $state;
      if (this.pageNumber <= 2){
        this.fetchNews($state);
      
        
      }
      else {
          $state.complete()
      }

    },

    fetchNews ($state) {
      // console.log(-3 + this.searchPageNumber);
      // console.log(this.pageNumber);
      if (this.pageNumber === -3 + this.searchPageNumber){
      this.scrollState = $state;
      // this.test++;
      this.searchPageNumber++;
      this.$api.get('https://newsapi.org/v2/everything?q=' + this.userSearchvalue +'&sortBy=publishedAt&page=' + this.searchPageNumber + '&language=en&apiKey=68382f09d14c48488f2d573ae9158d74') 
      .then(response => {
      // console.log(response);
      for (let i = 0; i < response.data.articles.length; i++) {
        this.newsHeadlines.push(response.data.articles[i].title);
        this.imageHref.push(response.data.articles[i].urlToImage);
        this.newsLinkHref.push(response.data.articles[i].url);

        // console.log(response.data.articles[i].title);
      };
      //to check if we have reached page 5
      if (this.searchPageNumber === 5){
        $state.complete();
        this.searchPageNumber = 1;
        this.pageNumber = 3;
        // $state.reset();
      }
      
      // console.log($state);
    })
    .catch(e => {
      // $state.error();
      // this.errors.push(e)
      console.log(e);
    })
    .then(function () {
      $state.loaded();
      //to set the scroll state to loaded
    // always executed
    });
  }
      
      else {
      this.$api.get('https://newsapi.org/v2/top-headlines?country=in&page=' + this.pageNumber +'&apiKey=68382f09d14c48488f2d573ae9158d74')
      .then(response => {
      for (let i = 0; i < response.data.articles.length; i++) {
        this.newsHeadlines.push(response.data.articles[i].title);
        this.imageHref.push(response.data.articles[i].urlToImage);
        this.newsLinkHref.push(response.data.articles[i].url);
      };
      
      
      $state.loaded();
      // console.log($state);
    })
    .catch(e => {
      console.log(e);
    })
    }
    
  },
  loadMoreSearchResults ($state) {
      // console.log("infinite handler gt");
      this.scrollState = $state;
      
      this.searchPageNumber++;
      this.$api.get('https://newsapi.org/v2/everything?q=' + this.userSearchvalue +'&sortBy=publishedAt&page=' + this.searchPageNumber + '&language=en&apiKey=68382f09d14c48488f2d573ae9158d74') 
      .then(response => {
      // console.log(response);
      for (let i = 0; i < response.data.articles.length; i++) {
        this.userSearchHeadlines.push(response.data.articles[i].title);
        this.imageHref.push(response.data.articles[i].urlToImage);
        this.newsLinkHref.push(response.data.articles[i].url);

        // console.log(response.data.articles[i].title);
      };
      //to check if we have reached page 5
      if (this.searchPageNumber === 5){
        $state.complete();
        this.searchPageNumber = 1;
        // $state.reset();
      }
      
      // console.log($state);
    })
    .catch(e => {
      // $state.error();
      // this.errors.push(e)
      console.log(e);
    })
    .then(function () {
       //to set the scroll state to loaded
    // always executed
      $state.loaded();
     
    });
  }, 
  fetchUserSearchNews () {
    // to take the first 20 values from temporary variables
    this.newsHeadlines = this.userSearchHeadlines.slice(0, 20); 
    this.imageHref = this.imageHrefTemp.slice(0, 20);
    this.newsLinkHref = this.newsLinkHrefTemp.slice(0, 20); 
    this.userSearchHeadlines = [];
    // to fetch result till 5 pages with search query
    this.pageNumber = -3;
    this.searchPageNumber = 1;
  }
  },
  mounted() {
    
  },
  components: {
    

  }

}
</script>


<style>

.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
.el-icon-arrow-down {
    font-size: 12px;
  }
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 30%; 
    display: inline-block; 
    margin-bottom: 3%;
    height: 40vh;
  }
  a {
    text-decoration: none;
    color: #409eff;
  }

  a:hover {
    color: #1989fa;
  }

  .el-select {
    width: 80%;
    margin: 0 0% 0 0%;
  }
  
  .flexWrapper {
    display: flex; 
    flex-wrap: wrap; 
    justify-content: space-around;
    /*min-height: 90vh*/
  }

.scroll-area {
  position: relative;
  margin: auto;
  width: 98vw;
  height: 90vh;
  }

.el-card__body {
    padding: 0px !important;
    height: 70%;
    /*to override element's style*/
  }
  .newsHeadlineStyler {
    width: 90%;
    margin: auto;
    padding: 5% 0 0 0;
  }
  .el-button {
    /*padding: 13px 20px !important;*/
  }
  @media only screen and (max-width: 1024px) {
  .box-card {
    width: 40%; 
    
  }
}
@media only screen and (max-width: 768px) {
  .box-card {
    width: 80%; 
    height: 50vh;
  }
}
.noMoreMessage {
  font-size: 14px; 
  color: #606266;
  margin-top: 1%
}

  
</style>

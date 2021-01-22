<template>
  <el-container>
    <el-main style="padding:0px 10px;">
      <el-tabs value="event-list">
        <el-tab-pane label="图谱分析" name="event-list">
          <el-container>
            <el-header>
              <el-input
                placeholder="请输入内容"
                v-model="search.model.term"
                class="input-with-select"
                clearable
                @clear="onSearch"
                @keyup.enter.native="onSearch"
              >
                <el-select
                  v-model="search.type"
                  slot="prepend"
                  placeholder="选择视图"
                >
                  <el-option
                    label="syslog"
                    value="#/matrix/devops/syslog"
                  ></el-option>
                  <el-option
                    label="event"
                    value="#/matrix/devops/alert"
                  ></el-option>
                  <el-option label="新建视图" value="new"></el-option>
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="onSearch"
                ></el-button>
              </el-input>
            </el-header>
            <el-main>
              <GraphView :model="search.result" :global="global" v-loading="loading"></GraphView>
            </el-main>
            
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
const m3 = require("@cnwangzd/m3js");

import GraphView from '../components/GraphView.vue'

export default {
  name: "MainView",
  props: {
    global: Object
  },
  components:{
    GraphView
  },
  data() {
    return {
      loading: false,
      search: {
        model: {
          term: "match ('biz:数字国网','biz:开发测试') - [*] -> ()"
        },
        result: null
      },
    };
  },
  created(){
    this.onSearch();
  },
  methods: {
    onSearch() {
      
      this.loading = true;

      m3.callFS(
        "/matrix/graph/graph_service.js",
        encodeURIComponent(this.search.model.term)
      ).then( (rtn)=>{
          this.search.result = rtn.message[0].graph; 
          this.loading = false;
      }).catch( ()=>{
        this.loading = false;
      } );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.el-header {
  height: 40px!important;
  padding: 0px;
}

.el-main {
  padding: 0px;
  overflow: hidden;
}
.el-input-group__prepend > .el-select {
  width: 120px;
}
</style>

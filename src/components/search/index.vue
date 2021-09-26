<template>
    <el-container style="height: calc(100vh - 50px);">
        <el-header style="line-height: 60px;display:none;">
            <el-input placeholder="请输入关键字" v-model="search.term" 
                clearable
                @clear="onClear">
                <el-button slot="append" icon="el-icon-search" @click="onSearch" :loading="search.loading"></el-button>
            </el-input>
        </el-header>
        <el-main style="overflow: hidden;height: 100%;padding:0px;" v-if="search.result && search.result.all.length>0">
            <div style="width:96%;padding:10px;background:#f2f2f2;display:flex;flex-wrap:wrap;align-items:flex-start;">
                <el-button type="text" class="el-icon-s-data"> 结果</el-button>
                <template v-for="(v,k) in search.result">
                    <el-button type="default" :key="k" 
                        @click="onScrollTo(k)"
                        v-if="v.title && v.rows.length > 0">
                        {{v.title}}: {{v.rows.length}}
                    </el-button>
                </template>
            </div>
            <el-container style="height: 95%;">
                <el-main style="padding:0px 0px 0px 0px;height:100%;overflow:auto;" ref="container">
                    <!-- <el-tabs value="view">
                        <el-tab-pane name="view" key="view">
                            <span slot="label">按分类</span>
                            <template v-for="(v,k) in search.result">
                                <component 
                                    :ref="k"
                                    :id="'el-'+k"
                                    v-bind:is="k" :global="global" :dt="v" 
                                    :key="k" v-if="v.title && v.rows.length>0"></component>
                            </template>
                        </el-tab-pane>
                        <el-tab-pane name="timeline" key="timeline">
                            <template slot="label">时间线</template>
                            <timeline :model="search.result" :global="global"></timeline>
                        </el-tab-pane>
                    </el-tabs>  -->
                    <template v-for="(v,k) in search.result">
                        <component 
                            :ref="k"
                            v-bind:is="k" :global="global" :dt="v" 
                            :key="k" v-if="v.title && v.rows.length>0"></component>
                    </template>
                </el-main>
                
            </el-container>
            
        </el-main>

        <el-main style="background:#ffffff;text-align:center;" v-else>
            
        </el-main>

    </el-container>
    
</template>

<script>
import _isEmpty from 'lodash/isEmpty';
import { scrollTo } from 'scroll-js';

export default {
    name: "IndexView",
    components:{
        event: resolve => {require(['./event.vue'], resolve)},
        entity: resolve => {require(['./entity.vue'], resolve)},
        change: resolve => {require(['./change.vue'], resolve)},
        file: resolve => {require(['./file.vue'], resolve)},
        perf: resolve => {require(['./perf.vue'], resolve)},
        logs: resolve => {require(['./logs.vue'], resolve)},
        timeline: resolve => {require(['./timeline.vue'], resolve)}
    },
    props:{
        global: Object
    },
    data(){
        return {
            search:{
                term: "",
                class: {
                    value: "/matrix/devops/alert_status"
                },
                result: null,
                loading: false
            }
        }
    },
    watch:{
        "search.term"(val){
            if(!val){
                this.onClear();
            }
        },
        "search.result"(val){
            if(val){
                this.$emit("open-right");
            }
        }
    },
    created(){
        // 初始化preset
        /* try{
            let preset = decodeURIComponent(window.atob(this.getQueryVariable('preset')));
            _.extend(this.options,_.attempt(JSON.parse.bind(null, preset)));
        } catch(err){
            console.error(err);
        } */

        /* document.onkeydown = ()=> {
            let key = window.event.keyCode;
            if (key == 13) {
                this.onSearch();
            }
        } */

    },
    methods: {
        onScrollTo(name){
            let el = this.$refs[name][0].$el.offsetTop;
            let container = this.$refs['container'].$el;
            scrollTo(container, { top: el });
        },
        onClear(){
            this.search.result = null;
        },
        onSearch(){

            if(_isEmpty(this.search.term)){
                this.$message.info("请输入搜索关键字");
                return false;
            }

            this.search.loading = true;
            let param = encodeURIComponent( JSON.stringify( {term:this.search.term, preset:null} ) );
            this.m3.callFS("/matrix/m3search/searchByTerm.js", param).then(res=>{
                this.search.result = res.message;
                this.search.loading = false;
            }).catch(err=>{
                this.search.loading = false;
            })
        },
        getQueryVariable(variable){
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){return pair[1];}
            }
            return(false);
        },
        weclome(){

            this.m3.callFS("/matrix/m3search/weclome.js",null).then( (rtn)=>{
                let message = rtn.message;

                this.$notify({
                    title: '欢迎使用一键搜索',
                    type: 'success',
                    dangerouslyUseHTMLString: true,
                    message: message
                });
            } );
        }
    }
}
</script>

<style scoped>

</style>

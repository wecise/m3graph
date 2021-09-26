<template>
    <div class="container">
        <Split @onDragEnd="onDragEnd" ref="splitRef">
            <SplitArea :size="split.sizes[0]" :minSize="0" style="overflow:hidden;">
                <SearchBar @graph-data="onSetData" ref="searchBarRef"></SearchBar>
                <GraphHandler :graphData="graphData" 
                    :global="global"
                    @control-show="onControlShow"
                    @entity-search="onEntitySearch"></GraphHandler>
            </SplitArea>
            <SplitArea :size="split.sizes[1]" :minSize="0" style="overflow:hidden;position: relative;">
                <div style="position:absolute;top:0px;right:0px;font-size:16px;">
                    <el-button type="text" icon="el-icon-close" @click="onCloseRight"></el-button>
                </div>
                <ContentBar ref="contentRef" @open-right="onOpenRight"></ContentBar>
            </SplitArea>
        </Split>
    </div>
</template>

<script>
import _last from 'lodash/last';
import _split from 'lodash/split';

export default {
    name: "Index",
    props: {
        global: Object
    },
    data(){
        return {
            graphData: null,
            split: {
                sizes: [100,0]
            }
        }
    },
    components:{
        SearchBar: resolve => {require(['./searchbar/index.vue'], resolve)},
        GraphHandler: resolve => {require(['./GraphHandler.vue'], resolve)},
        ContentBar: resolve => {require(['../search/index.vue'], resolve)}
    },
    methods:{
        onControlShow(data){
            this.$refs['searchBarRef'].$children[0].control.show = data;
        },
        onSetData(data){
            this.graphData = data;
        },
        onEntitySearch(data){
            this.$refs.contentRef.search.term = _last(_split(data.id,':'));
            this.$refs.contentRef.onSearch();
        },
        onDragEnd(){
            this.eventHub.$emit("window-resize");
        },
        onResetRight(){
            this.$refs.splitRef.reset();
        },
        onOpenRight(){
            this.split.sizes = [70,30];
        },
        onCloseRight(){
            this.split.sizes = [100,0];
        }
    }
}
</script>

<style scoped>
    .container{
        position: relative;
        width:100%;
    }
</style>
<template>
    <div class="container">
        <SearchBar @graph-data="onSetData" ref="searchBarRef"></SearchBar>
        <GraphHandler :graphData="graphData" 
            :global="global"
            @control-show="onControlShow"></GraphHandler>
    </div>
</template>

<script>
import GraphHandler from './GraphHandler';
import SearchBar from './searchbar/index';

export default {
    name: "Index",
    props: {
        global: Object
    },
    data(){
        return {
            graphData: null
        }
    },
    components:{
        GraphHandler,
        SearchBar
    },
    methods:{
        onControlShow(data){
            this.$refs.searchBarRef.control.show = data;
        },
        onSetData(data){
            this.graphData = data;
        }
    }
}
</script>

<style scoped>
    .container{
        position: relative;
    }
</style>
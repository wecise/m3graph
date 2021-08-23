<template>
    <div class="container">
        <SearchBar ref="searchBarRef"></SearchBar>
        <GraphHandler :model="model"
            @control-show="onControlShow"></GraphHandler>
    </div>
</template>

<script>
import GraphHandler from './GraphHandler';
import SearchBar from './SearchBar';

export default {
    name: "Index",
    props: {
        model: Object
    },
    components:{
        GraphHandler,
        SearchBar
    },
    methods:{
        onControlShow(data){
            this.$refs.searchBarRef.control.show = data;
        }
    }
}
</script>

<style scoped>
    .container{
        position: relative;
    }
</style>
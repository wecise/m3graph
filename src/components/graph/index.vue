<template>
    <div class="container">
        <SearchBar></SearchBar>
        <GraphHandler :model="model" v-if="model && model.length>0"></GraphHandler>
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
    }  
}
</script>

<style scoped>
    .container{
        position: relative;
    }
</style>
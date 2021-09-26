<template>
    <component v-bind:is="currentView" 
        transition="fade" transition-mode="out-in"
        @toggle-view="onToggleView"
        @graph-data="onSetData"></component>
</template>

<script>


export default {
    name: "index",
    components: {
        SearchBar: resolve => {require(['../searchbar/SearchBar.vue'], resolve)},
        PathBar: resolve => {require(['../searchbar/PathBar.vue'], resolve)},
        AdvBar: resolve => {require(['../searchbar/AdvBar.vue'], resolve)}
    },
    data(){
        return {
            currentView: 'SearchBar'
        }
    },
    methods:{
        onToggleView(data){
            this.currentView = data;
        },
        onSetData(data){
            this.$emit("graph-data", data);
        }
    }
}
</script>
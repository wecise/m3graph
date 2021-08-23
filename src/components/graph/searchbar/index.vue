<template>
    <component v-bind:is="currentView" 
        transition="fade" transition-mode="out-in"
        @toggle-view="onToggleView"
        @graph-data="onSetData"></component>
</template>

<script>
import SearchBar from '../searchbar/SearchBar';
import PathBar from '../searchbar/PathBar';
import AdvBar from '../searchbar/AdvBar';

export default {
    name: "index",
    components: {
        SearchBar,
        PathBar,
        AdvBar
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
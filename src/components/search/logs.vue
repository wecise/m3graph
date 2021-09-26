<template>
    <div class="container" v-if="dt && dt.rows.length>0">
        <div>
            <el-button type="text" icon="el-icon-warning"> {{dt.title}}</el-button>
        </div>   
        <div class="animated fadeIn chart-container" v-for="(chart,index) in dt.rows" :key="index">
            <logView :model="chart"></logView>
        </div>
    </div>
</template>

<script>
import logView from './logView.vue';

export default{
    props:{
        dt:Object
    },
    components:{
        logView
    }
}
</script>

<style scoped>
    .container{
        padding: 20px;
        background: #f2f2f2;
    }
    .chart-container{
        padding: 20px;
        background: #ffffff;
    }
</style>

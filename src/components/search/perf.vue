<template>
    <div class="container" v-if="dt && dt.rows.length>0">
        <div>
            <el-button type="text" icon="el-icon-warning"> {{dt.title}}</el-button>
        </div>   
        <div class="animated fadeIn chart-container" v-for="(chart,index) in dt.rows" :key="index">
            <lineChart :model="chart"></lineChart>
        </div>
    </div>
</template>

<script>
import lineChart from './lineChart.vue';

export default{
    props:{
        dt:Object
    },
    components:{
        lineChart
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

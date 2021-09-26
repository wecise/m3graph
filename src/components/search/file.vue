<template>
    <div class="container">
        <div>
            <el-button type="text" icon="el-icon-warning"> {{dt.title}}</el-button>
        </div>   
        <div style="display:flex;flex-flow: wrap;" class="animated fadeIn">
            <el-button type="default" class="btn-entity" v-for="(item,index) in dt.rows" :key="index">
                <el-image style="width:64px;margin:5px;" :src="item | pickIcon"></el-image>
                <div>
                    <p><span>名称：</span>{{item.name}}</p>
                    <p><span>作者：</span>{{item.author}}</p>
                    <p><span>位置：</span><el-input :value="item.parent"></el-input></p>
                    <p><span>创建：</span>{{moment(item.ctime).format("YYYY-MM-DD hh:mm:ss")}}</p>
                    <p><span>描述：</span>{{item|pickRemark}}</p>
                </div>
            </el-button>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash';

    export default {
        props:{
            dt: Object
        },
        data(){
            return {
                
            }
        },
        filters: {
            pickIcon(item){
                try{
                    return `/static/assets/images/files/png/${item.ftype}.png`;
                }
                catch(error){
                    return `/static/assets/images/files/png/matrix.png`;
                }
            },
            pickRemark(item){
                if (!_.isEmpty(item.attr) || !_.isEqual(item.attr, 'null')) {
                    return _.attempt(JSON.parse.bind(null, item.attr)).remark;
                }
            }
        }
    }
</script>

<style scoped>
    .container{
        padding: 20px;
        background: #f2f2f2;
    }
    .btn-entity{
        max-width: 20em;
        width: 20em;
        height:auto;
        border-radius: 10px!important;
        margin: 5px;
        border: unset;
        box-shadow: 0 0px 5px 0 rgba(0, 0, 0, 0.05);
    }
    .btn-entity p{
        text-align: left;
    }
    
    .btn-entity p>span{
        color:#888888;
    }
</style>

<style>
    .btn-entity p .el-input--mini{
        width: auto;
    }
    .btn-entity p .el-input--mini .el-input__inner{
        border: unset!important;
    }
</style>

<template>
    <div class="container">
        <div>
            <el-button type="text" icon="el-icon-warning"> {{dt.title}}</el-button>
        </div>   
        <div class="animated fadeIn entity-box">
            <el-button type="default" class="btn-entity" v-for="(item,index) in dt.rows" :key="index">
                <el-image style="width:64px;margin:5px;" :src="item | pickIcon"></el-image>
                <div>
                    <p><span>名称：</span>{{item.name}}</p>
                    <p><span>IP：</span>{{item.ip}}</p>
                    <p><span>OS：</span>{{item.os}}</p>
                    <p><span>站点：</span>{{item.node}}</p>
                    <p><span>部门：</span>{{item.department}}</p>
                    <p><span>应用：</span>{{item.desc}}</p>
                    <p><span>创建时间：</span>{{moment(item.vtime).format("YYYY-MM-DD hh:mm:ss")}}</p>
                    <p><span>ID：</span>{{item.id}}</p>
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
                    let ftype = _.last(item.class.split("/"));
                    return `/static/assets/images/entity/png/${ftype}.png`;
                }
                catch(error){
                    return `/static/assets/images/entity/png/matrix.png`;
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
        max-width: 100%;
        width: 100%;
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

    .entity-box{
        display:flex;
        flex-flow: wrap;
        padding: 10px;
    }

</style>

<style>
    .entity-box .el-button+.el-button {
        margin-left: 6px!important;
    }
</style>

<template>
    <el-container class="search-bar">
        <el-header style="display:flex;height:35px;line-height:35px;padding:0px;">
            <el-button type="text" :icon="controlStatus" @click="control.show=!control.show"></el-button>
            <template v-if="control.show">
                <el-input v-model="search.term" placeholder="搜索实体、活动关键字" clearable autofocus class="input">
                    <template slot="prepend">
                        <el-dropdown trigger="hover" placement="top-end"  :hide-on-click="true">
                            <el-tooltip content="选则实体类">
                                <el-button type="text" size="mini">
                                    <span class="el-icon-office-building" style="font-size:16px;"></span>
                                </el-button>
                            </el-tooltip>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-input>
                <el-button type="text" class="path">
                    路径
                </el-button>
                <el-button type="text" class="adv">
                    高级
                </el-button>
                <el-button type="success" class="search">
                    <span class="el-icon-search"></span>
                </el-button>
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                        <el-button type="text" icon="el-icon-folder-opened" ></el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item >新建</el-dropdown-item>
                        <el-dropdown-item divided>打开</el-dropdown-item>
                        <el-dropdown-item >打开到</el-dropdown-item>
                        <el-dropdown-item divided>保存</el-dropdown-item>
                        <el-dropdown-item >另存为</el-dropdown-item>
                        <el-dropdown-item >另存为PDF</el-dropdown-item>
                        <el-dropdown-item divided>导入</el-dropdown-item>
                        <el-dropdown-item >导出</el-dropdown-item>
                        <el-dropdown-item divided>删除</el-dropdown-item>
                        <el-dropdown-item divided>打印</el-dropdown-item>
                        <el-dropdown-item divided>关闭</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
        </el-header>
        <el-main ref="mainView" style="width:30vw;height:40vh;padding:0px;border-top:1px solid #409EFF;" v-show="model">
            <!-- <div class="div-hover-effect" style="display:flex;padding:10px;cursor:pointer;" 
                v-for="item in search.result"
                @click="onSelect(item)"
                draggable="true" 
                @dragstart="onDragStart(item,$event)"
                @dragend="onDragEnd($event)">
                <el-image :src="item | pickIcon" style="width:15%;height:15%;max-width:48px;min-width:48px;" slot="suffix"></el-image>
                <div style="height:48px;line-height:48px;width:80%;padding-left:10px;">#{ item.value }#</span></div>
                <el-tooltip content="拖动到画布" open-delay="500">
                    <el-button type="text" icon="el-icon-menu" style="padding-left:10px;cursor:pointer;">
                    </el-button>
                </el-tooltip>
                <el-tooltip content="实体分析" open-delay="500">
                    <el-button type="text" icon="el-icon-postcard" style="padding-left:10px;cursor:pointer;" @click="onDiagnosis(item)">
                    </el-button>
                </el-tooltip>
            </div> -->
            <el-button type="text" icon="el-icon-down"></el-button>
        </el-main>
        <el-footer ref="footerView" style="width:30vw;padding:0px;border-top:1px solid #409EFF;height:auto;" v-if="selected">
            
        </el-footer>
    </el-container>
</template>

<script>


export default {
    name: "SearchBar",
    data(){
        return {
            control: {
                show: true
            },
            search: {
                term: ""
            },
            model: null,
            selected: null
        }
    },
    computed:{
        controlStatus(){
            if(this.control.show){
                return 'el-icon-arrow-left';
            } else {
                return 'el-icon-arrow-right';
            }
        }
    },
    components:{
        
    }  
}
</script>

<style scoped>
    .search-bar.el-container{
        position: absolute;
        left: 10px;
        top: 10px;
        background: #f2f2f2;
    }
    .search-bar .el-header{
        text-align: center;
        border: 1px solid #f2f2f2;
    }
    .search-bar .el-button+.el-button {
        margin-left: 0px;
    }
    .search-bar .el-button{
        color: #777777;
        width: 50px;
        border-radius: 0px!important;
    }

    .search-bar .input{
        width: auto;
        min-width: 30vw;
    }

    .search-bar .search span{
        color: #ffffff;
    }
</style>
<style>
    .search-bar .el-input-group__append, .el-input-group__prepend{
        border: unset!important;
    }
    .search-bar .el-input--mini .el-input__inner {
        height: 33px!important;
        line-height: 33px!important;
        border: 1px solid #f2f2f2!important;
        border-radius: 0px!important;
    }
</style>
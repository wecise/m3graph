<template>
    <el-container>
        <el-header>
            <el-tooltip :content="$t('event.actions.runningMode')"  placement="top">
                <el-button type="text" @click="onToggle" icon="el-icon-notebook-2"></el-button>
            </el-tooltip>
            <el-tooltip :content="$t('event.actions.refresh')"  placement="top">
                <el-button type="text" icon="el-icon-refresh" @click="onRefresh"></el-button>
            </el-tooltip>
            
            <el-tooltip :content="$t('event.actions.export')" placement="top" >
                <el-dropdown @command="onExport" style="margin-left:5px;">
                    <span class="el-dropdown-link">
                        <i class="el-icon-download el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="csv">CSV</el-dropdown-item>
                        <el-dropdown-item command="json">JSON</el-dropdown-item>
                        <!--el-dropdown-item command="pdf">PDF</el-dropdown-item-->
                        <el-dropdown-item command="png">PNG</el-dropdown-item>
                        <!--el-dropdown-item command="sql">SQL</el-dropdown-item-->
                        <el-dropdown-item command="xls">XLS (Excel 2000 HTML format)</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-tooltip>
            
            <el-tooltip :content="$t('event.actions.runningMode')" placement="top" >
                <el-dropdown style="margin-left:5px;">
                    <span class="el-dropdown-link">
                        <el-button type="text" icon="el-icon-s-platform"></el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="m">{{ $t('event.actions.monitorModel') }}</el-dropdown-item>
                        <el-dropdown-item command="o">{{ $t('event.actions.operationModel') }}</el-dropdown-item>
                        <el-dropdown-item command="f" divided>{{ $t('event.actions.fullscreenModel') }}</el-dropdown-item>
                        <el-dropdown-item command="e">{{ $t('event.actions.exitFullscreenModel') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-tooltip>
            <el-tooltip :content="control.ifRefresh==1?'自动刷新启用中':'自动刷新关闭中'" placement="top" >
                <el-dropdown style="float:right;">
                    <span class="el-dropdown-link">
                        <div>
                            {{ control.ifRefresh==1 ? '自动刷新' : '刷新关闭' }}
                            <el-switch
                                v-model="control.ifRefresh"
                                active-color="#13ce66"
                                inactive-color="#dddddd"
                                active-value="1"
                                inactive-value="0"
                                @change="toggleSummaryByRefresh">
                            </el-switch>
                        </div>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>15s</el-dropdown-item>
                        <el-dropdown-item>30s</el-dropdown-item>
                        <el-dropdown-item>60s</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-tooltip>
            <el-dropdown style="padding-right:10px;float: right;">
                <span class="el-dropdown-link">
                    <i class="el-icon-menu el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <el-tooltip :content="control.ifSmart==1?'智能分析启用中':'智能分析关闭中'" placement="top" >
                            <div>
                                {{control.ifSmart==1?'智能分析':'智能分析'}}
                                <el-switch
                                    v-model="control.ifSmart"
                                    active-color="#13ce66"
                                    inactive-color="#dddddd"
                                    active-value="1"
                                    inactive-value="0"
                                    @change="toggleSummaryBySmart">
                                </el-switch>
                            </div>
                        </el-tooltip>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <el-tooltip :content="control.ifAiGroup==1?'智能分组启用中':'智能分组关闭中'" placement="top" >
                            <div>
                                {{control.ifAiGroup==1?'智能分组':'智能分组'}}
                                <el-switch
                                    v-model="control.ifAiGroup"
                                    active-color="#13ce66"
                                    inactive-color="#dddddd"
                                    active-value="1"
                                    inactive-value="0"
                                    @change="toggleSummaryByGroup">
                                </el-switch>
                            </div>
                        </el-tooltip>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>   
        <el-main @mouseup.native="onMainClick" id="container">
        </el-main>
        <el-footer>
            <div class="toolbar">
                
            </div>
            <div class="footbar">
                
            </div>
        </el-footer>
    </el-container>
</template>
<script>
import _ from "lodash";
import $ from "jquery";
import G6 from '@antv/g6';
const m3 = require("@cnwangzd/m3js");
window.moment = require("moment");

export default {
  name: "GraphView",
    props: {
        model: Object,
        global: Object
    },
    data(){
        return {
            graph: null,
            dt:{
                rows:[],
                columns: [],
                selected: [],
                contextmenu: {
                    show: false,
                    list: []
                },
                summary: null
            },
            info: [],
            control:{
                ifSmart: 1,
                ifAiGroup: 1,
                ifRefresh: 1
            }
        }
    },
    watch: {
        'model.rows': {
            handler(){
                this.dt.rows = [];
                this.initData();
                this.dt.summary = _.groupBy(this.dt.rows,'severity');
            },
            deep:true
        },
        dt: {
            handler(){
                this.info = [];
                this.info.push(`共 ${this.dt.rows.length} 项`);
                this.info.push(`已选择 ${this.dt.selected.length} 项`);
                this.info.push(this.moment().format("YYYY-MM-DD HH:mm:ss.SSS"));
            },
            deep:true,
            immediate:true
        }
    },
    computed:{
        metaColumns(){
            try{
                return this.model.columns[this.model.rootClass];
            } catch(err){
                return [];
            }
        }
    },
    created(){
        m3.callFS("/matrix/eventConsole/getContextMenu.js").then( (rtn)=>{
            this.dt.contextmenu.list = rtn.message;
        } );
    },
    mounted(){  
        this.initData();

        window.global = this.global;

        this.$refs.table.bodyWrapper.addEventListener('scroll', (res) => {

            let height = res.target;
            let clientHeight = height.clientHeight;
            let scrollTop = height.scrollTop;
            let scrollHeight = height.scrollHeight;

            if(clientHeight + scrollTop + 300 > scrollHeight){
                console.log(clientHeight + scrollTop);
                console.log(scrollHeight);
                this.$parent.$parent.$parent.$parent.$parent.$parent.onSearch();
            }

        },true);
    },
    methods: {
        onRefresh(){
            
        },
        pickFtype(key){

            let rtn = 'string';
            try{
                rtn = _.find(this.metaColumns,{data:key}).type;
            } catch(err){
                return rtn;
            }
            return rtn;

        },
        initData(){
            let graph = this.graph;
            const container = document.getElementById("container");
            const width = container.scrollWidth;
            const height = container.scrollHeight || 500;
            graph = new G6.Graph({
                container: 'container',
                width,
                height,
                defaultNode: {
                    type: 'circle',
                    size: 80
                },
                layout: {
                   type: 'grid',
                    begin: [0, 0],
                    preventOverlap: true, // nodeSize or size in data is required for preventOverlap: true
                    preventOverlapPdding: 20,
                    nodeSize: 30,
                    condense: false,
                    rows: 5,
                    cols: 3,
                    sortBy: 'degree',
                },
            });

            graph.node(function (node) {
                return {
                    label: node.id,
                };
            });
            
            if(this.graph){
                graph.data(this.model);
                graph.render();
                graph.refresh();
            } else {
                graph.data(this.model);
                graph.render();
            }
            
        },
        rowClassName({rowIndex}){
            return `row-${rowIndex}`;
        },
        // 监听鼠标操作 停止自动刷新
        onMainClick(){
            this.$root.control.ifRefresh=0;
        },
        onSelectionChange(val) {
            this.dt.selected = val;
        },
        // 右键菜单
        onRowContextmenu(row, column, event){
            event.preventDefault(); 
            event.stopDefault();

            this.$nextTick(() => {
                this.$refs.menu.open(event, { row: row });
            })
        },
        // 右键菜单事件
        onContextmenuClick(vm, event){
            console.log(vm, event)
        },
        onAction(evt){
            if(_.isEmpty(this.dt.selected)){
                this.$message({
                    type: "info",
                    message: "请选择事件！"
                });
                return false;
            }

            this.$root.action( {list: this.dt.selected, action:evt});
        },
        onToggle(){
            this.$root.toggleModel(_.without(['view-normal','view-tags'],window.EVENT_VIEW).join(""));
        },
        onExport(type){
    
            let options = {
                csvEnclosure: '',
                csvSeparator: ', ',
                csvUseBOM: true,
                ignoreColumn: [0,1],
                fileName: `tableExport_${this.moment().format("YYYY-MM-DD HH:mm:ss")}`,
                type: type,
            };

            if(type === 'png'){
                //$(this.$refs.table.$el.querySelectorAll("table")).tableExport(options);
                $(this.$refs.table.$el.querySelector("table.el-table__body")).tableExport(options);
            } else if(type === 'pdf'){
                _.extend(options, {
                    jspdf: {orientation: 'l',
                            format: 'a3',
                            margins: {left:10, right:10, top:20, bottom:20},
                            autotable: {styles: {fillColor: 'inherit', 
                                                    textColor: 'inherit'},
                                        tableWidth: 'auto'}
                    }
                });
                $(this.$refs.table.$el.querySelectorAll("table")).tableExport(options);
            } else {
                $(this.$refs.table.$el.querySelectorAll("table")).tableExport(options);
            }
            
        }
    }
}
</script>
<style scoped>

.el-container{
    height:calc(100vh - 160px)!important;
    border: 1px solid #dddddd!important;
}

.el-header{
    height:30px!important;
    line-height:30px;
    background:#f2f2f2;
    padding:0 10px;
    border-bottom: 1px solid #ffffff;
}

.el-main{
    border-top: 1px solid #dddddd;
    padding: 0px;
    overflow: hidden;
}

.el-main > .el-table{
    height: 100%;
    overflow: auto;
}

.el-main > .el-table .el-table--small td{
    padding: 0px;
}

.el-footer{
    height: auto!important;
    padding: 5px 0 0 0;
}

.el-footer > .toolbar {
  padding: 0 0 5px 5px;
  border-bottom: 1px solid #dddddd;
}
.el-footer > .footbar{
    border-top: 1px solid #ffffff;
    height:30px;
    line-height: 30px;
    padding: 0 0 0 10px;
    font-size: 12px;
    background: #f2f2f2;
}

.el-table {
    height:100%!important;
    overflow: hidden!important;
}

.el-divider{
    margin: 0px;
}

</style>
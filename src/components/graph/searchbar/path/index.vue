<template>
    <el-container>
        <el-header style="height:100%;line-height:100%;padding:10px;display:flex;flex-direction: column;">
            <InputBar :model="item" 
                :data-id="item.id" 
                :key="item.id" v-for="item in uniqBy(trace.nodes,'id')" 
                :ref="item.id">
            </InputBar>
            <br>
            <NewInputBar></NewInputBar>
        </el-header>
        <el-main style="padding:0px 10px;" class="topological-analysis">
            <el-table :data="trace.paths.rows" 
                    ref="multipleTable"
                    tooltip-effect="dark"
                    @selection-change="onSelectionChange"
                    style="width: 100%"
                    v-if="trace.paths.rows.length > 0">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form>
                        <el-form-item v-for="(v,k) in omitBy(props.row,['num','class'])" :key="k">
                            <template slot="label">
                                <i class="el-icon-place" style="color: #67c239;"></i>
                            </template>
                            <span>#{ v }#</span>
                        </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column :prop="col.data" :label="col.title" v-for="(col,index) in trace.paths.columns" :key="index"></el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
import _ from 'lodash';
import InputBar from './InputBar';
import NewInputBar from './NewInputBar';

export default {
    name: 'index',    
    props: {
        pathType: String
    },
    components:{
        InputBar,
        NewInputBar
    },
    data(){
        return {
            trace: {
                newItem: {
                    id: "",
                    type: "",
                    value: ""
                },
                nodes: [],
                paths: {
                    rows: [], 
                    columns: []
                },
                selectedPaths: []
            }
        }
    },
    created(){
        //eventHub.$on("TOPOLOGICAL-ANALYISS-TRACE",this.setTrace);
    },
    mounted(){
        
        /* _.delay(()=>{
            let sortable = Sortable.create(this.$refs.topologicalAnalysisInputList,{
                handle: ".handleSort",
                dataIdAttr: 'data-id',
                onChange(evt) {
                    let nodes = _.cloneDeep(this.trace.nodes);
                    this.trace.nodes = _.map(sortable.toArray(),(v)=>{
                        return _.find(nodes,{id:v});
                    });
                }
            });
        },1000) */
    },
    methods:{
        uniqBy(arr,prop){
            return _.uniqBy(arr,prop);
        },
        omitBy(arr,prop){
            return _.omit(arr,prop);
        },
        setTrace(node){
            this.trace.nodes.push(node);
        },
        onSearch(){
            
            if(this.trace.nodes.length < 2){
                this.$message("请选择节点！");
                return false;
            }
            let term = {
                        pathType: this.pathType,
                        nodes: _.map(this.trace.nodes,(v)=>{
                            return _.extend(_.omit(v,["cell"]),{ edgeProperty: _.omit(this.$refs[v.id][0].edge,["list","show"]) });
                        })
                    };
            
            let rows = [];
            let cols = [];

            try{

                this.m3.callFS("/matrix/m3graph/paths-by-id.js",encodeURIComponent(JSON.stringify(term))).then(res=>{
                    let rtn = res.message.result.data[0].graph;  
                    
                    if(!_.isEmpty(rtn.paths)){
                        _.forEach(rtn.paths,(v,index)=>{
                            rows.push( _.merge({num:`路径${++index}`,class:"path"},v));
                        })
                        cols = _.concat([{data:"num",title:"序号"}],_.map(rtn.pathtags,function(v){ return {data:v,title:v}}));
                    }
                    _.extend(this.trace.paths, {rows: rows,  columns: cols});
                })

                

            } catch(err){
                _.extend(this.trace.paths, {rows: rows,  columns: cols});
            }
            
        },
        onSelectionChange(val){
            
        }
    }
}
</script>
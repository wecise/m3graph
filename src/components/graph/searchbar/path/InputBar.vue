<template>
    <el-container>
        <el-header style="height:30px;ling-height:30px;padding:0px;">
            <el-autocomplete placeholder="请输入实体" 
                            v-model="model.id" 
                            :fetch-suggestions="querySearchAsync"
                            @select="handleSelect"
                            :trigger-on-focus="false"
                            style="width:100%;">
                <el-button slot="prepend" icon="el-icon-menu" class="handleSort input-el-button"></el-button>
                <el-button slot="append" icon="el-icon-arrow-down"  @click="edge.show = !edge.show" v-if="edge.show"></el-button>
                <el-button slot="append" icon="el-icon-arrow-right" @click="edge.show = !edge.show" v-else></el-button>
                <el-button slot="append" icon="el-icon-postcard" @click="onDiagnosis(model)"></el-button>
                <el-button slot="append" @click="onRemove(model.id)">
                    <span class="el-icon-circle-close" style="font-size:16px;font-weight:600;"></span>
                </el-button>
            </el-autocomplete>
        </el-header>
        <el-main v-if="edge.show" style="background:#ffffff;">
            <el-form label-width="50px" label-position="top">
                <el-form-item label="关系" style="font-weight:noomal;">
                    <el-select v-model="edge.edgeType" placeholder="请选择关系类型">
                        <el-option
                            v-for="item in edge.list"
                            :key="item.name"
                            :label="item.remedy"
                            :value="item.name">
                            <span style="float: left">{{ item.remedy }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                        </el-option>
                    </el-select>
                    <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        content="实体连接关系选择">
                        <span slot="reference" class="el-icon-question" style="float:right;"></span>
                    </el-popover>
                </el-form-item>
                <el-form-item label="几跳" style="font-weight:normal;">
                    <el-input-number v-model="edge.edgeStep" :min="1"></el-input-number>
                    <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        content="实体连接层级设置，实体直接连接为1跳，间接连接为2跳，以此类推。">
                        <span slot="reference" class="el-icon-question" style="float:right;"></span>
                    </el-popover>
                </el-form-item>
                <el-form-item label="自定义" style="font-weight:normal;">
                    <el-input type="textarea" :rows=3 v-model="edge.edgeCustom" @blur="onBlur" clearable style="border: 1px solid #ddd;"></el-input>
                    <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        content="请参考图查询文档，自定义关系类型及实体连接层级设置，举例：[:connect*1]">
                        <span slot="reference" class="el-icon-question" style="float:right;"></span>
                    </el-popover>
                </el-form-item>
            </el-form>
        </el-main>
    </el-container>
</template>
<script>
import _ from 'lodash';

export default {
    name: "InputBar",
    props: {
        model: Object
    },
    data(){
        return {
            entity: {
                list: [],
                timeout:  null,
            },
            edge: {
                show: false,
                list: null,
                edgeType: "*",
                edgeStep: 0,
                edgeCustom: ""
            }
        }
    },
    watch:{
        'edge.edgeCustom':function(val){
            this.edge.edgeType = val.split("*")[0].replace(/:/,"");
            this.edge.edgeStep = val.split("*")[1];
        }
    },
    created(){
        this.m3.callFS("/matrix/m3graph/edges.js",null).then(res=>{
            this.edge.list = res.message;
        })
    },
    methods:{
        onBlur(){
            this.edge.edgeType = this.edge.edgeCustom?this.edge.edgeCustom.split("*")[0].replace(/:/,""):"*";
            this.edge.edgeStep = this.edge.edgeCustom?this.edge.edgeCustom.split("*")[1]:0;
        },
        onDiagnosis(node){
            //inst.app.$refs.graphDiagnosisRef.diagnosisAdd( node );
        },
        onRemove(id){
            const self = this;
            self.$parent.$parent.$parent.trace.nodes.splice(_.findIndex(self.$parent.$parent.$parent.trace.nodes,{id:id}),1);
        },
        querySearchAsync(term, cb) {
            
            try{
                if(_.isEmpty(term)){
                    return false;
                }

                this.m3.callFS("/matrix/m3graph/entity-search-by-term.js", encodeURIComponent(term)).then(res=>{
                    let entitys = res.message;

                    let results = term ? entitys.filter(this.createStateFilter(term)) : entitys;
        
                    clearTimeout(this.entity.timeout);
                    this.entity.timeout = setTimeout(() => {
                        cb(results);
                    }, 3000 * Math.random()); 
                })
                
            } catch(err){
                console.error(err);
            }
            
        },
        createStateFilter(term) {
            return (state) => {
                return (state.value.toLowerCase().indexOf(term.toLowerCase()) === 0);
            };
        },
        handleSelect(item) {
            console.log(item);
        }
    }
}
</script>
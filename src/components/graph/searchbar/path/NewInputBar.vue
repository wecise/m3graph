<template>
    <el-autocomplete placeholder="请输入实体" 
                    v-model="newModel.id" 
                    class="input-with-select topological-analysis-input"
                    :fetch-suggestions="querySearchAsync"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                    @keyup.enter.native="onNew">
        <template slot="prepend">
            <span class="el-icon-place"></span>
        </template>
        <el-button slot="append" @click="onNew">
            <span class="el-icon-circle-plus-outline" style="font-size:16px;font-weight:600;color:green;"></span>
        </el-button>
    </el-autocomplete>
</template>

<script>
import _ from 'lodash';

export default {
    name: "NewInputBar",
    data(){
        return {
            newModel: {
                id: "",
                value: ""
            },
            entity: {
                list: [],
                timeout:  null
            }
        }
    },
    methods:{
        onNew(){
            const self = this;
            
            let id = this.newModel.id && this.newModel.id.trim()
            if (!id) {
                return;
            }
            self.$parent.$parent.$parent.trace.nodes.push({
                id: this.newModel.id,
                cell: {edge:false}
            })
            this.newModel.id = "";
            
        },
        querySearchAsync(term, cb) {
            
            if(_.isEmpty(term)){
                return false;
            }

            this.m3.callFS("/matrix/graph/entity-search-by-term.js",encodeURIComponent(term)).then(res=>{
                let entitys = res.message;
                let results = term ? entitys.filter(this.createStateFilter(term)) : entitys;
            
                clearTimeout(this.entity.timeout);
                this.entity.timeout = setTimeout(() => {
                    cb(results);
                }, 50 * Math.random());
            })
        },
        createStateFilter(term) {
            return (state) => {
                return (state.value.toLowerCase().indexOf(term.toLowerCase()) === 0);
            };
        },
        handleSelect(item) {
            this.onNew();
        }
    }
}
</script>